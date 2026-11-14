import type {
  GeneratedImage,
  ImageFile,
  ImageGenerateRequest,
  ImageInstance,
  ImageOptions,
  JsonValue,
} from "@tau/plugins";
import { ARK_BASE_URL, SEEDREAM_MODELS } from "./catalog";

const MAX_GROUP_IMAGES = 15;
const MAX_REFERENCE_BYTES = 30_000_000;
const REFERENCE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export function parseConfig(config: JsonValue) {
  if (!config || typeof config !== "object" || Array.isArray(config))
    throw new Error("Seedream 连接配置无效");

  const apiKey = typeof config.apiKey === "string" ? config.apiKey.trim() : "";
  if (!apiKey) throw new Error("请填写火山方舟 API Key");

  const address = typeof config.baseUrl === "string" ? config.baseUrl.trim() : "";
  let url: URL;
  try {
    url = new URL(address || ARK_BASE_URL);
  } catch {
    throw new Error("请填写有效的火山方舟服务地址");
  }
  if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash)
    throw new Error("服务地址须使用 HTTPS，且不能包含用户名、密码、查询参数或片段");
  return { apiKey, baseUrl: url.href.replace(/\/+$/, "") };
}

function buildOptions(model: string, images: readonly ImageFile[], options?: ImageOptions) {
  const imageCount = images.length;
  const isSeedream55 = model.startsWith("doubao-seedream-5-5-");
  const isProOrFlash = /^doubao-seedream-5-0-(pro|flash)-/.test(model);
  const isSeedream4 = /^doubao-seedream-4-[05]-/.test(model);
  const isLite = /^doubao-seedream-5-0-(lite-|\d)/.test(model);
  const singleImageOnly = isSeedream55 || isProOrFlash;
  const maxReferences = singleImageOnly ? 10 : 14;
  if (imageCount > maxReferences)
    throw new Error(`当前 Seedream 模型最多支持 ${maxReferences} 张参考图`);

  const count = options?.count ?? 1;
  if (!Number.isInteger(count) || count < 1 || count > MAX_GROUP_IMAGES)
    throw new Error("Seedream 图片数量必须是 1 到 15 的整数");
  if (count > 1 && singleImageOnly)
    throw new Error("当前模型每次只生成一张图。可选择 Seedream 5.0 Lite、4.5 或 4.0 生成组图");
  if (count + imageCount > MAX_GROUP_IMAGES)
    throw new Error("Seedream 参考图与输出图片合计最多 15 张");

  const size = options?.size?.trim().toLowerCase();
  const quality = options?.quality?.trim().toLowerCase();
  if (quality && quality !== "auto")
    throw new Error("Seedream 没有单独的质量参数，请用尺寸指定分辨率");

  const format = options?.outputFormat;
  if (format && format !== "png" && format !== "jpeg")
    throw new Error("Seedream 输出格式支持 PNG 或 JPEG");
  if (isSeedream4 && format === "png") throw new Error("Seedream 4.x 输出格式为 JPEG");

  const background = options?.background?.trim().toLowerCase();
  if (background && !["auto", "transparent", "opaque"].includes(background))
    throw new Error("Seedream 背景模式支持 auto、transparent 或 opaque");
  if (background === "transparent" && (isSeedream4 || isLite))
    throw new Error("当前模型不支持透明背景，可选择 Seedream 5.5");
  if (background === "transparent" && format === "jpeg")
    throw new Error("透明背景需要 PNG 输出格式");
  if (
    background === "transparent" &&
    isProOrFlash &&
    (imageCount !== 1 || images[0]?.mimeType !== "image/png")
  )
    throw new Error("Seedream 5.0 Pro 和 Flash 生成透明背景需要一张透明 PNG 参考图");

  return {
    size: size && size !== "auto" ? size.replace(/k$/, "K") : undefined,
    output_format: isSeedream4
      ? undefined
      : (format ?? (background === "transparent" ? "png" : undefined)),
    background:
      background && (isSeedream55 || (!isSeedream4 && !isLite && background !== "auto"))
        ? background
        : undefined,
    sequential_image_generation: count > 1 ? "auto" : undefined,
    sequential_image_generation_options: count > 1 ? { max_images: count } : undefined,
  };
}

function encodeReference({ mimeType, content }: ImageFile): string {
  if (!REFERENCE_MIME_TYPES.has(mimeType) || !content.byteLength)
    throw new Error("Seedream 参考图须为非空 PNG、JPEG 或 WebP 图片");
  if (content.byteLength > MAX_REFERENCE_BYTES)
    throw new Error("Seedream 单张参考图不能超过 30 MB");

  // 分块长度取 3 的倍数，保证只有最后一块可能包含 Base64 填充。
  const chunkSize = 24 * 1024;
  let encoded = "";
  for (let offset = 0; offset < content.length; offset += chunkSize)
    encoded += btoa(String.fromCharCode(...content.subarray(offset, offset + chunkSize)));
  return `data:${mimeType};base64,${encoded}`;
}

function decodeImage(value: string, index: number): GeneratedImage {
  let binary: string;
  try {
    binary = atob(value);
  } catch {
    throw new Error("火山方舟返回了无效的图片 Base64 数据");
  }
  const format = binary.startsWith("\x89PNG\r\n\x1a\n")
    ? "png"
    : binary.startsWith("\xff\xd8\xff")
      ? "jpeg"
      : undefined;
  if (!format) throw new Error("火山方舟返回了无效的 PNG 或 JPEG 图片");
  const content = new Uint8Array(binary.length);
  for (let offset = 0; offset < binary.length; offset++)
    content[offset] = binary.charCodeAt(offset);
  return {
    name: `seedream-${index + 1}.${format}`,
    mimeType: `image/${format}`,
    content,
  };
}

function errorMessage(error: unknown, apiKey: string): string | undefined {
  if (!error || typeof error !== "object") return;
  if ("message" in error && typeof error.message === "string" && error.message.trim())
    return error.message.trim().replaceAll(apiKey, "[已隐藏]");
  if ("code" in error && typeof error.code === "string")
    return error.code.replaceAll(apiKey, "[已隐藏]");
}

async function parseResponse(
  response: Response,
  signal: AbortSignal,
  apiKey: string,
  maxImages: number
): Promise<GeneratedImage[]> {
  const failure = `火山方舟图片请求失败（HTTP ${response.status}）`;
  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    signal.throwIfAborted();
    if (!(error instanceof SyntaxError)) throw error;
    throw new Error(response.ok ? "火山方舟未返回有效的图片数据" : failure);
  }
  signal.throwIfAborted();
  const result = payload && typeof payload === "object" ? payload : {};
  const message = "error" in result ? errorMessage(result.error, apiKey) : undefined;
  if (!response.ok || message) throw new Error(message || failure);

  const data: unknown[] = "data" in result && Array.isArray(result.data) ? result.data : [];
  if (!data.length || data.length > maxImages) throw new Error("火山方舟未返回有效的图片列表");
  const images: GeneratedImage[] = [];
  let firstError: string | undefined;
  for (const item of data) {
    signal.throwIfAborted();
    if (!item || typeof item !== "object") throw new Error("火山方舟返回了无效的图片条目");
    if ("b64_json" in item && typeof item.b64_json === "string" && item.b64_json) {
      images.push(decodeImage(item.b64_json, images.length));
    } else if ("error" in item && item.error) {
      firstError ??= errorMessage(item.error, apiKey);
    } else {
      throw new Error("火山方舟未返回图片 Base64 数据");
    }
  }
  if (!images.length) throw new Error(firstError || "火山方舟未生成图片");
  return images;
}

export function createSeedreamInstance(
  config: JsonValue,
  modelId: string,
  fetcher: typeof fetch
): ImageInstance {
  const { apiKey, baseUrl } = parseConfig(config);
  const model = modelId.trim() || SEEDREAM_MODELS[0].id;

  const run = async (
    request: ImageGenerateRequest,
    signal: AbortSignal,
    images?: readonly ImageFile[]
  ) => {
    const executionSignal = AbortSignal.any([signal, AbortSignal.timeout(300_000)]);
    executionSignal.throwIfAborted();
    const prompt = request.prompt.trim();
    if (!prompt) throw new Error("图片要求不能为空");
    if (images && !images.length) throw new Error("图片编辑至少需要一张参考图");
    const options = buildOptions(model, images ?? [], request.options);
    const references = images?.map(encodeReference);

    const response = await fetcher(`${baseUrl}/images/generations`, {
      method: "POST",
      redirect: "error",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        image: references?.length === 1 ? references[0] : references,
        response_format: "b64_json",
        ...options,
      }),
      signal: executionSignal,
    });
    const results = await parseResponse(
      response,
      executionSignal,
      apiKey,
      request.options?.count ?? 1
    );
    executionSignal.throwIfAborted();
    return results;
  };

  return {
    generate: (request, signal) => run(request, signal),
    edit: (request, signal) => run(request, signal, request.images),
  };
}

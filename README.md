# Seedream 图片

用字节跳动 Seedream 根据文字生成图片，也可以上传参考图来修改图片或融合多张图片。生成结果可用于 Tau 的聊天、文档和白板。

## 安装与配置

1. 在火山方舟开通所需的 Seedream 模型，并在「API Key 管理」中创建 API Key。
2. 从 [GitHub Releases](https://github.com/LastKnightCoder/tau-plugin-images-seedream/releases) 下载插件 ZIP。在 Tau 桌面开发版打开「插件 → ⋯ → 从 ZIP 安装…」，导入 ZIP 后在「已安装」中启用「Seedream 图片」。移动开发版可用受控开发安装加载同一 ZIP。正式版通过插件中心安装已上架的插件。
3. 打开插件的「设置」，添加账号并填写 API Key。默认地址是 `https://ark.cn-beijing.volces.com/api/v3`，可改为提供同一方舟接口的 HTTPS 服务地址。
4. 选择已开通的模型。预选 Seedream 5.5，桌面下拉框另有 5.0 Pro、5.0 Flash、5.0 Lite、4.5 和 4.0，移动端可手动填写模型 ID。两端也可填写方舟推理接入点 ID（`ep-…`）。
5. 保存账号，在桌面「设置 → 图片生成」或移动端「我的 → AI → 图片生成」选用它。若要在桌面对话中使用，前往「MCP 服务器」启用图片生成工具。

## 生成与编辑

- 文生图直接描述想要的画面。改图时附上参考图并说明要修改或保留的内容。
- 5.5 支持文生透明 PNG 和参考图编辑。5.0 Pro 和 Flash 生成透明背景时需要单张带透明通道的 PNG 参考图。
- 5.0 Lite、4.5 和 4.0 支持组图。可明确要求生成几张，参考图与输出图片合计最多 15 张，实际返回数量由模型决定。
- 输出尺寸可按模型使用 `1K`、`2K` 等分辨率档位，或指定 `宽x高`。各模型的尺寸范围见方舟文档。

提示词与参考图会发送到配置的服务。生成可能产生火山方舟费用。取消操作会停止等待结果，已经开始的生成仍可能计费。

## 构建

在本目录使用 Node.js 22 或更高版本和 pnpm 11.9.0 执行：

```sh
pnpm install --frozen-lockfile
pnpm build
```

桌面最低版本为 0.60.2，Android 和 iOS 最低版本为 0.2.16。

发布时同步更新 `package.json`、`manifest.json` 和 `CHANGELOG.md`。推送对应的 `v<版本>` 标签后，GitHub Actions 会构建 ZIP 并上传到该标签的 GitHub Release。

[字节跳动 Seedream 5.5 官网](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5) · [火山方舟图片生成 API](https://console.volcengine.com/ark/region:cn-beijing/docs/image-generation-api) · [火山方舟图片生成教程](https://docs.volcengine.com/docs/ark/image-generation-tutorial?lang=zh)

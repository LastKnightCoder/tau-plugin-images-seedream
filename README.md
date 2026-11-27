# Seedream 图片

用字节跳动 Seedream 根据文字生成图片，也可以上传参考图修改画面或融合多张图片。生成的图片可以直接用在 Tau 的聊天、文档和白板中。

## 开始使用

1. 在火山方舟控制台开通需要的 Seedream 模型，并在「API Key 管理」中创建 API Key。
2. 在插件中心安装「Seedream 图片」，再到插件页的「已安装」里打开开关，无需重启。
3. 进入本插件详情的「设置」，添加「火山方舟账号」，填写 API Key 并选择已开通的模型，点击保存。服务地址默认为 `https://ark.cn-beijing.volces.com/api/v3`，也可改为兼容同一方舟接口的 HTTPS 地址。
4. 到电脑「设置 → AI 服务 → 图片生成」或手机「我的 → AI → 图片生成」中选用这个账号，就可以开始生成图片了。若要在电脑对话里直接让 AI 生图，前往「MCP 服务器」启用图片生成工具。

模型默认预选 Seedream 5.5，电脑下拉框还提供 Seedream 5.0 Pro、5.0 Flash、5.0 Lite、4.5 和 4.0，手机上可手动填写模型 ID。电脑和手机都支持填写方舟推理接入点 ID（`ep-…`）。

## 生成与编辑

- **文生图与改图**：文生图时直接描述想要的画面；改图或融合多张图片时，附上参考图并说明要修改或保留的内容。
- **透明背景**：Seedream 5.5 支持直接生成透明背景 PNG 以及参考图编辑；5.0 Pro 和 5.0 Flash 生成透明背景时，需要提供单张带透明通道的 PNG 参考图。
- **组图生成**：5.0 Lite、4.5 和 4.0 支持一次生成组图。你可以明确说明需要生成几张，参考图与输出图片合计最多 15 张，实际返回数量由模型决定。
- **输出尺寸**：可按所选模型使用 `1K`、`2K` 等分辨率档位，或直接指定 `宽x高`。各模型支持的尺寸范围见火山方舟文档。

## 常见问题

**提示模型未开通或不可用？** 请先确认已在火山方舟控制台开通对应模型，并检查填写的模型 ID 或推理接入点 ID 是否正确。

**取消后还会扣费吗？** 可能会。取消只会停止等待结果，服务端已经开始的生成仍可能计费。

**提示词和参考图会发送到哪里？** 生成和编辑图片时，提示词与参考图会发送到你在账号里配置的服务地址。

## 注意

- 生成和修改图片会产生火山方舟费用。
- API Key 请妥善保管，不要出现在截图或问题反馈里。
- 参考文档：[字节跳动 Seedream 5.5 官网](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5) · [火山方舟图片生成 API](https://console.volcengine.com/ark/region:cn-beijing/docs/image-generation-api) · [火山方舟图片生成教程](https://docs.volcengine.com/docs/ark/image-generation-tutorial?lang=zh)

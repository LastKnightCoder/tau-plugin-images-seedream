# Seedream Images

Generate images from text with ByteDance Seedream, or upload reference images to edit an image or blend multiple images. Generated results can be used directly in Tau chat, documents, and whiteboards.

## Getting Started

1. Enable the Seedream models you need in the Volcengine Ark console, and create an API Key under **API Key Management**.
2. Install **Seedream Images** from the **Plugin Center**, then turn it on under **Installed** on the Plugins page. No restart is required.
3. Open this plugin's **Settings**, add a **Volcengine Ark account**, enter your API Key, select an enabled model, and save. The default **Service URL** is `https://ark.cn-beijing.volces.com/api/v3`, which can be changed to any HTTPS endpoint offering the same Ark API.
4. Select this account in **Settings → AI Services → Image Generation** on desktop or **Me → AI → Image Generation** on mobile to start generating images. To generate images directly in desktop chat, enable the image generation tool under **MCP Servers**.

Seedream 5.5 is preselected by default. The desktop dropdown also lists Seedream 5.0 Pro, 5.0 Flash, 5.0 Lite, 4.5, and 4.0, while mobile lets you enter a model ID manually. Both desktop and mobile also accept an Ark inference endpoint ID (`ep-…`).

## Generation and Editing

- **Text-to-image and editing**: Describe the scene you want for text-to-image. To edit or blend images, attach reference images and describe what to change or keep.
- **Transparent backgrounds**: Seedream 5.5 supports generating transparent PNGs directly from text as well as editing with reference images. 5.0 Pro and 5.0 Flash require a single PNG reference image with an alpha channel to produce transparent backgrounds.
- **Image sets**: 5.0 Lite, 4.5, and 4.0 support generating image sets. You can request a specific number of images; reference images and output images combined may total up to 15, and the actual count returned is decided by the model.
- **Output size**: Depending on the model, use resolution presets such as `1K` or `2K`, or specify an explicit `widthxheight`. Check the Volcengine Ark documentation for each model's supported dimensions.

## FAQ

**Seeing a model unavailable or not enabled error?** Make sure the model is enabled in the Volcengine Ark console and verify that your model ID or inference endpoint ID is entered accurately.

**Will I still be charged after canceling?** Possibly. Canceling only stops waiting for results; a generation already started on the provider's side may still be billed.

**Where are prompts and reference images sent?** Prompts and reference images are sent to the service URL configured in your account when generating or editing images.

## Notes

- Generating and editing images incurs Volcengine Ark charges.
- Keep your API Key safe and never include it in screenshots or issue reports.
- References: [ByteDance Seedream 5.5](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5) · [Volcengine Ark Image Generation API](https://console.volcengine.com/ark/region:cn-beijing/docs/image-generation-api) · [Volcengine Ark Image Generation Tutorial](https://docs.volcengine.com/docs/ark/image-generation-tutorial?lang=zh)

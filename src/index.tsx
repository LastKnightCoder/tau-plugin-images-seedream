import { definePlugin } from "@tau/plugins";
import { ARK_BASE_URL, SEEDREAM_MODELS } from "./catalog";
import { createSeedreamInstance, parseConfig } from "./provider";

declare const __PLUGIN_META__: { id: string; name: string; version: string };

const plugin = definePlugin({
  ...__PLUGIN_META__,
  create: () => ({
    activate(context) {
      if (!context.images) throw new Error("请升级到支持图片插件接口的 Tau 客户端");
      context.images.register({
        id: context.pluginId,
        name: __PLUGIN_META__.name,
        create: (config, modelId) => createSeedreamInstance(config, modelId, context.fetch),
      });
      context.settings.register({
        id: "connection",
        title: __PLUGIN_META__.name,
        target: "images",
        models: SEEDREAM_MODELS,
        form: {
          groups: [
            {
              title: "火山方舟账号",
              description: "提示词和参考图会发送到所配置的图片服务。",
              link: { label: "火山方舟控制台", url: "https://console.volcengine.com/ark" },
              fields: [
                { key: "apiKey", label: "API Key", type: "secret" },
                {
                  key: "baseUrl",
                  label: "服务地址",
                  type: "url",
                  default: ARK_BASE_URL,
                  description: "默认使用火山方舟北京地域，地址填到 /api/v3。",
                  summary: true,
                },
              ],
            },
          ],
          beforeSave: async values => ({ ...values, ...parseConfig(values) }),
        },
      });
    },
  }),
});

export default plugin;

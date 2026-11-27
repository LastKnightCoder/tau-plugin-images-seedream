import { messages } from "./i18n";
import { definePlugin } from "@tau/plugins";
import { ARK_BASE_URL, SEEDREAM_MODELS } from "./catalog";
import { createSeedreamInstance, parseConfig } from "./provider";

declare const __PLUGIN_META__: { id: string; name: string; version: string };

const plugin = definePlugin({
  ...__PLUGIN_META__,
  i18n: messages,
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
              title: messages.ref("account.title"),
              description: messages.ref("account.description"),
              link: {
                label: messages.ref("account.console"),
                url: "https://console.volcengine.com/ark",
              },
              fields: [
                { key: "apiKey", label: messages.ref("apiKey.label"), type: "secret" },
                {
                  key: "baseUrl",
                  label: messages.ref("baseUrl.label"),
                  type: "url",
                  default: ARK_BASE_URL,
                  description: messages.ref("baseUrl.description"),
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

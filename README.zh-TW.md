# Seedream 圖片

使用字節跳動 Seedream 依文字生成圖片，也可以上傳參考圖修改畫面或融合多張圖片。生成的圖片可以直接用於 Tau 的對話、文件與白板中。

## 開始使用

1. 在火山方舟控制台開通所需的 Seedream 模型，並在「API Key 管理」中建立 API Key。
2. 在外掛中心安裝「Seedream 圖片」，再到外掛頁的「已安裝」中開啟開關，無需重新啟動。
3. 進入本外掛詳情的「設定」，新增「火山方舟帳號」，填寫 API Key 並選擇已開通的模型後點擊儲存。服務位址預設為 `https://ark.cn-beijing.volces.com/api/v3`，也可改為提供相同方舟介面的 HTTPS 位址。
4. 前往電腦「設定 → AI 服務 → 圖片生成」或手機「我的 → AI → 圖片生成」選用這個帳號，就能開始生成圖片。若要在電腦對話中直接讓 AI 生圖，請前往「MCP 伺服器」啟用圖片生成工具。

模型預設選取 Seedream 5.5，電腦下拉選單另提供 Seedream 5.0 Pro、5.0 Flash、5.0 Lite、4.5 與 4.0，手機上可手動填寫模型 ID。電腦與手機皆支援填寫方舟推理接入點 ID（`ep-…`）。

## 生成與編輯

- **文生圖與改圖**：文生圖時直接描述想要的畫面；改圖或融合多張圖片時，附上參考圖並說明要修改或保留的內容。
- **透明背景**：Seedream 5.5 支援直接生成透明背景 PNG 與參考圖編輯；5.0 Pro 與 5.0 Flash 生成透明背景時，需要提供單張帶透明通道的 PNG 參考圖。
- **組圖生成**：5.0 Lite、4.5 與 4.0 支援一次生成組圖。你可以明確說明要生成幾張，參考圖與輸出圖片合計最多 15 張，實際回傳張數由模型決定。
- **輸出尺寸**：可依所選模型使用 `1K`、`2K` 等解析度檔位，或直接指定 `寬x高`。各模型支援的尺寸範圍請參閱火山方舟文件。

## 常見問題

**提示模型未開通或無法使用？** 請先確認已在火山方舟控制台開通對應模型，並檢查填寫的模型 ID 或推理接入點 ID 是否正確。

**取消後還會扣費嗎？** 可能會。取消只會停止等待結果，服務端已經開始的生成仍可能計費。

**提示詞與參考圖會傳送到哪裡？** 生成與編輯圖片時，提示詞與參考圖會傳送至你在帳號中設定的服務位址。

## 注意事項

- 生成與修改圖片會產生火山方舟費用。
- 請妥善保管 API Key，切勿出現在截圖或問題回饋中。
- 參考文件：[字節跳動 Seedream 5.5 官網](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5) · [火山方舟圖片生成 API](https://console.volcengine.com/ark/region:cn-beijing/docs/image-generation-api) · [火山方舟圖片生成教學](https://docs.volcengine.com/docs/ark/image-generation-tutorial?lang=zh)

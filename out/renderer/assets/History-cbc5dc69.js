import { d as defineComponent, r as ref, k as computed, o as onMounted, u as useRouter, _ as _export_sfc, b as openBlock, c as createElementBlock, e as createBaseVNode, w as withDirectives, h as vModelText, g as createTextVNode, t as toDisplayString, F as Fragment, f as renderList } from "./index-8dd5cc38.js";
import { S as SpeechSynthesisService } from "./SpeechSynthesisService-34e12318.js";
const _sfc_main = defineComponent({
  name: "History",
  setup() {
    const router = useRouter();
    const history = ref([]);
    const searchQuery = ref("");
    const languages = [
      { code: "zh-CN", name: "中文" },
      { code: "en-US", name: "英语" },
      { code: "ja-JP", name: "日语" },
      { code: "ko-KR", name: "韩语" },
      { code: "fr-FR", name: "法语" },
      { code: "de-DE", name: "德语" },
      { code: "es-ES", name: "西班牙语" },
      { code: "ru-RU", name: "俄语" }
    ];
    const getLanguageName = (code) => {
      const lang = languages.find((l) => l.code === code);
      return lang ? lang.name : code;
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    };
    const filteredHistory = computed(() => {
      if (!searchQuery.value)
        return history.value;
      const query = searchQuery.value.toLowerCase();
      return history.value.filter(
        (item) => item.sourceText.toLowerCase().includes(query) || item.translatedText.toLowerCase().includes(query)
      );
    });
    const loadHistory = async () => {
      try {
        const data = await window.electronAPI.getHistory();
        history.value = data || [];
        history.value.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } catch (error) {
        console.error("加载历史记录失败:", error);
      }
    };
    const clearHistory = async () => {
      if (confirm("确定要清空所有历史记录吗？此操作不可撤销。")) {
        try {
          await window.electronAPI.clearHistory();
          history.value = [];
        } catch (error) {
          console.error("清空历史记录失败:", error);
        }
      }
    };
    const exportHistory = () => {
      if (history.value.length === 0) {
        alert("没有历史记录可导出");
        return;
      }
      let csvContent = "时间,源语言,目标语言,原文,译文\n";
      history.value.forEach((item) => {
        const timestamp = formatDate(item.timestamp);
        const sourceLang = getLanguageName(item.sourceLang);
        const targetLang = getLanguageName(item.targetLang);
        const sourceText = `"${item.sourceText.replace(/"/g, '""')}"`;
        const translatedText = `"${item.translatedText.replace(/"/g, '""')}"`;
        csvContent += `${timestamp},${sourceLang},${targetLang},${sourceText},${translatedText}
`;
      });
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `翻译历史_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    const speakText = (text, lang) => {
      SpeechSynthesisService.speak(text, lang);
    };
    const copyText = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert("已复制到剪贴板");
      }).catch((err) => {
        console.error("复制失败:", err);
      });
    };
    const useInTranslator = (item) => {
      sessionStorage.setItem("translationItem", JSON.stringify(item));
      router.push("/");
    };
    onMounted(() => {
      loadHistory();
    });
    return {
      history,
      searchQuery,
      filteredHistory,
      getLanguageName,
      formatDate,
      clearHistory,
      exportHistory,
      speakText,
      copyText,
      useInTranslator
    };
  }
});
const History_vue_vue_type_style_index_0_scoped_e449a1f0_lang = "";
const _hoisted_1 = { class: "history-container" };
const _hoisted_2 = { class: "history-header" };
const _hoisted_3 = { class: "history-actions" };
const _hoisted_4 = {
  key: 0,
  class: "empty-history"
};
const _hoisted_5 = {
  key: 1,
  class: "history-list"
};
const _hoisted_6 = { class: "history-item-header" };
const _hoisted_7 = { class: "language-info" };
const _hoisted_8 = { class: "timestamp" };
const _hoisted_9 = { class: "history-item-content" };
const _hoisted_10 = { class: "source-text" };
const _hoisted_11 = { class: "translated-text" };
const _hoisted_12 = { class: "history-item-actions" };
const _hoisted_13 = ["onClick"];
const _hoisted_14 = ["onClick"];
const _hoisted_15 = ["onClick"];
const _hoisted_16 = ["onClick"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    createBaseVNode("div", _hoisted_2, [
      _cache[5] || (_cache[5] = createBaseVNode("h2", null, "翻译历史", -1)),
      createBaseVNode("div", _hoisted_3, [
        withDirectives(createBaseVNode("input", {
          type: "text",
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.searchQuery = $event),
          placeholder: "搜索历史记录...",
          class: "search-input"
        }, null, 512), [
          [vModelText, _ctx.searchQuery]
        ]),
        createBaseVNode("button", {
          onClick: _cache[1] || (_cache[1] = (...args) => _ctx.exportHistory && _ctx.exportHistory(...args)),
          class: "action-btn"
        }, _cache[3] || (_cache[3] = [
          createBaseVNode("i", { class: "icon-export" }, null, -1),
          createTextVNode(" 导出 ")
        ])),
        createBaseVNode("button", {
          onClick: _cache[2] || (_cache[2] = (...args) => _ctx.clearHistory && _ctx.clearHistory(...args)),
          class: "action-btn danger"
        }, _cache[4] || (_cache[4] = [
          createBaseVNode("i", { class: "icon-delete" }, null, -1),
          createTextVNode(" 清空 ")
        ]))
      ])
    ]),
    _ctx.filteredHistory.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_4, [
      createBaseVNode("p", null, toDisplayString(_ctx.searchQuery ? "没有找到匹配的记录" : "暂无翻译历史"), 1)
    ])) : (openBlock(), createElementBlock("div", _hoisted_5, [
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.filteredHistory, (item, index) => {
        return openBlock(), createElementBlock("div", {
          key: index,
          class: "history-item"
        }, [
          createBaseVNode("div", _hoisted_6, [
            createBaseVNode("div", _hoisted_7, toDisplayString(_ctx.getLanguageName(item.sourceLang)) + " → " + toDisplayString(_ctx.getLanguageName(item.targetLang)), 1),
            createBaseVNode("div", _hoisted_8, toDisplayString(_ctx.formatDate(item.timestamp)), 1)
          ]),
          createBaseVNode("div", _hoisted_9, [
            createBaseVNode("div", _hoisted_10, toDisplayString(item.sourceText), 1),
            _cache[6] || (_cache[6] = createBaseVNode("div", { class: "arrow" }, "→", -1)),
            createBaseVNode("div", _hoisted_11, toDisplayString(item.translatedText), 1)
          ]),
          createBaseVNode("div", _hoisted_12, [
            createBaseVNode("button", {
              onClick: ($event) => _ctx.speakText(item.sourceText, item.sourceLang),
              class: "icon-btn"
            }, _cache[7] || (_cache[7] = [
              createBaseVNode("i", { class: "icon-speaker" }, null, -1)
            ]), 8, _hoisted_13),
            createBaseVNode("button", {
              onClick: ($event) => _ctx.speakText(item.translatedText, item.targetLang),
              class: "icon-btn"
            }, _cache[8] || (_cache[8] = [
              createBaseVNode("i", { class: "icon-speaker" }, null, -1)
            ]), 8, _hoisted_14),
            createBaseVNode("button", {
              onClick: ($event) => _ctx.copyText(item.translatedText),
              class: "icon-btn"
            }, _cache[9] || (_cache[9] = [
              createBaseVNode("i", { class: "icon-copy" }, null, -1)
            ]), 8, _hoisted_15),
            createBaseVNode("button", {
              onClick: ($event) => _ctx.useInTranslator(item),
              class: "use-btn"
            }, " 使用 ", 8, _hoisted_16)
          ])
        ]);
      }), 128))
    ]))
  ]);
}
const History = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e449a1f0"]]);
export {
  History as default
};

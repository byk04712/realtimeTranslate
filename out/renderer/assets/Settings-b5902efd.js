import { d as defineComponent, i as reactive, r as ref, o as onMounted, _ as _export_sfc, b as openBlock, c as createElementBlock, e as createBaseVNode, w as withDirectives, v as vModelSelect, F as Fragment, f as renderList, h as vModelText, t as toDisplayString, j as vModelCheckbox, g as createTextVNode } from "./index-8dd5cc38.js";
const _sfc_main = defineComponent({
  name: "Settings",
  setup() {
    const defaultSettings = {
      defaultSourceLang: "zh-CN",
      defaultTargetLang: "en-US",
      speechRate: 1,
      speechVolume: 1,
      theme: "light",
      autoSaveHistory: true
    };
    const settings = reactive({ ...defaultSettings });
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
    const saveStatus = ref("");
    const loadSettings = async () => {
      try {
        const savedSettings = await window.electronAPI.getSettings();
        if (savedSettings) {
          Object.assign(settings, savedSettings);
        }
      } catch (error) {
        console.error("加载设置失败:", error);
      }
    };
    const saveSettings = async () => {
      try {
        await window.electronAPI.saveSettings(settings);
        saveStatus.value = "设置已保存";
        setTimeout(() => {
          saveStatus.value = "";
        }, 2e3);
      } catch (error) {
        console.error("保存设置失败:", error);
        saveStatus.value = "保存失败";
        setTimeout(() => {
          saveStatus.value = "";
        }, 2e3);
      }
    };
    const resetSettings = () => {
      Object.assign(settings, defaultSettings);
    };
    onMounted(() => {
      loadSettings();
    });
    return {
      settings,
      languages,
      saveStatus,
      saveSettings,
      resetSettings
    };
  }
});
const Settings_vue_vue_type_style_index_0_scoped_73efc2ce_lang = "";
const _hoisted_1 = { class: "settings-container" };
const _hoisted_2 = { class: "settings-section" };
const _hoisted_3 = { class: "setting-item" };
const _hoisted_4 = ["value"];
const _hoisted_5 = { class: "setting-item" };
const _hoisted_6 = ["value"];
const _hoisted_7 = { class: "settings-section" };
const _hoisted_8 = { class: "setting-item" };
const _hoisted_9 = { class: "slider-container" };
const _hoisted_10 = { class: "setting-item" };
const _hoisted_11 = { class: "slider-container" };
const _hoisted_12 = { class: "settings-section" };
const _hoisted_13 = { class: "setting-item" };
const _hoisted_14 = { class: "setting-item checkbox-item" };
const _hoisted_15 = { class: "settings-actions" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    _cache[18] || (_cache[18] = createBaseVNode("h2", null, "设置", -1)),
    createBaseVNode("div", _hoisted_2, [
      _cache[10] || (_cache[10] = createBaseVNode("h3", null, "语言设置", -1)),
      createBaseVNode("div", _hoisted_3, [
        _cache[8] || (_cache[8] = createBaseVNode("label", null, "默认源语言", -1)),
        withDirectives(createBaseVNode("select", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => _ctx.settings.defaultSourceLang = $event)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.languages, (lang) => {
            return openBlock(), createElementBlock("option", {
              key: lang.code,
              value: lang.code
            }, toDisplayString(lang.name), 9, _hoisted_4);
          }), 128))
        ], 512), [
          [vModelSelect, _ctx.settings.defaultSourceLang]
        ])
      ]),
      createBaseVNode("div", _hoisted_5, [
        _cache[9] || (_cache[9] = createBaseVNode("label", null, "默认目标语言", -1)),
        withDirectives(createBaseVNode("select", {
          "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.settings.defaultTargetLang = $event)
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.languages, (lang) => {
            return openBlock(), createElementBlock("option", {
              key: lang.code,
              value: lang.code
            }, toDisplayString(lang.name), 9, _hoisted_6);
          }), 128))
        ], 512), [
          [vModelSelect, _ctx.settings.defaultTargetLang]
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_7, [
      _cache[13] || (_cache[13] = createBaseVNode("h3", null, "语音设置", -1)),
      createBaseVNode("div", _hoisted_8, [
        _cache[11] || (_cache[11] = createBaseVNode("label", null, "语音播放速度", -1)),
        createBaseVNode("div", _hoisted_9, [
          withDirectives(createBaseVNode("input", {
            type: "range",
            min: "0.5",
            max: "2",
            step: "0.1",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => _ctx.settings.speechRate = $event)
          }, null, 512), [
            [
              vModelText,
              _ctx.settings.speechRate,
              void 0,
              { number: true }
            ]
          ]),
          createBaseVNode("span", null, toDisplayString(_ctx.settings.speechRate) + "x", 1)
        ])
      ]),
      createBaseVNode("div", _hoisted_10, [
        _cache[12] || (_cache[12] = createBaseVNode("label", null, "语音音量", -1)),
        createBaseVNode("div", _hoisted_11, [
          withDirectives(createBaseVNode("input", {
            type: "range",
            min: "0",
            max: "1",
            step: "0.1",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => _ctx.settings.speechVolume = $event)
          }, null, 512), [
            [
              vModelText,
              _ctx.settings.speechVolume,
              void 0,
              { number: true }
            ]
          ]),
          createBaseVNode("span", null, toDisplayString(Math.round(_ctx.settings.speechVolume * 100)) + "%", 1)
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_12, [
      _cache[17] || (_cache[17] = createBaseVNode("h3", null, "界面设置", -1)),
      createBaseVNode("div", _hoisted_13, [
        _cache[15] || (_cache[15] = createBaseVNode("label", null, "主题", -1)),
        withDirectives(createBaseVNode("select", {
          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => _ctx.settings.theme = $event)
        }, _cache[14] || (_cache[14] = [
          createBaseVNode("option", { value: "light" }, "浅色", -1),
          createBaseVNode("option", { value: "dark" }, "深色", -1),
          createBaseVNode("option", { value: "system" }, "跟随系统", -1)
        ]), 512), [
          [vModelSelect, _ctx.settings.theme]
        ])
      ]),
      createBaseVNode("div", _hoisted_14, [
        createBaseVNode("label", null, [
          withDirectives(createBaseVNode("input", {
            type: "checkbox",
            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => _ctx.settings.autoSaveHistory = $event)
          }, null, 512), [
            [vModelCheckbox, _ctx.settings.autoSaveHistory]
          ]),
          _cache[16] || (_cache[16] = createTextVNode(" 自动保存翻译历史 "))
        ])
      ])
    ]),
    createBaseVNode("div", _hoisted_15, [
      createBaseVNode("button", {
        onClick: _cache[6] || (_cache[6] = (...args) => _ctx.saveSettings && _ctx.saveSettings(...args)),
        class: "primary-btn"
      }, "保存设置"),
      createBaseVNode("button", {
        onClick: _cache[7] || (_cache[7] = (...args) => _ctx.resetSettings && _ctx.resetSettings(...args)),
        class: "secondary-btn"
      }, "恢复默认")
    ])
  ]);
}
const Settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-73efc2ce"]]);
export {
  Settings as default
};

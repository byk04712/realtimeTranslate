<template>
  <div class="home-container">
    <div class="language-selector">
      <div class="language-pair">
        <select v-model="sourceLang" @change="handleLanguageChange">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
        <button @click="swapLanguages" class="swap-btn">
          <i class="icon-swap"></i>
        </button>
        <select v-model="targetLang" @change="handleLanguageChange">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>
    </div>

    <div class="translation-container">
      <div class="text-panel source-panel">
        <div class="panel-header">
          <h3>原文</h3>
          <div class="controls">
            <button @click="toggleListening" :class="{ active: isListening }">
              <i :class="isListening ? 'icon-mic-active' : 'icon-mic'"></i>
              {{ isListening ? '停止录音' : '开始录音' }}
            </button>
            <button @click="clearSourceText">
              <i class="icon-clear"></i>
            </button>
          </div>
        </div>
        <div class="text-content">
          <textarea
            v-model="sourceText"
            :placeholder="isListening ? '正在听...' : '输入或说出要翻译的文本'"
            @input="handleSourceTextChange"
          ></textarea>
        </div>
      </div>

      <div class="text-panel target-panel">
        <div class="panel-header">
          <h3>译文</h3>
          <div class="controls">
            <button @click="speakTranslation">
              <i class="icon-speaker"></i>
            </button>
            <button @click="copyTranslation">
              <i class="icon-copy"></i>
            </button>
          </div>
        </div>
        <div class="text-content">
          <div class="translation-result">{{ translatedText }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';
import SpeechRecognitionService from '../../services/SpeechRecognitionService';
import TranslationService from '../../services/TranslationService';
import SpeechSynthesisService from '../../services/SpeechSynthesisService';

export default defineComponent({
  name: 'Home',
  setup() {
    const sourceText = ref('');
    const translatedText = ref('');
    const isListening = ref(false);
    const sourceLang = ref('zh');
    const targetLang = ref('en');
    const translationTimeout = ref<number | null>(null);

    // 支持的语言列表
    // https://fanyi-api.baidu.com/doc/21
    const languages = [
      { code: 'zh', name: '中文' },
      { code: 'en', name: '英语' },
      { code: 'jp', name: '日语' },
      { code: 'fra', name: '法语' },
      { code: 'de', name: '德语' },
      { code: 'spa', name: '西班牙语' },
      { code: 'ru', name: '俄语' }
    ];

    // 处理语音识别结果
    const handleSpeechResult = (text: string) => {
      sourceText.value += text + ' ';
      translateText();
    };

    // 切换语音识别状态
    const toggleListening = () => {
      if (isListening.value) {
        SpeechRecognitionService.stop();
        isListening.value = false;
      } else {
        SpeechRecognitionService.setLanguage(sourceLang.value);
        SpeechRecognitionService.start(handleSpeechResult);
        isListening.value = true;
      }
    };

    // 翻译文本
    const translateText = async () => {
      if (sourceText.value.trim() === '') {
        translatedText.value = '';
        return;
      }

      // 防抖处理，避免频繁请求
      if (translationTimeout.value) {
        clearTimeout(translationTimeout.value);
      }

      translationTimeout.value = window.setTimeout(async () => {
        try {
          const result = await TranslationService.translate(
            sourceText.value,
            sourceLang.value,
            targetLang.value
          );
          translatedText.value = result;
          
          // 保存到历史记录
          window.electronAPI.saveHistory({
            sourceText: sourceText.value,
            translatedText: result,
            sourceLang: sourceLang.value,
            targetLang: targetLang.value
          });
        } catch (error) {
          console.error('Translation error:', error);
          translatedText.value = '翻译失败，请稍后重试';
        }
      }, 500);
    };

    // 处理源文本变化
    const handleSourceTextChange = () => {
      translateText();
    };

    // 清空源文本
    const clearSourceText = () => {
      sourceText.value = '';
      translatedText.value = '';
    };

    // 朗读翻译结果
    const speakTranslation = () => {
      if (translatedText.value) {
        SpeechSynthesisService.speak(translatedText.value, targetLang.value);
      }
    };

    // 复制翻译结果
    const copyTranslation = () => {
      if (translatedText.value) {
        navigator.clipboard.writeText(translatedText.value)
          .then(() => {
            alert('已复制到剪贴板');
          })
          .catch(err => {
            console.error('复制失败:', err);
          });
      }
    };

    // 交换源语言和目标语言
    const swapLanguages = () => {
      const temp = sourceLang.value;
      sourceLang.value = targetLang.value;
      targetLang.value = temp;
      
      // 如果正在录音，需要重新设置语言
      if (isListening.value) {
        SpeechRecognitionService.stop();
        SpeechRecognitionService.setLanguage(sourceLang.value);
        SpeechRecognitionService.start(handleSpeechResult);
      }
      
      // 如果有文本，则重新翻译
      if (sourceText.value.trim()) {
        // 交换源文本和翻译文本
        const temp = sourceText.value;
        sourceText.value = translatedText.value;
        translatedText.value = temp;
        
        // 重新翻译
        translateText();
      }
    };

    // 处理语言变化
    const handleLanguageChange = () => {
      if (isListening.value) {
        SpeechRecognitionService.stop();
        SpeechRecognitionService.setLanguage(sourceLang.value);
        SpeechRecognitionService.start(handleSpeechResult);
      }
      
      // 如果有文本，则重新翻译
      if (sourceText.value.trim()) {
        translateText();
      }
    };

    // 组件挂载时
    onMounted(() => {
      // 从设置中加载默认语言
      window.electronAPI.getSettings().then((settings: any) => {
        if (settings && settings.defaultSourceLang) {
          sourceLang.value = settings.defaultSourceLang;
        }
        if (settings && settings.defaultTargetLang) {
          targetLang.value = settings.defaultTargetLang;
        }
      });
    });

    // 组件卸载时
      onUnmounted(() => {
        if (isListening.value) {
          SpeechRecognitionService.stop();
        }
        SpeechSynthesisService.stop();
        if (translationTimeout.value) {
          clearTimeout(translationTimeout.value);
        }
      });

      return {
        sourceText,
        translatedText,
        isListening,
        sourceLang,
        targetLang,
        languages,
        toggleListening,
        handleSourceTextChange,
        clearSourceText,
        speakTranslation,
        copyTranslation,
        swapLanguages,
        handleLanguageChange
      };
    }
  });
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;
}

.language-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.language-pair {
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-pair select {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: white;
  font-size: 14px;
}

.swap-btn {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.swap-btn:hover {
  background-color: #e0e0e0;
}

.translation-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
}

@media (min-width: 768px) {
  .translation-container {
    flex-direction: row;
  }
}

.text-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 10px;
}

.controls button {
  background-color: #3498db;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.controls button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.controls button.active {
  color: #3498db;
}

.text-content {
  flex: 1;
  padding: 15px;
  overflow: auto;
}

textarea {
  width: 100%;
  height: 100%;
  min-height: 150px;
  border: none;
  resize: none;
  font-size: 16px;
  line-height: 1.5;
  font-family: inherit;
}

textarea:focus {
  outline: none;
}

.translation-result {
  font-size: 16px;
  line-height: 1.5;
  white-space: pre-wrap;
  min-height: 150px;
}

/* 图标样式 */
[class^="icon-"] {
  font-family: 'Material Icons', sans-serif;
  font-size: 20px;
}

.icon-mic::before {
  content: "mic";
}

.icon-mic-active::before {
  content: "mic";
  color: #e74c3c;
}

.icon-clear::before {
  content: "clear";
}

.icon-speaker::before {
  content: "volume_up";
}

.icon-copy::before {
  content: "content_copy";
}

.icon-swap::before {
  content: "swap_horiz";
}
</style>
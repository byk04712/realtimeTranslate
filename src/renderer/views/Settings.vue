<template>
  <div class="settings-container">
    <h2>设置</h2>
    
    <div class="settings-section">
      <h3>语言设置</h3>
      <div class="setting-item">
        <label>默认源语言</label>
        <select v-model="settings.defaultSourceLang">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>
      <div class="setting-item">
        <label>默认目标语言</label>
        <select v-model="settings.defaultTargetLang">
          <option v-for="lang in languages" :key="lang.code" :value="lang.code">
            {{ lang.name }}
          </option>
        </select>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>语音设置</h3>
      <div class="setting-item">
        <label>语音播放速度</label>
        <div class="slider-container">
          <input 
            type="range" 
            min="0.5" 
            max="2" 
            step="0.1" 
            v-model.number="settings.speechRate"
          />
          <span>{{ settings.speechRate }}x</span>
        </div>
      </div>
      <div class="setting-item">
        <label>语音音量</label>
        <div class="slider-container">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.1" 
            v-model.number="settings.speechVolume"
          />
          <span>{{ Math.round(settings.speechVolume * 100) }}%</span>
        </div>
      </div>
    </div>
    
    <div class="settings-section">
      <h3>界面设置</h3>
      <div class="setting-item">
        <label>主题</label>
        <select v-model="settings.theme">
          <option value="light">浅色</option>
          <option value="dark">深色</option>
          <option value="system">跟随系统</option>
        </select>
      </div>
      <div class="setting-item checkbox-item">
        <label>
          <input type="checkbox" v-model="settings.autoSaveHistory" />
          自动保存翻译历史
        </label>
      </div>
    </div>
    
    <div class="settings-actions">
      <button @click="saveSettings" class="primary-btn">保存设置</button>
      <button @click="resetSettings" class="secondary-btn">恢复默认</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';

export default defineComponent({
  name: 'Settings',
  setup() {
    // 默认设置
    const defaultSettings = {
      defaultSourceLang: 'zh-CN',
      defaultTargetLang: 'en-US',
      speechRate: 1.0,
      speechVolume: 1.0,
      theme: 'light',
      autoSaveHistory: true
    };
    
    // 当前设置
    const settings = reactive({ ...defaultSettings });
    
    // 支持的语言列表
    const languages = [
      { code: 'zh-CN', name: '中文' },
      { code: 'en-US', name: '英语' },
      { code: 'ja-JP', name: '日语' },
      { code: 'ko-KR', name: '韩语' },
      { code: 'fr-FR', name: '法语' },
      { code: 'de-DE', name: '德语' },
      { code: 'es-ES', name: '西班牙语' },
      { code: 'ru-RU', name: '俄语' }
    ];
    
    // 保存状态
    const saveStatus = ref('');
    
    // 加载设置
    const loadSettings = async () => {
      try {
        const savedSettings = await window.electronAPI.getSettings();
        if (savedSettings) {
          Object.assign(settings, savedSettings);
        }
      } catch (error) {
        console.error('加载设置失败:', error);
      }
    };
    
    // 保存设置
    const saveSettings = async () => {
      try {
        await window.electronAPI.saveSettings(settings);
        saveStatus.value = '设置已保存';
        setTimeout(() => {
          saveStatus.value = '';
        }, 2000);
      } catch (error) {
        console.error('保存设置失败:', error);
        saveStatus.value = '保存失败';
        setTimeout(() => {
          saveStatus.value = '';
        }, 2000);
      }
    };
    
    // 重置设置
    const resetSettings = () => {
      Object.assign(settings, defaultSettings);
    };
    
    // 组件挂载时加载设置
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
</script>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  color: #2c3e50;
}

.settings-section {
  margin-bottom: 30px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 500;
}

.setting-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}

.setting-item label {
  flex: 0 0 150px;
  font-weight: 500;
}

.setting-item select,
.setting-item input[type="text"] {
  flex: 1;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.slider-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider-container input[type="range"] {
  flex: 1;
}

.checkbox-item {
  display: flex;
  align-items: center;
}

.checkbox-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.settings-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.primary-btn {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.primary-btn:hover {
  background-color: #2980b9;
}

.secondary-btn {
  padding: 10px 20px;
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.secondary-btn:hover {
  background-color: #e0e0e0;
}
</style>
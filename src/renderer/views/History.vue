<template>
  <div class="history-container">
    <div class="history-header">
      <h2>翻译历史</h2>
      <div class="history-actions">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="搜索历史记录..." 
          class="search-input"
        />
        <button @click="exportHistory" class="action-btn">
          <i class="icon-export"></i> 导出
        </button>
        <button @click="clearHistory" class="action-btn danger">
          <i class="icon-delete"></i> 清空
        </button>
      </div>
    </div>
    
    <div v-if="filteredHistory.length === 0" class="empty-history">
      <p>{{ searchQuery ? '没有找到匹配的记录' : '暂无翻译历史' }}</p>
    </div>
    
    <div v-else class="history-list">
      <div 
        v-for="(item, index) in filteredHistory" 
        :key="index" 
        class="history-item"
      >
        <div class="history-item-header">
          <div class="language-info">
            {{ getLanguageName(item.sourceLang) }} → {{ getLanguageName(item.targetLang) }}
          </div>
          <div class="timestamp">
            {{ formatDate(item.timestamp) }}
          </div>
        </div>
        <div class="history-item-content">
          <div class="source-text">{{ item.sourceText }}</div>
          <div class="arrow">→</div>
          <div class="translated-text">{{ item.translatedText }}</div>
        </div>
        <div class="history-item-actions">
          <button @click="speakText(item.sourceText, item.sourceLang)" class="icon-btn">
            <i class="icon-speaker"></i>
          </button>
          <button @click="speakText(item.translatedText, item.targetLang)" class="icon-btn">
            <i class="icon-speaker"></i>
          </button>
          <button @click="copyText(item.translatedText)" class="icon-btn">
            <i class="icon-copy"></i>
          </button>
          <button @click="useInTranslator(item)" class="use-btn">
            使用
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import SpeechSynthesisService from '../../services/SpeechSynthesisService';

export default defineComponent({
  name: 'History',
  setup() {
    const router = useRouter();
    const history = ref<any[]>([]);
    const searchQuery = ref('');
    
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
    
    // 根据语言代码获取语言名称
    const getLanguageName = (code: string) => {
      const lang = languages.find(l => l.code === code);
      return lang ? lang.name : code;
    };
    
    // 格式化日期
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };
    
    // 过滤历史记录
    const filteredHistory = computed(() => {
      if (!searchQuery.value) return history.value;
      
      const query = searchQuery.value.toLowerCase();
      return history.value.filter(item => 
        item.sourceText.toLowerCase().includes(query) || 
        item.translatedText.toLowerCase().includes(query)
      );
    });
    
    // 加载历史记录
    const loadHistory = async () => {
      try {
        const data = await window.electronAPI.getHistory();
        history.value = data || [];
        // 按时间倒序排列
        history.value.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      } catch (error) {
        console.error('加载历史记录失败:', error);
      }
    };
    
    // 清空历史记录
    const clearHistory = async () => {
      if (confirm('确定要清空所有历史记录吗？此操作不可撤销。')) {
        try {
          await window.electronAPI.clearHistory();
          history.value = [];
        } catch (error) {
          console.error('清空历史记录失败:', error);
        }
      }
    };
    
    // 导出历史记录
    const exportHistory = () => {
      if (history.value.length === 0) {
        alert('没有历史记录可导出');
        return;
      }
      
      // 创建CSV内容
      let csvContent = '时间,源语言,目标语言,原文,译文\n';
      
      history.value.forEach(item => {
        const timestamp = formatDate(item.timestamp);
        const sourceLang = getLanguageName(item.sourceLang);
        const targetLang = getLanguageName(item.targetLang);
        // 处理CSV中的特殊字符
        const sourceText = `"${item.sourceText.replace(/"/g, '""')}"`;
        const translatedText = `"${item.translatedText.replace(/"/g, '""')}"`;
        
        csvContent += `${timestamp},${sourceLang},${targetLang},${sourceText},${translatedText}\n`;
      });
      
      // 创建Blob并下载
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `翻译历史_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    
    // 朗读文本
    const speakText = (text: string, lang: string) => {
      SpeechSynthesisService.speak(text, lang);
    };
    
    // 复制文本
    const copyText = (text: string) => {
      navigator.clipboard.writeText(text)
        .then(() => {
          alert('已复制到剪贴板');
        })
        .catch(err => {
          console.error('复制失败:', err);
        });
    };
    
    // 在翻译器中使用该记录
    const useInTranslator = (item: any) => {
      // 将数据存储在sessionStorage中，以便在主页面获取
      sessionStorage.setItem('translationItem', JSON.stringify(item));
      router.push('/');
    };
    
    // 组件挂载时加载历史记录
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
</script>

<style scoped>
.history-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-header h2 {
  margin: 0;
  color: #2c3e50;
}

.history-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  width: 200px;
}

.action-btn {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: #3498db;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
}

.action-btn:hover {
  background-color: #2980b9;
}

.action-btn.danger {
  background-color: #e74c3c;
}

.action-btn.danger:hover {
  background-color: #c0392b;
}

.empty-history {
  text-align: center;
  padding: 40px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.history-item {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.history-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

.history-item-content {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.source-text, .translated-text {
  flex: 1;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 4px;
  font-size: 15px;
  line-height: 1.5;
}

.arrow {
  display: flex;
  align-items: center;
  color: #999;
  font-size: 18px;
}

.history-item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.icon-btn {
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
}

.icon-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.use-btn {
  padding: 5px 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.use-btn:hover {
  background-color: #2980b9;
}

/* 图标样式 */
[class^="icon-"] {
  font-family: 'Material Icons', sans-serif;
  font-size: 18px;
}

.icon-export::before {
  content: "download";
}

.icon-delete::before {
  content: "delete";
}

.icon-speaker::before {
  content: "volume_up";
}

.icon-copy::before {
  content: "content_copy";
}
</style>
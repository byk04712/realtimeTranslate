<template>
  <div class="app-container">
    <header class="app-header">
      <h1>AI实时翻译</h1>
      <div class="header-controls">
        <button @click="openSettings">
          <i class="icon-settings"></i> 设置
        </button>
        <button @click="openHistory">
          <i class="icon-history"></i> 历史记录
        </button>
      </div>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    const router = useRouter();
    
    const openSettings = () => {
      router.push('/settings');
    };
    
    const openHistory = () => {
      router.push('/history');
    };
    
    return {
      openSettings,
      openHistory
    };
  }
});
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: white;
}

.header-controls {
  display: flex;
  gap: 10px;
}

.app-content {
  flex: 1;
  padding: 20px;
  overflow: auto;
}

button {
  padding: 8px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #2980b9;
}
</style>
<template>
  <div id="visitor-info">
    <div v-if="loading" class="loading-container">
      <div class="loading-bar">
        <div class="loading-progress" :style="{ width: `${loadingProgress}` }"></div>
      </div>
      <div class="loading-text">{{ loadingProgress }}</div>
    </div>
    <div id="info-container" ref="infoContainer">
      <div v-for="(info, index) in visitorInfo" :key="index">
        <strong>{{ info.label }}:</strong> <span v-html="info.value"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const infoContainer = ref(null);
const visitorInfo = ref([]);
const loading = ref(true);
const loadingProgress = ref(0);

const cfDomain = 'www.onani.cn';
const vercelDomains = ['onani.cn', 'doc-git-main-afoims-projects.vercel.app'];

const displayNodeInfo = () => {
  const hostname = window.location.hostname;
  let host, extraHtml;

  if (hostname.includes(cfDomain)) {
    host = 'Cloudflare 节点';
    extraHtml = vercelDomains.map(domain => `<a href="https://${domain}" target="_blank">前往 Vercel 节点 (${domain})</a>`).join(', ');
  } else if (vercelDomains.some(domain => hostname.includes(domain))) {
    host = 'Vercel 节点';
    extraHtml = `<a href="https://${cfDomain}" target="_blank">前往 Cloudflare 节点</a>`;
  } else {
    host = '本地调试或反代页面';
    extraHtml = `
      <a href="https://${cfDomain}" target="_blank">Cloudflare 节点</a>,
      ${vercelDomains.map(domain => `<a href="https://${domain}" target="_blank">Vercel 节点 (${domain})</a>`).join(', ')}
    `;
  }

  visitorInfo.value.push({ label: '当前节点', value: `${host} (${extraHtml})` });
  visitorInfo.value.push({ label: '节点状态', value: '<a href="https://status.onani.cn" target="_blank">查看节点状态</a><hr>' });
};

onMounted(() => {
  displayNodeInfo();
});
</script>

<style scoped>
.loading-indicator {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>

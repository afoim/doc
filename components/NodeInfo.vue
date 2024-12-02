<template>
  <div id="visitor-info">
    <div class="info-container">
      <div v-for="(info, index) in visitorInfo" :key="index" class="info-item">
        <strong class="info-label">{{ info.label }}:</strong>
        <span class="info-value" v-html="info.value"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const cfLogo = '/assets/cloudflare-logo.svg';
const vercelLogo = '/assets/vercel-logo.svg';
const visitorInfo = ref([]);

const cfDomain = 'www.onani.cn';
const vercelDomains = ['onani.cn', 'doc-git-main-afoims-projects.vercel.app'];

const displayNodeInfo = () => {
  const hostname = window.location.hostname;
  let host, extraHtml, logo;

  if (hostname.includes(cfDomain)) {
    host = 'Cloudflare 节点';
    logo = cfLogo;
    extraHtml = vercelDomains
      .map(
        (domain) =>
          `<a href="https://${domain}" target="_blank">
             <img src="${vercelLogo}" alt="Vercel Logo" class="logo-small">
             前往 Vercel 节点 (${domain})
           </a>`
      )
      .join(', ');
  } else if (vercelDomains.some((domain) => hostname.includes(domain))) {
    host = 'Vercel 节点';
    logo = vercelLogo;
    extraHtml = `<a href="https://${cfDomain}" target="_blank">
                   <img src="${cfLogo}" alt="Cloudflare Logo" class="logo-small">
                   前往 Cloudflare 节点
                 </a>`;
  } else {
    host = '本地调试或反代页面';
    extraHtml = `
      <a href="https://${cfDomain}" target="_blank">
        <img src="${cfLogo}" alt="Cloudflare Logo" class="logo-small">
        Cloudflare 节点
      </a>,
      ${vercelDomains
        .map(
          (domain) =>
            `<a href="https://${domain}" target="_blank">
               <img src="${vercelLogo}" alt="Vercel Logo" class="logo-small">
               Vercel 节点 (${domain})
             </a>`
        )
        .join(', ')}
    `;
  }

  visitorInfo.value.push({
    label: '当前节点',
    value: `
      <img src="${logo}" alt="${host} Logo" class="logo-large">
      ${host} (${extraHtml})
    `,
  });
  visitorInfo.value.push({
    label: '节点状态',
    value:
      '<a href="https://status.onani.cn" target="_blank">查看节点状态</a><hr>',
  });
};

onMounted(() => {
  displayNodeInfo();
});
</script>

<style scoped>
#visitor-info {
  font-family: sans-serif;
  color: #333;
}

.info-container {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 5px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.info-label {
  width: 80px;
  font-weight: bold;
  margin-right: 10px;
}

.info-value {
  flex: 1;
}

.info-value a {
  color: #0070f3;
  text-decoration: none;
}

.info-value a:hover {
  text-decoration: underline;
}

.logo-large {
  width: 60px;
  height: auto;
  margin-right: 10px;
  vertical-align: middle;
}

.logo-small {
  width: 20px;
  height: auto;
  margin-right: 5px;
  vertical-align: middle;
}
</style>

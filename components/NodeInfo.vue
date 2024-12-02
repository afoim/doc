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
const vercelDomain = 'onani.cn';

const displayNodeInfo = () => {
  const hostname = window.location.hostname;
  let host, extraHtml;

  if (hostname.includes(cfDomain)) {
    host = 'Cloudflare 节点';
    extraHtml = `<a href="https://${vercelDomain}" target="_blank">前往 Vercel 节点</a>`;
  } else if (hostname.includes(vercelDomain)) {
    host = 'Vercel 节点';
    extraHtml = `<a href="https://${cfDomain}" target="_blank">前往 Cloudflare 节点</a>`;
  } else {
    host = '本地调试或反代页面';
    extraHtml = `
      <a href="https://${cfDomain}" target="_blank">Cloudflare 节点</a>,
      <a href="https://${vercelDomain}" target="_blank">Vercel 节点</a>
    `;
  }

  visitorInfo.value.push({ label: '当前节点', value: `${host} (${extraHtml})` });
  visitorInfo.value.push({ label: '节点状态', value: '<a href="https://status.onani.cn" target="_blank">查看节点状态</a><hr>' });
};

const getMoreIp = async (url, domainType) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return { ip: data.ip, domainType };
  } catch (error) {
    console.error(`无法获取 ${domainType} 的 IP 地址:`, error);
    return null;
  }
};

const getLocation = async (ip) => {
  try {
    const response = await fetch(`https://api.vore.top/api/IPdata?ip=${ip}`);
    const data = await response.json();
    if (data.code === 200 && data.ipdata) {
      const location = data.ipdata;
      return `国家: ${location.info1}, 省份: ${location.info2}, 城市: ${location.info3}, ISP: ${location.isp}`;
    }
    return '无法获取地理位置';
  } catch (error) {
    console.error('获取地理位置信息失败:', error);
    return '无法获取地理位置';
  }
};

const loadVisitorInfo = async () => {
  const tasks = [
    // ... 其他任务保持不变
    { fn: async () => {
      const ipAddresses = await Promise.all([
        getMoreIp('https://ipv4_ct.itdog.cn', 'ipv4_ct'),
        getMoreIp('https://ipv6_ct.itdog.cn', 'ipv6_ct'),
        getMoreIp('https://ipv4_cu.itdog.cn', 'ipv4_cu'),
        getMoreIp('https://ipv6_cu.itdog.cn', 'ipv6_cu'),
        getMoreIp('https://ipv4_cm.itdog.cn', 'ipv4_cm'),
        getMoreIp('https://ipv6_cm.itdog.cn', 'ipv6_cm'),
        getMoreIp('https://ipv4-overseas.itdog.plus', 'ipv4_overseas'),
        getMoreIp('https://ipv6-overseas.itdog.plus', 'ipv6_overseas'),
        getMoreIp('https://ipv4.lvhai.org', 'ipv4_google'),
        getMoreIp('https://ipv6.lvhai.org', 'ipv6_google')
      ]);

      const ipInfo = [
        { ips: [ipAddresses[0], ipAddresses[1]], line: '中国电信线路' },
        { ips: [ipAddresses[2], ipAddresses[3]], line: '中国联通线路' },
        { ips: [ipAddresses[4], ipAddresses[5]], line: '中国移动线路' },
        { ips: [ipAddresses[6], ipAddresses[7]], line: '海外线路' },
        { ips: [ipAddresses[8], ipAddresses[9]], line: '谷歌线路' }
      ];

      for (const { ips, line } of ipInfo) {
        const ipv4 = ips[0]?.ip || '无';
        const ipv6 = ips[1]?.ip || '无';
        const ipv4Location = ipv4 !== '无' ? await getLocation(ipv4) : '无';
        const ipv6Location = ipv6 !== '无' ? await getLocation(ipv6) : '无';
        visitorInfo.value.push({ 
          label: line, 
          value: `IPv4: ${ipv4} (${ipv4Location}), IPv6: ${ipv6} (${ipv6Location})` 
        });
      }
    }, weight: 20 },
    { fn: () => {
      visitorInfo.value.push({ label: 'User-Agent 信息', value: navigator.userAgent });
      visitorInfo.value.push({ label: '操作系统信息', value: navigator.platform });
    }, weight: 5 },
    { fn: async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      visitorInfo.value.push({ label: '浏览器指纹', value: result.visitorId });
    }, weight: 10 },
    { fn: () => {
      return new Promise((resolve) => {
        const foundIPs = new Set();
        let ipv4 = '';
        let ipv6 = '';
    
        const isPrivateIP = (ip) => {
          const parts = ip.split('.');
          if (ip === '0.0.0.0' || ip === '127.0.0.1') return true;
          if (parts.length === 4) {
            const firstOctet = parseInt(parts[0], 10);
            const secondOctet = parseInt(parts[1], 10);
            return firstOctet === 10 || 
                   (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) || 
                   (firstOctet === 192 && secondOctet === 168);
          }
          return ip.startsWith("fc") || ip.startsWith("fe80");
        };
    
        const addIP = (ip) => {
          if (foundIPs.has(ip) || isPrivateIP(ip)) return;
          foundIPs.add(ip);
          if (ip.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/) && !ipv4) {
            ipv4 = ip;
          }
          if (ip.match(/\b([a-f0-9]{1,4}:){7}[a-f0-9]{1,4}\b/) && !ipv6) {
            ipv6 = ip;
          }
        };
    
        const findIP = () => {
          const pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
          });
    
          pc.createDataChannel("");
          pc.createOffer()
            .then((sdp) => {
              sdp.sdp.split('\n').forEach(line => {
                line.match(/([0-9]{1,3}\.){3}[0-9]{1,3}|([a-f0-9]{1,4}:){7}[a-f0-9]{1,4}/g)?.forEach(addIP);
              });
              pc.setLocalDescription(sdp);
            })
            .catch(() => {});
    
          pc.onicecandidate = (ice) => {
            ice.candidate?.candidate.split(' ').forEach(addIP);
            if (ipv4 && ipv6) {
              pc.onicecandidate = null;
              pc.close();
              resolve();
            }
          };
    
          setTimeout(() => {
            if (!ipv4 && !ipv6) {
              pc.close();
              resolve();
            }
          }, 5000);
        };
    
        findIP();
    
        setTimeout(async () => {
          let ipv4Location = '无法获取地理位置';
          let ipv6Location = '无法获取地理位置';
    
          if (ipv4) {
            ipv4Location = await getLocation(ipv4);
          }
          if (ipv6) {
            ipv6Location = await getLocation(ipv6);
          }
    
          visitorInfo.value.push({ 
            label: 'WebRTC IP', 
            value: `IPv4: ${ipv4 || '无'} (${ipv4Location}), IPv6: ${ipv6 || '无'} (${ipv6Location})` 
          });
          resolve();
        }, 5000);
      });
    }, weight: 10 },
  ];

  const totalWeight = tasks.reduce((sum, task) => sum + task.weight, 0);
  let completedWeight = 0;
  let completedTasks = 0;

  await Promise.all(tasks.map(async (task) => {
    try {
      await task.fn();
    } catch (error) {
      console.error('任务执行失败:', error);
    }
    completedWeight += task.weight;
    completedTasks += 1;
    loadingProgress.value = `正在加载第（${completedTasks}/${tasks.length}）项数据...`;
  }));

  loading.value = false;
};

onMounted(() => {
  displayNodeInfo();
  loadVisitorInfo();
});
</script>

<style scoped>
.loading-indicator {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}
</style>

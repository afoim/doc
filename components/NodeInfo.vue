
<template>
  <div id="visitor-info">
    <!-- 显示信息的容器 -->
    <div id="info-container" ref="infoContainer"></div>
  </div>
</template>

<script setup>
import { nextTick, ref } from 'vue';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// 使用 ref 获取 DOM 元素
const infoContainer = ref(null);

const cfDomain = 'www.onani.cn'; // 自定义域名
const vercelDomain = 'onani.cn'; // 自定义域名

const displayNodeInfo = () => {
  let host = '';
  let extraHtml = '';
  const hostname = window.location.hostname;

  if (hostname.includes(cfDomain)) {
    host = 'Cloudflare 节点';
    extraHtml = `<ul>
      <li><a href="https://${vercelDomain}" target="_blank">前往 Vercel 节点: https://${vercelDomain}</a></li>
    </ul>`;
  } else if (hostname.includes(vercelDomain)) {
    host = 'Vercel 节点';
    extraHtml = `<ul>
      <li><a href="https://${cfDomain}" target="_blank">前往 Cloudflare 节点: https://${cfDomain}</a></li>
    </ul>`;
  } else {
    host = '本地调试或反代页面';
    extraHtml = `<ul>
      <li><a href="https://${cfDomain}" target="_blank">Cloudflare 节点</a></li>
      <li><a href="https://${vercelDomain}" target="_blank">Vercel 节点</a></li>
    </ul>`;
  }

  // 使用 ref 来操作 DOM 元素
  if (infoContainer.value) {
    const nodeInfoDiv = document.createElement('div');
    nodeInfoDiv.innerHTML = `<strong>当前节点:</strong> ${host} ${extraHtml}`;
    infoContainer.value.appendChild(nodeInfoDiv);
  }
      // 插入一个新的超链接，指向状态页面
      const statusLinkDiv = document.createElement('div');
    statusLinkDiv.innerHTML = `<strong>节点状态:</strong> <a href="https://status.onani.cn" target="_blank">查看节点状态</a><hr>`;
    infoContainer.value.appendChild(statusLinkDiv);
  
}

// 调用函数以设置节点信息
nextTick(displayNodeInfo);

const loadVisitorInfo = async () => {
  try {
    // 获取公网 IPv4 地址
    const ipv4Response = await fetch('https://api.ipify.org/');
    const ipv4 = await ipv4Response.text();  // 返回的 IP 地址为文本

    // 获取公网 IPv6 地址
    const ipv6Response = await fetch('https://api6.ipify.org');
    const ipv6 = await ipv6Response.text();  // 返回的 IP 地址为文本

    // 使用 Vore API 获取 IPv4 地理位置
    const ipv4LocationResponse = await fetch(`https://api.vore.top/api/IPdata?ip=${ipv4}`);
    const ipv4LocationData = await ipv4LocationResponse.json();

    // 使用 Vore API 获取 IPv6 地理位置
    const ipv6LocationResponse = await fetch(`https://api.vore.top/api/IPdata?ip=${ipv6}`);
    const ipv6LocationData = await ipv6LocationResponse.json();

    // 提取并显示 IPv4 地理位置信息
    let ipv4LocationHTML = '无法获取 IPv4 地理位置信息';
    if (ipv4LocationData.code === 200) {
      const ipv4Location = ipv4LocationData.ipdata;
      ipv4LocationHTML = `
        <strong>IPv4 信息:</strong> 
        IPv4: ${ipv4}<br>
        <strong>地理位置:</strong> 
        国家: ${ipv4Location.info1}, 
        省: ${ipv4Location.info2}, 
        市: ${ipv4Location.info3}, 
        ISP: ${ipv4Location.isp}
      `;
    }

    // 提取并显示 IPv6 地理位置信息
    let ipv6LocationHTML = '无法获取 IPv6 地理位置信息';
    if (ipv6LocationData.code === 200) {
      const ipv6Location = ipv6LocationData.ipdata;
      ipv6LocationHTML = `
        <strong>IPv6 信息:</strong> 
        IPv6: ${ipv6}<br>
        <strong>地理位置:</strong> 
        国家: ${ipv6Location.info1}, 
        省: ${ipv6Location.info2}, 
        市: ${ipv6Location.info3}, 
        ISP: ${ipv6Location.isp}
      `;
    }

    // 将 IPv4 和 IPv6 信息显示到页面
    const infoContainer = document.getElementById('info-container');
    if (infoContainer) {
      const ipv4InfoDiv = document.createElement('div');
      ipv4InfoDiv.innerHTML = ipv4LocationHTML;
      infoContainer.appendChild(ipv4InfoDiv);

      const ipv6InfoDiv = document.createElement('div');
      ipv6InfoDiv.innerHTML = ipv6LocationHTML;
      infoContainer.appendChild(ipv6InfoDiv);
    }

  } catch (error) {
    console.error('无法获取 IP 信息:', error);
  }





  // 2. 获取 User-Agent 信息并写入容器
  const userAgent = navigator.userAgent;
  if (infoContainer.value) {
    const userAgentDiv = document.createElement('div');
    userAgentDiv.innerHTML = `<strong>User-Agent 信息:</strong> ${userAgent}`;
    infoContainer.value.appendChild(userAgentDiv);
  }

  // 3. 获取操作系统信息并写入容器
  const osInfo = navigator.platform;
  if (infoContainer.value) {
    const osInfoDiv = document.createElement('div');
    osInfoDiv.innerHTML = `<strong>操作系统信息:</strong> ${osInfo}`;
    infoContainer.value.appendChild(osInfoDiv);
  }


  // 8. 获取当前时间并写入容器
  const updateCurrentTime = () => {
    const currentTime = new Date().toLocaleString();
    if (infoContainer.value) {
      const currentTimeDiv = document.getElementById('current-time');
      if (currentTimeDiv) {
        currentTimeDiv.innerHTML = `<strong>当前时间:</strong> ${currentTime}`;
      } else {
        const newCurrentTimeDiv = document.createElement('div');
        newCurrentTimeDiv.id = 'current-time'; // 添加 ID 以便后续更新
        newCurrentTimeDiv.innerHTML = `<strong>当前时间:</strong> ${currentTime}`;
        infoContainer.value.appendChild(newCurrentTimeDiv);
      }
    }
  }

  // 初始化时显示当前时间
  updateCurrentTime();

  // 每秒更新时间
  setInterval(updateCurrentTime, 1000);

  // 9. 获取页面来源并写入容器
  const referrer = document.referrer;
  if (infoContainer.value) {
    const referrerDiv = document.createElement('div');
    referrerDiv.innerHTML = `<strong>来源页面:</strong> ${referrer || '无'}`;
    infoContainer.value.appendChild(referrerDiv);
  }

  // 10. 获取页面加载时间并写入容器
  const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
  const loadTimeDiv = document.createElement('div');
  loadTimeDiv.innerHTML = `<strong>页面加载时间:</strong> ${loadTime} ms`;
  document.getElementById('info-container').appendChild(loadTimeDiv);

  // 11. 获取设备类型并写入容器
  const deviceType = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? '移动设备' : '桌面设备';
  const deviceTypeDiv = document.createElement('div');
  deviceTypeDiv.innerHTML = `<strong>设备类型:</strong> ${deviceType}`;
  document.getElementById('info-container').appendChild(deviceTypeDiv);

  // 14. 判断 WebGL 支持情况并写入容器
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const webGLSupport = gl ? '支持' : '不支持';
  const webGLSupportDiv = document.createElement('div');
  webGLSupportDiv.innerHTML = `<strong>WebGL 支持:</strong> ${webGLSupport}`;
  document.getElementById('info-container').appendChild(webGLSupportDiv);

  // 15. 判断触摸事件支持情况并写入容器
  const touchEventSupport = 'ontouchstart' in window ? '支持' : '不支持';
  const touchEventSupportDiv = document.createElement('div');
  touchEventSupportDiv.innerHTML = `<strong>触摸事件支持:</strong> ${touchEventSupport}`;
  document.getElementById('info-container').appendChild(touchEventSupportDiv);

  // 16. 获取浏览器指纹信息并写入容器
  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const fingerprint = result.visitorId;
  const fingerprintDiv = document.createElement('div');
  fingerprintDiv.innerHTML = `<strong>浏览器指纹:</strong> ${fingerprint}`;
  document.getElementById('info-container').appendChild(fingerprintDiv);

  // 19. 获取浏览器窗口尺寸并写入容器
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const windowSizeDiv = document.createElement('div');
  windowSizeDiv.innerHTML = `<strong>浏览器窗口尺寸:</strong> ${width}x${height}`;
  document.getElementById('info-container').appendChild(windowSizeDiv);

  // 20. 获取浏览器的默认字体并写入容器
  const defaultFont = window.getComputedStyle(document.body).fontFamily || '未知字体';
  const fontDiv = document.createElement('div');
  fontDiv.innerHTML = `<strong>默认字体:</strong> ${defaultFont}`;
  document.getElementById('info-container').appendChild(fontDiv);

  // 21. 获取浏览器的缩放比例并写入容器
  const zoom = Math.round(window.devicePixelRatio * 100);
  const zoomDiv = document.createElement('div');
  zoomDiv.innerHTML = `<strong>浏览器缩放比例:</strong> ${zoom}%`;
  document.getElementById('info-container').appendChild(zoomDiv);

  // 22. 获取页面是否处于全屏模式并写入容器
  const isFullScreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  const fullScreenStatus = isFullScreen ? '是' : '否';
  const fullScreenDiv = document.createElement('div');
  fullScreenDiv.innerHTML = `<strong>全屏模式:</strong> ${fullScreenStatus}`;
  document.getElementById('info-container').appendChild(fullScreenDiv);

  // 24. 获取浏览器是否启用了 JavaScript 并写入容器
  const jsEnabled = typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement === 'function' ? '是' : '否';
  const jsDiv = document.createElement('div');
  jsDiv.innerHTML = `<strong>JavaScript 是否启用:</strong> ${jsEnabled}`;
  document.getElementById('info-container').appendChild(jsDiv);

  // 25. 获取页面的 `viewport` 宽高并写入容器
  const viewportWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  const viewportDiv = document.createElement('div');
  viewportDiv.innerHTML = `<strong>Viewport 尺寸:</strong> ${viewportWidth}x${viewportHeight}`;
  document.getElementById('info-container').appendChild(viewportDiv);

  // 26. 获取当前浏览器的语言并写入容器
  const browserLanguage = navigator.language || '未知语言';
  const languageDiv = document.createElement('div');
  languageDiv.innerHTML = `<strong>浏览器语言:</strong> ${browserLanguage}`;
  document.getElementById('info-container').appendChild(languageDiv);

  // 28. 获取页面是否启用了 WebSocket 并写入容器
  const webSocketEnabled = 'WebSocket' in window ? '是' : '否';
  const webSocketDiv = document.createElement('div');
  webSocketDiv.innerHTML = `<strong>WebSocket 是否启用:</strong> ${webSocketEnabled}`;
  document.getElementById('info-container').appendChild(webSocketDiv);

  // 29. 获取浏览器是否支持 Service Worker 并写入容器
  const serviceWorkerSupported = 'serviceWorker' in navigator ? '是' : '否';
  const serviceWorkerDiv = document.createElement('div');
  serviceWorkerDiv.innerHTML = `<strong>Service Worker 是否支持:</strong> ${serviceWorkerSupported}`;
  document.getElementById('info-container').appendChild(serviceWorkerDiv);

  // 30. 获取是否支持 LocalStorage 并写入容器
  const localStorageSupported = 'localStorage' in window && window['localStorage'] !== null ? '是' : '否';
  const localStorageDiv = document.createElement('div');
  localStorageDiv.innerHTML = `<strong>LocalStorage 是否支持:</strong> ${localStorageSupported}`;
  document.getElementById('info-container').appendChild(localStorageDiv);
  
// 30. 获取 WebRTC 泄露的 IP 并写入容器，自动忽略内网 IP 地址和 0.0.0.0
nextTick(() => {
  const foundIPs = new Set(); // 存储已找到的 IP
  let ipv4 = ''; // 初始为空
  let ipv6 = ''; // 初始为空

// 判断是否为私有 IP 地址
const isPrivateIP = (ip) => {
  const parts = ip.split('.');
  if (ip === '0.0.0.0' || ip === '127.0.0.1') return true;  // 过滤掉 0.0.0.0 和 127.0.0.1
  if (parts.length === 4) {
    const firstOctet = parseInt(parts[0], 10);
    const secondOctet = parseInt(parts[1], 10);
    return firstOctet === 10 || 
           (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) || 
           (firstOctet === 192 && secondOctet === 168);  // 修改了这里，确保 192.168.x.x 都被视为私有 IP
  }
  return ip.startsWith("fc") || ip.startsWith("fe80"); // 过滤 IPv6 的私有地址
};


  // 将 IP 地址添加到集合中，并且只会添加第一次出现的非私有 IP 地址
  const addIP = (ip) => {
    if (foundIPs.has(ip) || isPrivateIP(ip)) return; // 过滤已找到的 IP 地址和私有地址
    foundIPs.add(ip);

    // 匹配 IPv4 和 IPv6 地址
    if (ip.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/) && !ipv4) {
      ipv4 = ip; // 只赋值一次 IPv4
    }
    if (ip.match(/\b([a-f0-9]{1,4}:){7}[a-f0-9]{1,4}\b/) && !ipv6) {
      ipv6 = ip; // 只赋值一次 IPv6
    }
  };

  // 查找 WebRTC 泄露的 IP 地址
  const findIP = () => {
    const pc = new (window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection)({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }]  // 使用 Google STUN 服务器
    });

    pc.createDataChannel(""); // 创建一个数据通道
    pc.createOffer()
      .then((sdp) => {
        sdp.sdp.split('\n').forEach(line => {
          // 从 SDP 中提取候选 IP 地址
          line.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g)?.forEach(addIP);
        });
        return pc.setLocalDescription(sdp);
      });

    // 在 ICE 候选中提取 IP 地址
    pc.onicecandidate = (ice) => {
      ice.candidate?.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g)?.forEach(addIP);
    };
  };

// 使用 Vore API 查询 IP 地址的地理位置
const getLocation = async (ip) => {
  try {
    // 使用 Vore API 获取地理位置信息
    const response = await fetch(`https://api.vore.top/api/IPdata?ip=${ip}`);
    const data = await response.json();

    if (data.code === 200 && data.ipdata) {
      const location = data.ipdata;
      return `
        国家: ${location.info1}, 
        省份: ${location.info2}, 
        城市: ${location.info3}, 
        ISP: ${location.isp}
      `;
    } else {
      return '无法获取地理位置';
    }
  } catch (error) {
    console.error('获取地理位置信息失败:', error);
    return '无法获取地理位置';
  }
};

  

  // 定义一个递归函数，持续尝试获取 IP 地址
  const tryGetIP = () => {
    findIP(); // 尝试获取 WebRTC 泄露的 IP

    // 如果 IPv4 和 IPv6 都已经获得，则停止继续尝试并显示
    if (ipv4 && ipv6) {
      const ipLeakDiv = document.createElement('div');
      ipLeakDiv.innerHTML = `WebRTC 泄露的 IP：IPv4: ${ipv4}, IPv6: ${ipv6}`;

      // 获取容器并将结果添加到容器中
      const infoContainer = document.getElementById('info-container');
      if (infoContainer) {
        infoContainer.appendChild(ipLeakDiv);  // 使用 DOM 操作插入到页面中
      }

      // 获取并显示地理位置信息
      getLocation(ipv4).then(location => {
        const locationDiv = document.createElement('div');
        locationDiv.innerHTML = `<strong>WebRTC 泄露的 IPv4 地理位置:</strong> ${location}`;
        if (infoContainer) {
          infoContainer.appendChild(locationDiv);
        }
      });
      
      // 如果需要，获取 IPv6 的地理位置信息
      getLocation(ipv6).then(location => {
        const locationDiv = document.createElement('div');
        locationDiv.innerHTML = `<strong>WebRTC 泄露的 IPv6 地理位置:</strong> ${location}`;
        if (infoContainer) {
          infoContainer.appendChild(locationDiv);
        }
      });

    } else {
      // 如果未获得 IP 地址，则继续尝试，每隔 1000ms（1秒）再次执行
      setTimeout(tryGetIP, 100);
    }
  };

  tryGetIP(); // 启动 IP 获取过程
});


};

// 调用函数加载信息
nextTick(loadVisitorInfo);

</script>

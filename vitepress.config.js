// vitepress.config.js

export default {
    ssr: {
      external: ['components/NodeInfo.vue'] // 直接排除 NodeInfo.vue 文件
    }
  }
  
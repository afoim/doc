import { defineConfig } from 'vitepress'

export default defineConfig({
  vite: {
    ssr: {
      noExternal: ['components/NodeInfo.vue']
    }
  },
  title: "AcoFork Doc",
  lang: 'zh-CN',
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: 'https://q2.qlogo.cn/headimg_dl?dst_uin=2973517380&spec=5' }]
  ],
  description: "idk",
  themeConfig: {
    sidebarMenuLabel: '菜单',
    outlineTitle: '页面导航',
    returnToTopLabel: '返回顶部',
    darkModeSwitchLabel: '切换主题',
    darkModeSwitchTitle: '切换暗黑模式',
    lightModeSwitchTitle: '切换浅色模式',
    logo: 'https://q2.qlogo.cn/headimg_dl?dst_uin=2973517380&spec=5',
    nav: [
      { text: '珍珠奶茶', link: '/' },
      { text: '芋圆波波', link: 'https://status.onani.cn/' }
    ],
    footer: {
      message: '本网站内容遵循 MIT 协议。<FooterInfo />',
      copyright: `版权所有 © 你活着的时候 - ${new Date().getFullYear()} AcoFork`
    },
    sidebar: [
      {
        text: '文档',
        items: [
          { text: '实用工具', link: '/doc/实用工具.md' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  },
  
})

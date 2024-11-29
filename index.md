---
# https://vitepress.dev/reference/default-theme-home-page
layout: home



hero:
  name: "AcoFork Doc"
  text: "idk"
  # tagline: My great project tagline
  actions:
    - theme: brand
      text: 点我看文档
      link: /doc/实用工具.md
    - theme: light
      text: 点我加QQ
      link: https://qm.qq.com/q/Uy9kmDXHYO

# features:
#   - title: Feature A
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature B
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
#   - title: Feature C
#     details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
---

<script setup>
import NodeInfo from './components/NodeInfo.vue'; // 导入组件
</script>


<NodeInfo />

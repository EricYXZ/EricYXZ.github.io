# 叶煊喆 · 个人主页

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-上线-blue?logo=github)](https://ericyxz.github.io)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

🔗 **在线访问**：[ericyxz.github.io](https://ericyxz.github.io)

---

## 📖 简介

华中科技大学集成电路学院本科生叶煊喆的个人学术主页，包含简历、项目经历、科研经历、技术笔记和生活相册等内容。基于纯静态 HTML/CSS/JS 构建，部署于 GitHub Pages。

## ✨ 特性

- 🎨 **现代简约设计** — 自研 CSS，支持亮色 / 深色双主题切换
- 📱 **响应式布局** — 适配桌面端、平板与手机
- ⚡ **粒子背景动画** — Hero 区域 Canvas 粒子网络效果
- ⌨️ **打字机效果** — 首页标语逐字切换动画
- 💬 **访客留言** — 基于 Giscus + GitHub Discussions 的评论系统
- 🔍 **SEO 优化** — Open Graph 标签、meta 描述、语义化 HTML
- 🎯 **滚动渐入动画** — Intersection Observer 驱动的元素渐显

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 前端 | HTML5 · CSS3 · Vanilla JS |
| 字体 | Inter · Noto Sans SC（Google Fonts） |
| 图标 | 内联 SVG |
| 评论 | Giscus（GitHub Discussions） |
| 统计 | 不蒜子 |
| 部署 | GitHub Pages |

## 📁 项目结构

```
├── index.html          # 首页
├── cv/                 # 个人简历
├── projects/           # 项目经历
├── research/           # 科研经历
├── blog/               # 技术笔记
├── gallery/            # 生活相册
├── assets/
│   ├── css/style.css   # 全局样式
│   ├── js/
│   │   ├── main.js     # 公共交互脚本
│   │   └── details.js  # 折叠面板脚本
│   ├── img/            # 图片资源
│   ├── photos/         # 相册照片
│   └── certificates/   # 获奖证书
└── README.md
```

## 🚀 本地运行

```bash
# 克隆仓库
git clone https://github.com/EricYXZ/EricYXZ.github.io.git

# 进入目录
cd EricYXZ.github.io

# 用任意静态服务器启动，例如：
npx serve .
# 或
python -m http.server 8080
```

浏览器打开 `http://localhost:8080` 即可预览。

## 📄 许可

MIT License © 2026 叶煊喆
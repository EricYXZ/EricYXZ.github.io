# Eric Ye | Personal Academic Homepage

[![Website](https://img.shields.io/badge/website-ericyxz.github.io-41627d)](https://ericyxz.github.io/)
[![GitHub Pages](https://img.shields.io/badge/deployment-GitHub%20Pages-2f6f4e)](https://github.com/EricYXZ/EricYXZ.github.io/actions)
[![Bilingual](https://img.shields.io/badge/language-中文%20%7C%20English-6f7780)](https://ericyxz.github.io/en/)

叶煊喆（Eric Ye）的双语个人学术主页，记录教育经历、荣誉奖项、工程与科研项目、论文发表和生活相册。网站使用原生 HTML、CSS 和 JavaScript 开发，通过 GitHub Pages 直接部署。

在线访问：[https://ericyxz.github.io/](https://ericyxz.github.io/)

## 页面内容

| 页面 | 中文版 | English | 主要内容 |
| --- | --- | --- | --- |
| 首页 | [`/`](https://ericyxz.github.io/) | [`/en/`](https://ericyxz.github.io/en/) | 个人简介、论文状态、荣誉奖项、内容导航、生活剪影与访客留言 |
| 简历 | [`/cv/`](https://ericyxz.github.io/cv/) | [`/en/cv/`](https://ericyxz.github.io/en/cv/) | 教育经历、专业技能、荣誉奖项和主要项目 |
| 项目 | [`/projects/`](https://ericyxz.github.io/projects/) | [`/en/projects/`](https://ericyxz.github.io/en/projects/) | 工程项目、科研项目和技术笔记 |
| 论文 | [`/publications/`](https://ericyxz.github.io/publications/) | [`/en/publications/`](https://ericyxz.github.io/en/publications/) | 论文与后续学术成果 |
| 相册 | [`/gallery/`](https://ericyxz.github.io/gallery/) | [`/en/gallery/`](https://ericyxz.github.io/en/gallery/) | 校园、旅行、项目与日常记录 |

## 设计与交互

- 中文与英文页面保持相同的信息结构和视觉语言。
- 响应式布局覆盖桌面端与移动端，导航栏固定在页面顶部并显示阅读进度。
- 支持浅色、深色主题以及平滑的主题切换动画。
- 荣誉奖项使用带阻尼和边界回弹的纵向滚动；生活剪影支持横向循环浏览。
- 项目页采用等尺寸三列卡片，展示项目图片、时间和简要说明。
- 每页提供回到顶部按钮，首页通过 Giscus 接入 GitHub Discussions 留言。
- 站内页面使用局部导航更新内容，在切换页面和浏览器前进、后退时保持音乐连续播放。
- 晶圆唱片播放器包含唱臂、五线谱、音符和涟漪动画，支持曲目浏览、进度控制、静音、播放与暂停渐变，以及九首曲目的列表循环。
- 尊重 `prefers-reduced-motion`，在用户要求减少动态效果时关闭或简化部分动画。

## 技术实现

| 类别 | 实现 |
| --- | --- |
| 页面 | HTML5 |
| 样式 | CSS3、自定义属性、响应式媒体查询 |
| 交互 | Vanilla JavaScript、Web Audio API、Intersection Observer |
| 留言 | Giscus + GitHub Discussions |
| 部署 | GitHub Pages |

项目没有框架、包管理器或构建步骤，所有页面和资源都可以由静态文件服务器直接提供。

## 目录结构

```text
.
├── index.html                 # 中文首页
├── cv/                        # 中文简历
├── projects/                  # 中文项目页
├── publications/              # 中文论文页
├── gallery/                   # 中文相册页
├── en/                        # 英文版对应页面
├── assets/
│   ├── audio/                 # 播放器音频与录音来源说明
│   ├── certificates/          # 荣誉奖项证书
│   ├── css/                   # 全局、主题、播放器与 Giscus 样式
│   ├── docs/                  # 简历 PDF
│   ├── img/                   # 头像、站点图标与项目配图
│   ├── js/                    # 公共交互、相册、折叠面板与播放器逻辑
│   ├── photos/                # 相册资源
│   └── project-images/        # 其他项目图片
├── .nojekyll                  # 让 GitHub Pages 直接发布静态文件
└── README.md
```

## 本地预览

```bash
git clone https://github.com/EricYXZ/EricYXZ.github.io.git
cd EricYXZ.github.io
python -m http.server 8080
```

浏览器访问 [http://localhost:8080/](http://localhost:8080/)。页面使用根路径资源引用，因此建议通过静态服务器预览，不要直接双击打开 HTML 文件。

## 内容维护

- 个人资料与首页内容：`index.html`、`en/index.html`
- 简历：`cv/index.html`、`en/cv/index.html`
- 项目：`projects/index.html`、`en/projects/index.html`
- 论文：`publications/index.html`、`en/publications/index.html`
- 相册：`gallery/index.html`、`en/gallery/index.html`
- 全局交互与主题：`assets/js/main.js`
- 无刷新站内导航：`assets/js/navigation.js`
- 音乐播放器：`assets/js/music.js`、`assets/css/music.css`
- 录音来源与授权：[`assets/audio/credits.html`](https://ericyxz.github.io/assets/audio/credits.html)

更新页面内容时，请同时维护中文和英文版本。当前下载简历使用占位 PDF，论文页面也保留为空状态，待正式内容发布后替换。

## 部署

推送到 `main` 分支后，GitHub Pages 会自动构建并发布网站。仓库中的 `.nojekyll` 文件确保静态资源按原目录结构提供。

## 资源说明

个人照片、证书、项目材料和自有音频仅用于本人的主页展示。第三方录音的来源及许可信息列在[录音来源页面](https://ericyxz.github.io/assets/audio/credits.html)中。

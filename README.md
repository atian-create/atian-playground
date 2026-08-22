# 阿甜的 Skill 游乐园

[English](README_EN.md) · 简体中文

把阿甜真实做过的开源 Skill、网站和互动项目，变成一座可以逛、可以点击、可以直接复制给 Agent 使用的像素游乐园。

![阿甜游乐园项目地图](docs/screenshots/playground-desktop.png)

## 它能做什么

- 收录 48 个已经公开的 GitHub 项目。
- 按「做图与视觉 / 自媒体与内容 / Agent 与知识 / 互动网站与游戏」分区浏览。
- 每个分区的全部项目都会映射成与能力相关的动态娱乐设施，而不是普通项目卡片。
- 每个项目提供 GitHub 入口、三步教程和可复制的 Agent 启动提示词。
- 人物沿道路行走，天鹅船在湖面移动，摩天轮、过山车、气球摊、眼镜店和冰淇淋车等设施持续运转。
- 包含一份开源排查公告牌，用来判断下一批值得公开的项目。

## 本地运行

```bash
npm install
npm run dev
```

生成无需服务器的本地单文件：

```bash
npm run build:local
```

然后直接打开 `阿甜游乐园.html`。

## 复制给 Agent

```text
请阅读并运行这个项目：https://github.com/atian-create/atian-playground
先查看 README 和项目结构，然后告诉我如何新增一个真实项目、把它映射成相关娱乐设施，并完成本地构建验证。
```

## 项目原则

- 只展示真实完成或已经公开的项目。
- 设施隐喻必须与项目能力相关。
- 中文标题由网页代码渲染，避免生成图片文字乱码。
- 不读取或上传本地私人资料。

## License

[MIT](LICENSE)

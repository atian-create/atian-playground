export const categories = [
  { id: 'visual', name: '做图与视觉', color: '#1875b8', icon: '📷', intro: '把图片、封面、卡片与视觉风格做成可复用的生产设施。' },
  { id: 'media', name: '自媒体与内容', color: '#d7462d', icon: '🎙️', intro: '从找选题、写内容、发布到复盘，组成一条持续运转的内容过山车。' },
  { id: 'agent', name: 'Agent 与知识', color: '#2c8c4b', icon: '🧠', intro: '让资料、任务与 Agent 形成可以继续工作的知识空间。' },
  { id: 'interactive', name: '互动网站与游戏', color: '#c98616', icon: '🎮', intro: '用测评、地图、手势与小游戏，让体验本身成为项目说明。' },
]

const project = (repo, title, category, facility, description, homepage = '') => ({
  id: repo,
  repo,
  title,
  category,
  facility,
  description,
  homepage,
  github: `https://github.com/atian-create/${repo}`,
})

export const projects = [
  project('food-sticker-demo', '美食贴纸生成器', 'visual', '美食冰淇淋车', '把食物照片变成适合收藏和分享的可爱贴纸。'),
  project('knowledge-card-journal-skill', '知识卡片手帐', 'visual', '知识卡片旋转木马', '把截图、链接、笔记和逐字稿整理成统一的手帐知识卡片。'),
  project('solo-ai-paper-collage', 'AI 撕纸拼贴', 'visual', '撕纸拼贴工坊', '把一人公司和 AI 工作流变成有纸张触感的中文信息图。'),
  project('codex-dream-skin-studio', 'Codex 换肤工作室', 'visual', '换肤照相馆', '安装、切换、验证并安全恢复 Codex Desktop 主题。'),
  project('handdrawn-route-map-card-skill', '手绘路线图卡片', 'visual', '路线观光小火车', '把旅行、美食和工作流拆成清晰可收藏的路线节点。'),
  project('wechat-article-image-pack-skill', '公众号配图包', 'visual', '文章配图画廊', '为公众号文章生成封面与正文配图的完整 brief 和提示词。'),
  project('xhs-cover-lab-open-skill', '小红书封面实验室', 'visual', '封面碰碰车', '诊断封面类型并生成适合当前内容的视觉 brief。'),
  project('food-recipe-flowchart-skill', '食谱流程图', 'visual', '食谱水上漂流', '把食谱做成手绘流程图和可发布的视觉卡片。'),
  project('wechat-knowledge-infographic-cover-skill', '知识信息图封面', 'visual', '知识海报剧场', '用固定人物 IP 制作公众号知识信息图封面。'),
  project('ip-persona-sticker-card-grid-skill', '个人 IP 贴纸卡', 'visual', '贴纸纪念品商店', '从照片、头像或品牌角色生成个人 IP 贴纸九宫格。'),

  project('voice-expression-workbench', '语音表达训练台', 'media', '声音广播站', '通过浏览器录音和分段练习，训练更自然、清楚的口头表达。'),
  project('lingzao-skill', '灵造公开研究 Skill', 'media', '内容研究瞭望塔', '给 Agent 使用的创作者公开内容研究工作流。'),
  project('xhs-profile-breakdown-skill', '小红书主页拆解', 'media', '主页洞察眼镜店', '用三秒视角检查主页信息是否清楚、可信、值得继续看。'),
  project('weekly-content-motherpack-distributor', '每周母内容分发', 'media', '母内容摩天轮', '把对话和草稿整理成母题，再分发成多平台内容包。'),
  project('xhs-keyword-design-skill', '小红书关键词设计', 'media', '关键词飞镖场', '设计与内容、搜索和用户意图一致的发布关键词。'),
  project('xhs-benchmark-account-finder-skill', '对标账号寻找器', 'media', '对标寻宝迷宫', '寻找仍然活跃、阶段匹配、真正可学的对标账号。'),
  project('multi-platform-publishing-tracker', '多平台发布追踪器', 'media', '发布调度总站', '本地优先地追踪多个平台和账号的发布进度。'),
  project('xhs-postpublish-review-skill', '发布后复盘', 'media', '数据回旋镖', '从发布数据判断下一轮应该保留、调整和测试什么。'),
  project('xhs-prepublish-check-skill', '发布前检查', 'media', '发车安全检查站', '在发布前检查标题、封面、正文、关键词与互动入口。'),
  project('xhs-keyword-to-content-package-skill', '关键词内容包', 'media', '内容打包过山车', '从一个关键词生成可直接生产和发布的完整内容包。'),
  project('benchmark-copy-rewrite-skill', '对标文案安全改写', 'media', '文案镜屋', '保留自己的材料与判断，安全借鉴对标内容结构。'),
  project('benchmark-topic-radar-skill', '对标选题雷达', 'media', '选题雷达塔', '把自有内容与对标样本变成有优先级的下一步选题。'),
  project('topic-title-clarity-check-skill', '选题标题清晰度检查', 'media', '标题投篮机', '在动笔前判断题目是否具体、相关、值得点击。'),
  project('content-system-map-skill', '内容系统地图', 'media', '内容系统大摆锤', '把灵感、栏目、生产、发布与复盘整理成循环系统。'),
  project('multi-platform-publishing-tracker-skill', '多平台发布清单 Skill', 'media', '平台穿梭小火车', '把一个内容包变成跨平台发布清单和复盘提醒。'),
  project('single-note-breakdown-skill', '单篇内容拆解', 'media', '内容解剖剧场', '拆解一篇内容的点击、停留、收藏、评论与可迁移结构。'),
  project('xhs-account-diagnosis-open-skill', '小红书账号诊断', 'media', '账号体检中心', '从公开数据生成面向客户的账号诊断报告。'),
  project('xhs-title-planner-skill', '小红书标题策划', 'media', '标题气球摊', '从真实内容中提取最值得点击的标题钩子。'),
  project('full-web-sync-open-skill', '全网同步发布', 'media', '全网广播塔', '把项目打包为 GitHub Release、X 与知识星球发布材料。'),

  project('desktop-pet-replica', '桌面 AI 小员工', 'agent', 'AI 员工巡游车', '把多个 AI 任务变成会在桌面上移动、工作和反馈状态的小员工。'),
  project('tuyu-language-notebook', '途语旅行语言本', 'agent', '世界语言观光车', '整理旅行中遇到的词语、例句和场景，形成可继续学习的语言笔记。'),
  project('agent-knowledge-space', 'Agent 知识空间', 'agent', '知识空间摩天轮', '把本地知识与 Agent 线程变成关系星图、工作树和粒子空间。'),
  project('content-graph-builder-skill', '内容知识图谱', 'agent', '知识迷宫', '从对话、笔记和项目资料构建 Markdown 双链知识图谱。'),
  project('codex-thread-console', 'Codex 多任务控制台', 'agent', 'Agent 调度塔', '在本地查看和管理多个 Codex 任务的中文工作台。'),
  project('interactive-rhythm-calendar', '互动节奏日历', 'agent', '时间旋转木马', '带本地笔记与提醒的隐私友好型互动日历。'),

  project('atian-playground', '阿甜游乐园', 'interactive', '中央游客中心', '把阿甜做过的开源 Skill、网站和互动项目整理成一座可以逛、可以复制使用的乐园。'),
  project('penang-foodmap-demo', '槟城美食手帐地图', 'interactive', '槟城寻味观光船', '用手帐风互动地图收藏和浏览槟城美食地点。'),
  project('air-magic-book-demo', '空中魔法书', 'interactive', '空中魔法旋转剧场', '通过摄像头识别手势，在空中翻动和操控一本互动魔法书。'),
  project('gesture-curtain-demo', '手势揭幕舞台', 'interactive', '手势揭幕大剧院', '挥动手势拉开舞台幕布，让网页内容以仪式感方式登场。'),
  project('particle-music-box-demo', '粒子音乐盒', 'interactive', '粒子音乐飞椅', '让音乐与粒子动画一起运转，形成可以观看和操作的创意互动体验。'),
  project('wordpop-junior-english', 'WordPop 少儿英语', 'interactive', '单词弹跳乐园', '通过弹跳、配对和反馈，把少儿英语词汇练习变成网页小游戏。'),
  project('quiz-site-builder-skill', '测评网站生成器', 'interactive', '人格测评迷宫', '从题目、维度和计分逻辑生成可分享的测评网站。'),
  project('gesture-music-grid-demo', '隔空水果消消乐', 'interactive', '手势街机厅', '用手势碰指选中、松开消除的三分钟网页街机。', 'https://fruitmatch.midao.site/'),
  project('air-fruit-slicer-demo', '隔空切水果', 'interactive', '体感水果飞船', '用整只手体感切水果，完成五分钟久坐唤醒运动。', 'https://fruitfit.midao.site/'),
  project('opc-test', '一人公司型人格测评', 'interactive', '十二人格迷宫', '用 16 道题看清自己适合的一人公司路径。', 'https://opc.atian.vip/'),
  project('bangkok-michelin-map', '曼谷米其林地图', 'interactive', '米其林观光列车', '浏览并筛选曼谷米其林餐厅的互动地图。', 'https://foodmap.midao.site/'),
  project('cute-stickers', '可爱贴纸生成器', 'interactive', '贴纸拍照屋', '结合风格与内容参考生成可爱贴纸表情包。', 'https://emoji.midao.site/'),
  project('my-ai-web', 'AI 网页实验仓', 'interactive', '实验碰碰车', '用于保留网页实验的公开测试仓库。'),
]

export const openSourceAudit = {
  liveCount: 48,
  checkedAt: '2026-08-21',
  priority: [
    ['content-distribution-workbench-demo', '一人公司内容工作台有完整闭环，公开前需移除真实任务与本地路径。'],
  ],
  prepare: [
    ['write-then-publish-app', '本地 Skill 已存在，需先补 README、示例与公开边界。'],
  ],
  hold: [
    ['life-system-workbench', '当前仍是 starter 形态，且可能混有私人生活数据，不宜直接公开。'],
    ['lingzao-hot-console', '属于产品内部控制台，公开会混淆灵造的产品边界。'],
    ['codex-skins', '与 Dream Skin Studio 能力重叠，优先合并成主题包而非新仓库。'],
    ['food-card-styles', '更像素材与实验资产，应先整理成可复用 Skill 再发布。'],
    ['agent-orbit-demo', '与 agent-knowledge-space 高度重合，建议增量合并而非重复开源。'],
  ],
}

export const agentPrompt = (item) => `请帮我启动并使用这个开源项目：${item.github}\n\n请先阅读仓库中的 README.md 和 SKILL.md（如果存在），然后：\n1. 判断它是否适合我当前的任务；\n2. 告诉我需要准备哪些输入；\n3. 按仓库说明完成安装或调用；\n4. 先给我一个最小可运行示例；\n5. 不要读取或上传与任务无关的私人文件。`

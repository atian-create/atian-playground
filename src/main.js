import './style.css'
import visitorSprite from './assets/visitor-walking.png'
import swanSprite from './assets/swan-boat.png'
import { agentPrompt, categories, openSourceAudit, projects } from './projects.js'

const app = document.querySelector('#app')
const initialCategory = categories.some(category => category.id === location.hash.slice(1)) ? location.hash.slice(1) : 'visual'
const state = { category: initialCategory, project: projects.find(item => item.category === initialCategory), audit: false }

const districts = {
  visual: { direction: '北园区', short: '北 · 做图', scene: '灵感造物园' },
  media: { direction: '东园区', short: '东 · 内容', scene: '内容巡游园' },
  agent: { direction: '西园区', short: '西 · Agent', scene: '知识探索园' },
  interactive: { direction: '南园区', short: '南 · 互动', scene: '游戏体验园' },
}

const districtLayouts = {
  visual: [
    [10,28,22,7,.92],[31,12,70,14,1],[57,22,30,25,.9],[82,12,76,34,.98],[90,40,46,44,.88],
    [69,48,20,53,.95],[43,38,71,61,.9],[18,52,35,70,.92],[34,75,78,80,.96],[72,78,45,91,.92],
  ],
  media: [
    [7,12,22,4,.9],[29,7,72,9,.96],[50,14,31,14,.92],[72,6,78,19,.88],[93,17,48,24,.92],
    [12,37,17,30,.9],[34,31,67,35,.94],[55,40,31,40,.9],[77,33,80,46,.94],[93,43,48,51,.88],
    [6,62,19,56,.92],[28,57,70,61,.9],[51,65,34,66,.94],[73,58,81,71,.9],[92,68,51,76,.88],
    [13,88,20,82,.92],[38,82,69,87,.9],[64,91,35,92,.94],[88,91,79,97,.9],
  ],
  agent: [
    [14,22,25,12,.96],[40,10,72,25,.9],[72,24,34,39,1],[84,56,75,54,.92],[56,70,25,70,.96],[24,78,65,85,.9],
  ],
  interactive: [
    [8,16,22,6,.92],[35,8,72,14,.98],[63,18,30,22,.9],[90,9,74,31,.95],
    [17,41,45,40,.88],[48,34,20,49,.96],[78,44,72,57,.9],
    [8,67,30,66,.94],[37,61,75,74,.9],[68,70,45,82,.96],[94,63,20,90,.9],
    [28,91,70,95,.94],[82,94,43,98,.9],
  ],
}

const projectMarks = {
  'food-sticker-demo': '🍦', 'knowledge-card-journal-skill': '📚', 'solo-ai-paper-collage': '✂️',
  'codex-dream-skin-studio': '🎨', 'handdrawn-route-map-card-skill': '🗺️', 'wechat-article-image-pack-skill': '🖼️',
  'xhs-cover-lab-open-skill': '🪧', 'food-recipe-flowchart-skill': '🍳', 'wechat-knowledge-infographic-cover-skill': '📊',
  'ip-persona-sticker-card-grid-skill': '🧸', 'voice-expression-workbench': '🎙️', 'lingzao-skill': '🔭',
  'xhs-profile-breakdown-skill': '👓', 'weekly-content-motherpack-distributor': '🎡', 'xhs-keyword-design-skill': '🎯',
  'xhs-benchmark-account-finder-skill': '🧭', 'multi-platform-publishing-tracker': '🚦', 'xhs-postpublish-review-skill': '📈',
  'xhs-prepublish-check-skill': '✅', 'xhs-keyword-to-content-package-skill': '🎢', 'benchmark-copy-rewrite-skill': '🪞',
  'benchmark-topic-radar-skill': '📡', 'topic-title-clarity-check-skill': '🏀', 'content-system-map-skill': '🧩',
  'multi-platform-publishing-tracker-skill': '🚂', 'single-note-breakdown-skill': '🔬', 'xhs-account-diagnosis-open-skill': '🩺',
  'xhs-title-planner-skill': '🎈', 'full-web-sync-open-skill': '📣', 'desktop-pet-replica': '🤖',
  'tuyu-language-notebook': '🌍', 'agent-knowledge-space': '🌌', 'content-graph-builder-skill': '🕸️',
  'codex-thread-console': '🗼', 'interactive-rhythm-calendar': '🗓️', 'atian-playground': '🎟️',
  'penang-foodmap-demo': '⛵', 'air-magic-book-demo': '📖', 'gesture-curtain-demo': '🎭',
  'particle-music-box-demo': '🎵', 'wordpop-junior-english': '🔤', 'quiz-site-builder-skill': '🧠',
  'gesture-music-grid-demo': '🍓', 'air-fruit-slicer-demo': '🍉', 'opc-test': '🧑‍💼',
  'bangkok-michelin-map': '🍜', 'cute-stickers': '🐻', 'my-ai-web': '🕹️',
}

const attractionOverrides = {
  'food-sticker-demo': 'icecream',
  'xhs-profile-breakdown-skill': 'glasses',
  'xhs-title-planner-skill': 'balloon',
  'ip-persona-sticker-card-grid-skill': 'gift',
  'penang-foodmap-demo': 'boat',
  'desktop-pet-replica': 'parade',
}

function attractionFor(item) {
  const icon = projectMarks[item.id] || '🎪'
  if (attractionOverrides[item.id]) return [attractionOverrides[item.id], icon]
  const name = `${item.title}${item.facility}`
  if (/照相|封面|画廊|海报|贴纸|拼贴|配图/.test(name)) return ['studio', icon]
  if (/火车|观光车|穿梭/.test(name)) return ['train', icon]
  if (/摩天轮|转盘|旋转木马|飞椅/.test(name)) return ['spin', icon]
  if (/过山车|大摆锤|飞船|回旋镖/.test(name)) return ['ride', icon]
  if (/剧场|舞台|广播|音乐/.test(name)) return ['stage', icon]
  if (/迷宫|知识空间|图谱/.test(name)) return ['maze', icon]
  if (/塔|雷达|总站|中心|检查/.test(name)) return ['tower', icon]
  if (/水上|漂流|船/.test(name)) return ['boat', icon]
  if (/游戏|街机|弹跳|投篮|碰碰车/.test(name)) return ['game', icon]
  if (/工坊|实验|工作室|训练/.test(name)) return ['workshop', icon]
  return ['stall', icon]
}

const categoryCount = id => projects.filter(project => project.category === id).length
const categoryById = id => categories.find(category => category.id === id)

function sidebarMarkup() {
  return categories.map(category => {
    const items = projects.filter(project => project.category === category.id)
    const active = state.category === category.id
    return `
      <section class="project-group ${active ? 'is-active' : ''}" style="--group:${category.color}">
        <button class="group-toggle" data-category="${category.id}" aria-expanded="${active}">
          <span class="group-icon">${category.icon}</span>
          <span><b>${category.name}</b><small>${items.length} 个开源项目</small></span>
          <span class="group-arrow" aria-hidden="true">›</span>
        </button>
        <div class="group-projects">
          ${items.map(item => `
            <button class="project-row ${state.project?.id === item.id ? 'is-selected' : ''}" data-project="${item.id}">
              <span class="row-dot" aria-hidden="true"></span>
              <span><b>${item.title}</b><small>${item.facility}</small></span>
            </button>`).join('')}
        </div>
      </section>`
  }).join('')
}

function hotspotMarkup() {
  const current = projects.filter(project => project.category === state.category)
  return current.map((item, index) => {
    const [kind, icon] = attractionFor(item)
    const [x, y, mx, my, scale] = districtLayouts[state.category][index]
    return `
    <button class="facility facility--${kind} ${state.project?.id === item.id ? 'is-selected' : ''}" style="--i:${index};--x:${x}%;--y:${y}%;--mx:${mx}%;--my:${my}%;--s:${scale}" data-project="${item.id}" aria-label="打开项目：${item.title}，设施：${item.facility}">
      <span class="facility-model" aria-hidden="true"><span>${icon}</span></span>
      <span class="facility-sign"><b>${String(index + 1).padStart(2, '0')}</b><span>${item.facility}</span></span>
    </button>`
  }).join('')
}

function districtNavMarkup() {
  return `
    <nav class="district-switcher" aria-label="切换四个园区页面">
      ${categories.map(category => `<button class="district-link district-link--${category.id} ${state.category === category.id ? 'is-current' : ''}" data-category="${category.id}" style="--district-color:${category.color}"><span>${districts[category.id].short}</span><small>${category.name}</small></button>`).join('')}
      <span class="district-center"><b>四园区</b><small>点击换页</small></span>
    </nav>`
}

function tutorialMarkup(item) {
  return `
    <ol class="tutorial-steps">
      <li><b>打开 GitHub</b><span>先看 README 和示例，确认项目适合你的任务。</span></li>
      <li><b>复制启动提示词</b><span>提示词已经带上仓库链接和安全使用边界。</span></li>
      <li><b>粘贴给 Agent</b><span>Agent 会阅读仓库、准备输入并先运行最小示例。</span></li>
    </ol>
    <div class="drawer-actions">
      <a class="action action--github" href="${item.github}" target="_blank" rel="noreferrer">去 GitHub 查看</a>
      <button class="action action--copy" data-copy-prompt="${item.id}">复制给 Agent</button>
      ${item.homepage ? `<a class="action action--site" href="${item.homepage}" target="_blank" rel="noreferrer">打开在线网站</a>` : ''}
    </div>
    <details class="prompt-preview"><summary>查看配套提示词</summary><pre>${agentPrompt(item)}</pre></details>`
}

function auditMarkup() {
  const section = (title, note, rows, tone) => `
    <section class="audit-section audit-section--${tone}">
      <header><h3>${title}</h3><span>${rows.length}</span></header>
      <p>${note}</p>
      <div>${rows.map(([name, reason]) => `<article><b>${name}</b><span>${reason}</span></article>`).join('')}</div>
    </section>`
  return `
    <div class="audit-summary"><b>${openSourceAudit.liveCount}</b><span>个 GitHub 公开仓库<br><small>核对于 ${openSourceAudit.checkedAt}</small></span></div>
    ${section('值得优先开源', '项目价值和可演示结果都已经比较清楚。', openSourceAudit.priority, 'go')}
    ${section('整理后再开源', '先补说明、授权或隐私边界，再公开会更稳。', openSourceAudit.prepare, 'wait')}
    ${section('暂不建议单独开源', '涉及内部数据、能力重复或仍是素材仓。', openSourceAudit.hold, 'hold')}`
}

app.innerHTML = `
  <main class="park-app">
    <header class="topbar">
      <a class="brand" href="#park"><span class="brand-mark">甜</span><span>阿甜的 Skill 游乐园</span></a>
      <p>把真实项目变成一座可以逛、可以复制使用的开源乐园</p>
      <nav><span class="park-status"><i></i>全园运行中</span><button data-audit>开源排查</button><a href="https://github.com/atian-create" target="_blank" rel="noreferrer">GitHub 主页 ↗</a></nav>
    </header>

    <aside class="project-sidebar" aria-label="开源项目分类">
      <div class="sidebar-heading"><span>四大游园分区</span><b>${projects.length}</b></div>
      <p class="sidebar-intro">48 个开源项目已按用途分组。选择分区，再点开任一设施或项目。</p>
      <div class="project-groups" data-sidebar>${sidebarMarkup()}</div>
      <button class="audit-button" data-audit><span>🚧</span><span><b>施工公告牌</b><small>还有哪些值得开源？</small></span></button>
    </aside>

    <section class="park-map" id="park" data-district="${state.category}" aria-label="阿甜游乐园地图">
      <div class="park-gate" aria-label="阿甜的 Skill 游乐园大门">
        <i class="gate-tower gate-tower--left"></i>
        <div><strong>阿甜的 Skill 游乐园</strong><small>ATIAN'S SKILL PARK</small></div>
        <i class="gate-tower gate-tower--right"></i>
      </div>
      <div class="zone-banner" style="--zone:${categoryById(state.category).color}">
        <span>${categoryById(state.category).icon}</span>
        <div><em data-zone-direction>${districts[state.category].direction} · ${districts[state.category].scene}</em><b data-zone-name>${categoryById(state.category).name}</b><small data-zone-intro>${categoryById(state.category).intro}</small></div>
        <strong data-zone-count>${categoryCount(state.category)} 项</strong>
      </div>
      <div data-district-switcher>${districtNavMarkup()}</div>
      <div class="facility-layer" data-facilities>${hotspotMarkup()}</div>
      <div class="moving-visitors" aria-hidden="true">
        ${Array.from({length: 10}, (_, index) => `<img src="${visitorSprite}" class="moving-visitor moving-visitor--${index + 1}" alt="" style="--delay:-${index * 3.1}s">`).join('')}
      </div>
      <div class="moving-boats" aria-hidden="true">
        <img src="${swanSprite}" class="swan swan--one" alt="">
        <img src="${swanSprite}" class="swan swan--two" alt="">
      </div>
      <div class="map-help"><span>游园方法</span><b>左侧选分区 → 点击设施 → 复制提示词给 Agent</b></div>
    </section>

    <aside class="detail-drawer is-open" data-drawer aria-live="polite">
      <button class="drawer-close" data-close-drawer aria-label="关闭详情">×</button>
      <div data-detail></div>
    </aside>

    <div class="toast" role="status" aria-live="polite" hidden>提示词已复制，可以粘贴给 Agent 了</div>
  </main>`

const sidebar = document.querySelector('[data-sidebar]')
const facilities = document.querySelector('[data-facilities]')
const drawer = document.querySelector('[data-drawer]')
const detail = document.querySelector('[data-detail]')
const parkMap = document.querySelector('.park-map')
const districtSwitcher = document.querySelector('[data-district-switcher]')

function renderDetail(open = true) {
  if (state.audit) {
    detail.innerHTML = `<p class="drawer-kicker">开源排查</p><h2>下一批施工项目</h2><p class="drawer-lead">先把边界整理清楚，再把真正值得复用的项目开放出去。</p>${auditMarkup()}`
  } else {
    const item = state.project
    const category = categoryById(item.category)
    detail.innerHTML = `
      <p class="drawer-kicker" style="color:${category.color}">${category.icon} ${category.name} · ${item.facility}</p>
      <h2>${item.title}</h2>
      <p class="repo-name">github.com/atian-create/${item.repo}</p>
      <p class="drawer-lead">${item.description}</p>
      <h3>三步启动</h3>
      ${tutorialMarkup(item)}`
  }
  drawer.classList.toggle('is-open', open)
}

function renderCategory() {
  const category = categoryById(state.category)
  sidebar.innerHTML = sidebarMarkup()
  sidebar.scrollTop = 0
  facilities.innerHTML = hotspotMarkup()
  districtSwitcher.innerHTML = districtNavMarkup()
  parkMap.dataset.district = category.id
  parkMap.classList.remove('district-arrive')
  requestAnimationFrame(() => parkMap.classList.add('district-arrive'))
  const banner = document.querySelector('.zone-banner')
  banner.style.setProperty('--zone', category.color)
  banner.querySelector('span').textContent = category.icon
  document.querySelector('[data-zone-name]').textContent = category.name
  document.querySelector('[data-zone-direction]').textContent = `${districts[category.id].direction} · ${districts[category.id].scene}`
  document.querySelector('[data-zone-intro]').textContent = category.intro
  document.querySelector('[data-zone-count]').textContent = `${categoryCount(category.id)} 项`
  document.title = `${districts[category.id].direction} · ${category.name}｜阿甜的 Skill 游乐园`
}

function selectProject(id) {
  const item = projects.find(project => project.id === id)
  if (!item) return
  state.project = item
  state.category = item.category
  state.audit = false
  history.replaceState(null, '', `#${item.category}`)
  renderCategory()
  renderDetail()
}

function selectCategory(id) {
  state.category = id
  state.project = projects.find(project => project.category === id)
  state.audit = false
  history.replaceState(null, '', `#${id}`)
  renderCategory()
  renderDetail(false)
}

function showToast(message) {
  const toast = document.querySelector('.toast')
  toast.textContent = message
  toast.hidden = false
  clearTimeout(showToast.timer)
  showToast.timer = setTimeout(() => { toast.hidden = true }, 2600)
}

async function copyPrompt(id) {
  const item = projects.find(project => project.id === id)
  if (!item) return
  try {
    await navigator.clipboard.writeText(agentPrompt(item))
    showToast('提示词已复制，可以粘贴给 Agent 了')
  } catch {
    const area = document.createElement('textarea')
    area.value = agentPrompt(item)
    document.body.append(area)
    area.select()
    document.execCommand('copy')
    area.remove()
    showToast('提示词已复制，可以粘贴给 Agent 了')
  }
}

document.addEventListener('click', event => {
  const projectButton = event.target.closest('[data-project]')
  if (projectButton) selectProject(projectButton.dataset.project)

  const categoryButton = event.target.closest('[data-category]')
  if (categoryButton) selectCategory(categoryButton.dataset.category)

  const copyButton = event.target.closest('[data-copy-prompt]')
  if (copyButton) copyPrompt(copyButton.dataset.copyPrompt)

  if (event.target.closest('[data-audit]')) {
    state.audit = true
    renderDetail()
  }

  if (event.target.closest('[data-close-drawer]')) drawer.classList.remove('is-open')
})

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') drawer.classList.remove('is-open')
})

renderDetail(false)

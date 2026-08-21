import './style.css'
import visitorSprite from './assets/visitor-walking.png'
import swanSprite from './assets/swan-boat.png'
import { agentPrompt, categories, openSourceAudit, projects } from './projects.js'

const app = document.querySelector('#app')
const state = { category: 'visual', project: projects[0], audit: false }
const slots = ['photo', 'carousel', 'train', 'maze', 'wheel', 'tower', 'pendulum', 'boat']

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
  const featured = current.slice(0, 8)
  if (state.project && !featured.some(item => item.id === state.project.id)) featured[0] = state.project
  return featured.map((item, index) => `
    <button class="facility facility--${slots[index]} ${state.project?.id === item.id ? 'is-selected' : ''}" data-project="${item.id}" aria-label="打开项目：${item.title}">
      <span class="facility-sign"><b>${String(index + 1).padStart(2, '0')}</b><span>${item.facility}</span></span>
    </button>`).join('')
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
      <a class="brand" href="#park"><span class="brand-mark">甜</span><span>阿甜游乐园</span></a>
      <p>把真实项目变成一座可以逛、可以复制使用的开源乐园</p>
      <nav><button data-audit>开源排查</button><a href="https://github.com/atian-create" target="_blank" rel="noreferrer">GitHub 主页 ↗</a></nav>
    </header>

    <aside class="project-sidebar" aria-label="开源项目分类">
      <div class="sidebar-heading"><span>四大游园分区</span><b>${projects.length}</b></div>
      <p class="sidebar-intro">48 个开源项目已按用途分组。选择分区，再点开任一设施或项目。</p>
      <div class="project-groups" data-sidebar>${sidebarMarkup()}</div>
      <button class="audit-button" data-audit><span>🚧</span><span><b>施工公告牌</b><small>还有哪些值得开源？</small></span></button>
    </aside>

    <section class="park-map" id="park" aria-label="阿甜游乐园地图">
      <div class="zone-banner" style="--zone:${categoryById(state.category).color}">
        <span>${categoryById(state.category).icon}</span>
        <div><b data-zone-name>${categoryById(state.category).name}</b><small data-zone-intro>${categoryById(state.category).intro}</small></div>
        <strong data-zone-count>${categoryCount(state.category)} 项</strong>
      </div>
      <div class="facility-layer" data-facilities>${hotspotMarkup()}</div>
      <div class="moving-visitors" aria-hidden="true">
        ${Array.from({length: 6}, (_, index) => `<img src="${visitorSprite}" class="moving-visitor moving-visitor--${index + 1}" alt="" style="--delay:-${index * 4.3}s">`).join('')}
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

function renderDetail() {
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
  drawer.classList.add('is-open')
}

function renderCategory() {
  const category = categoryById(state.category)
  sidebar.innerHTML = sidebarMarkup()
  facilities.innerHTML = hotspotMarkup()
  const banner = document.querySelector('.zone-banner')
  banner.style.setProperty('--zone', category.color)
  banner.querySelector('span').textContent = category.icon
  document.querySelector('[data-zone-name]').textContent = category.name
  document.querySelector('[data-zone-intro]').textContent = category.intro
  document.querySelector('[data-zone-count]').textContent = `${categoryCount(category.id)} 项`
}

function selectProject(id) {
  const item = projects.find(project => project.id === id)
  if (!item) return
  state.project = item
  state.category = item.category
  state.audit = false
  renderCategory()
  renderDetail()
}

function selectCategory(id) {
  state.category = id
  state.project = projects.find(project => project.category === id)
  state.audit = false
  renderCategory()
  renderDetail()
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

renderDetail()

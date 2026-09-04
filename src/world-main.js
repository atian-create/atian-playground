import './world.css'
import { projects, categories, agentPrompt } from './projects.js'
import audit from './data/catalog-audit.json'
import { createPark, zones } from './park-world.js'

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const state={category:'all',query:'',language:'zh',project:null}
const count=id=>projects.filter(p=>p.category===id).length
const evidence=id=>audit.rows.find(r=>r.repo===id)
const missingEnglish=audit.rows.filter(r=>!r.english&&!r.bilingualInReadme&&!r.error)
const missingImages=audit.rows.filter(r=>!r.readmeEmbedsImages&&!r.error)
const byCategory={
  visual:{input:'一份真实内容、使用平台、画面比例，以及可公开使用的照片或参考图。',output:'先生成一张示例或一份视觉方案，再确认是否继续批量制作。'},
  media:{input:'一篇真实内容或公开链接、目标账号与读者，以及这次想解决的具体问题。',output:'先用一个样本完成分析或草稿，并明确材料不足的地方。'},
  agent:{input:'一个演示任务和一份脱敏样例资料。涉及本地应用时，说明操作系统与 Agent 环境。',output:'先建立最小示例，确认输入、处理步骤、保存位置和结果。'},
  interactive:{input:'设备与浏览器、希望体验的功能。摄像头或麦克风项目可先尝试仓库支持的替代操作。',output:'先打开或本地运行一个完整示例，确认交互与结果是否正常。'},
}
document.querySelector('#app').innerHTML=`
  <div class="workbench">
    <aside class="sidebar" aria-label="项目目录">
      <a class="brand" href="#all"><span class="brand-icon">甜</span><span>阿甜的 Skill 游乐园<small>A LITTLE WORLD OF IDEAS</small></span></a>
      <div class="sidebar-intro"><span class="eyebrow">OPEN SOURCE, OPEN GATES</span><h1>把灵感，<br>变成一座乐园。</h1><p>逛逛我做过的 ${projects.length} 个项目。<br>找到喜欢的，把它带进你的工作流。</p></div>
      <label class="search"><span aria-hidden="true">⌕</span><input type="search" placeholder="找一个 Skill 或项目" aria-label="搜索项目" autocomplete="off"><kbd>/</kbd></label>
      <div class="catalog-title"><span>园区与项目</span><span>${projects.length} 项</span></div>
      <nav class="catalog" aria-label="四大园区" data-catalog></nav>
      <footer class="sidebar-footer"><button data-audit>项目收录与待补内容 <span>↗</span></button><a href="https://github.com/atian-create" target="_blank" rel="noreferrer">GitHub · atian-create ↗</a></footer>
    </aside>
    <main class="world-panel">
      <header class="world-header"><div><span class="live-dot"></span><b>今日正常营业</b><span class="weather">晴 · 适合散步与发现</span></div><button class="text-button" data-audit>待补内容</button><button class="text-button" data-guide>游园指南 ↗</button></header>
      <div class="scene" data-world><div class="loading" role="status">正在打开乐园大门…</div></div>
      <nav class="district-tabs" aria-label="场景视角"><button data-zone="all" class="active">全园漫游</button>${categories.map(c=>`<button data-zone="${c.id}"><i style="background:${c.color}"></i>${zones[c.id].title}<small>${count(c.id)}</small></button>`).join('')}</nav>
      <div class="scene-caption"><span class="eyebrow">WELCOME TO ATIAN'S PARK</span><h2 data-view-title>每一个小世界，<br>都有一个真实的作品。</h2><p data-view-subtitle>四个园区 · ${projects.length} 个项目 · 沿路自由探索</p></div>
      <div class="view-tools" aria-label="场景控制"><button data-home title="返回全园" aria-label="返回全园">⌂</button><button data-zoom="1.25" aria-label="放大">＋</button><button data-zoom="0.8" aria-label="缩小">−</button><button data-pause aria-label="暂停乐园动画">Ⅱ</button></div>
      <div class="world-footer"><span>拖动转动视角 · 滚轮缩放 · 点击整座设施</span><span class="park-population">58 位游客正在园内散步</span></div>
      <div class="hover-card" hidden data-hover></div>
      <div class="scene-fallback" hidden data-fallback><b>当前设备暂时无法显示三维乐园</b><p>所有项目仍可通过左侧目录打开，教程与复制提示词可以继续使用。</p></div>
    </main>
    <dialog class="drawer" aria-label="项目与使用说明"><button class="drawer-close" aria-label="关闭详情" data-close>×</button><div data-detail></div></dialog>
    <div class="toast" role="status" hidden></div>
  </div>`
const catalog=document.querySelector('[data-catalog]'),dialog=document.querySelector('dialog'),detail=document.querySelector('[data-detail]'),host=document.querySelector('[data-world]')
let world
function renderCatalog(){
  const filtered=projects.filter(p=>`${p.title} ${p.repo} ${p.description} ${p.facility}`.toLowerCase().includes(state.query.toLowerCase()))
  catalog.innerHTML=categories.map((c,i)=>{
    const list=filtered.filter(p=>p.category===c.id),open=state.query||state.category===c.id||matchMedia('(max-width:680px)').matches
    return `<section class="catalog-group ${open?'expanded':''}"><button class="category-row" data-category="${c.id}" aria-expanded="${!!open}"><span class="category-number" style="--color:${c.color}">0${i+1}</span><span><b>${c.name}</b><small>${zones[c.id].en}</small></span><em>${list.length}</em><span>⌄</span></button><div class="project-list">${list.map(p=>`<button class="project-row ${state.project?.id===p.id?'selected':''}" data-project="${p.id}"><b>${escape(p.title)}</b><span>${escape(p.facility)}</span></button>`).join('')}${!list.length?'<p class="empty">这里暂时没有匹配项目</p>':''}</div></section>`
  }).join('')
}
function setZone(id,updateHash=true){
  if(id!=='all'&&!zones[id])return
  state.category=id;world?.focus(id);renderCatalog()
  document.querySelectorAll('[data-zone]').forEach(b=>b.classList.toggle('active',b.dataset.zone===id))
  document.querySelector('[data-view-title]').innerHTML=id==='all'?'每一个小世界，<br>都有一个真实的作品。':zones[id].title
  document.querySelector('[data-view-subtitle]').textContent=id==='all'?`四个园区 · ${projects.length} 个项目 · 沿路自由探索`:categories.find(c=>c.id===id).intro
  document.querySelector('.scene-caption').classList.toggle('compact',id!=='all')
  document.title=`${id==='all'?'全园漫游':zones[id].title}｜阿甜的 Skill 游乐园`
  if(updateHash)history.replaceState(null,'',`#${id}`)
}
function showDialog(){if(!dialog.open)dialog.showModal()}
function promptFor(p){return `${agentPrompt(p)}\n\n这次我要使用「${p.title}」：${p.description}\n请提醒我准备：${byCategory[p.category].input}\n第一步交付：${byCategory[p.category].output}`}
function renderProject(){
  const p=state.project,r=evidence(p.id),en=state.language==='en'
  const screenshot=r?.screenshots?.[0],home=p.homepage||r?.homepage
  const englishUrl=r?.english?`${p.github}/blob/HEAD/${r.english}`:p.github
  detail.innerHTML=`<p class="eyebrow">${escape(zones[p.category].en)} / ${escape(p.facility)}</p><div class="detail-top"><h2>${escape(p.title)}</h2><button class="language" data-language>${en?'中文':'EN'}</button></div><p class="repo-name">${escape(p.repo)}</p><p class="description">${escape(en?(r?.description||p.description):p.description)}</p>
    <div class="detail-actions"><a class="primary" href="${escape(p.github)}" target="_blank" rel="noreferrer">GitHub ↗</a>${home?`<a class="secondary" href="${escape(home)}" target="_blank" rel="noreferrer">${en?'Open website':'打开网站'} ↗</a>`:''}<button class="secondary" data-locate>${en?'Find in park':'在园内找到它'}</button></div>
    <h3>${en?'Take this project into your workflow':'把这个项目带进工作流'}</h3><ol class="steps"><li><b>${en?'Read the project guide':'先看项目说明'}</b><p>${en?'Open the repository and check its README, examples and requirements.':'打开 GitHub，查看 README、示例和运行要求。'}</p></li><li><b>${en?'Prepare one real sample':'准备一个真实样例'}</b><p>${escape(en?'Use one relevant sample and your intended output. Start with non-sensitive demo material.':byCategory[p.category].input)}</p></li><li><b>${en?'Run a small example with your Agent':'交给 Agent 运行一个最小示例'}</b><p>${escape(en?'Copy the project-specific prompt below into your Agent. It should read the repository and confirm requirements before running.':byCategory[p.category].output)}</p></li></ol>
    <button class="copy-button" data-copy>${en?'Copy launch prompt for Agent':'复制这个项目的启动提示词'} ↗</button><details class="prompt"><summary>${en?'View / select prompt':'查看／手动复制提示词'}</summary><pre tabindex="0">${escape(en?`Help me use this project: ${p.github}\nRead its README and SKILL.md if available. Explain the required inputs and dependencies, then run the smallest useful example for ${p.repo}. Ask for missing inputs. Do not access unrelated private files.`:promptFor(p))}</pre></details>
    <h3>${en?'Repository preview and documentation':'项目预览与文档'}</h3>${screenshot?`<figure class="project-preview"><img src="https://raw.githubusercontent.com/atian-create/${p.repo}/HEAD/${encodeURI(screenshot)}" alt="${escape(p.title)} 仓库中的示例预览" loading="lazy"><figcaption>${en?'Existing repository preview; not a newly verified walkthrough.':'仓库已有预览图；不等同于本轮实测的使用教程。'}</figcaption></figure>`:`<p class="documentation-note">${en?'No named tutorial screenshot was detected. See the repository for its existing assets and examples.':'暂未检测到以教程／预览命名的截图。可前往仓库查看已有素材和示例。'}</p>`}
    <div class="doc-links"><a href="${p.github}#readme" target="_blank" rel="noreferrer">README ↗</a>${r?.skill?`<a href="${p.github}/blob/HEAD/${r.skill}" target="_blank" rel="noreferrer">SKILL.md ↗</a>`:''}<a href="${englishUrl}" target="_blank" rel="noreferrer">${r?.english?'English README ↗':'英文文档待核对 ↗'}</a></div>`
  detail.querySelector('img')?.addEventListener('error',e=>{e.target.hidden=true;e.target.nextElementSibling.textContent='预览暂时无法加载，请在 GitHub 仓库查看原图。'})
}
function selectProject(id){const p=projects.find(p=>p.id===id);if(!p)return;state.project=p;state.category=p.category;state.language='zh';renderCatalog();renderProject();showDialog()}
function showAudit(){
  const section=(title,rows,note)=>`<section class="audit-section"><h3>${title} <span>${rows.length}</span></h3><p>${note}</p>${rows.map(r=>`<button data-project="${r.repo}">${escape(r.title||r.repo)} <span>↗</span></button>`).join('')}</section>`
  detail.innerHTML=`<p class="eyebrow">CATALOG CHECK / ${audit.checkedAt}</p><h2>有哪些内容还没填？</h2><p class="description">已按 GitHub 公开仓库逐项核对。收录完整不代表每个项目的教程和演示都完整。</p><div class="audit-stats"><div><b>${audit.publicRepoCount}</b><span>公开仓库</span></div><div><b>${projects.length}</b><span>已入园</span></div><div><b>${audit.missingFromPark.length}</b><span>漏收录</span></div></div><p class="documentation-note">本轮已补：项目预览入口、项目专属启动提示词、输入准备说明、文档状态，以及乐园自己的在线入口。</p>${section('README 尚未嵌入图片',missingImages,'这是自动检查结果：没有嵌入图片不等于没有素材，也不等于每一个文本 Skill 都必须配图。')}${section('英文说明待人工复核',missingEnglish,'未检测到独立英文 README 或常见双语章节。可能有零散英文说明，需人工确认完整性。')}<p class="documentation-note">私有或本地专用 Skill 不算公开仓库漏项。本轮没有自动公开私人资料，也没有替其他仓库编造截图。</p>`;showDialog()
}
function showGuide(){detail.innerHTML=`<p class="eyebrow">YOUR FIRST LITTLE ADVENTURE</p><h2>欢迎来到阿甜的乐园。</h2><ol class="steps"><li><b>先逛一逛</b><p>四个园区就在同一座乐园里。点击上方园区名称，镜头会带你过去；游客会继续沿道路散步。</p></li><li><b>靠近一个喜欢的设施</b><p>拖动转动视角，滚轮或加减按钮缩放。鼠标划过建筑，整座设施会亮起粒子；点击即可查看项目。</p></li><li><b>把作品带走</b><p>阅读说明、打开 GitHub 或在线网站；复制项目提示词给你的 Agent，先完成一个小示例。</p></li></ol><p class="documentation-note">手机可单指转动、双指缩放；喜欢安静画面可以暂停动画。三维画面无法加载时，左侧全部项目和教程仍然可用。</p><button class="copy-button" data-close>开始游园 →</button>`;showDialog()}
function toast(text){const t=document.querySelector('.toast');(dialog.open?dialog:document.body).append(t);t.textContent=text;t.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.hidden=true,3200)}
document.querySelector('input').addEventListener('input',e=>{state.query=e.target.value;renderCatalog()})
matchMedia('(max-width:680px)').addEventListener('change',renderCatalog)
document.addEventListener('click',async e=>{
  const b=e.target.closest('button');if(!b)return
  if(b.dataset.zone)setZone(b.dataset.zone)
  if(b.dataset.category)setZone(state.category===b.dataset.category?'all':b.dataset.category)
  if(b.dataset.project)selectProject(b.dataset.project)
  if(b.hasAttribute('data-home'))setZone('all')
  if(b.dataset.zoom)world?.zoom(Number(b.dataset.zoom))
  if(b.hasAttribute('data-close'))dialog.close()
  if(b.hasAttribute('data-audit'))showAudit()
  if(b.hasAttribute('data-guide'))showGuide()
  if(b.hasAttribute('data-locate')){dialog.close();setZone(state.project.category);world?.focus(state.project.category,state.project.id)}
  if(b.hasAttribute('data-language')){state.language=state.language==='zh'?'en':'zh';renderProject()}
  if(b.hasAttribute('data-pause')&&world){world.setPaused(!world.paused);b.textContent=world.paused?'▷':'Ⅱ';b.setAttribute('aria-label',world.paused?'继续乐园动画':'暂停乐园动画');document.querySelector('.park-population').textContent=world.paused?'时间暂停，灵感继续':'58 位游客正在园内散步'}
  if(b.hasAttribute('data-copy')){try{await navigator.clipboard.writeText(detail.querySelector('pre').textContent);toast('已复制，粘贴给你的 Agent 即可。')}catch{detail.querySelector('details').open=true;const range=document.createRange();range.selectNodeContents(detail.querySelector('pre'));const selection=getSelection();selection.removeAllRanges();selection.addRange(range);toast('浏览器未允许自动复制，提示词已选中，请手动复制。')}}
})
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}})
document.addEventListener('keydown',e=>{if(e.key==='/'&&!dialog.open&&document.activeElement.tagName!=='INPUT'){e.preventDefault();document.querySelector('input').focus()}})
window.addEventListener('hashchange',()=>setZone(location.hash.slice(1)||'all',false))
renderCatalog()
try {
  world=createPark(host,projects,selectProject,(item,x,y)=>{const tip=document.querySelector('[data-hover]');tip.hidden=!item;if(item){tip.innerHTML=`<small>${escape(item.facility)}</small><b>${escape(item.title)}</b><span>点击进入项目 ↗</span>`;tip.style.left=`${Math.max(8,Math.min(x+16,innerWidth-244))}px`;tip.style.top=`${Math.max(8,Math.min(y+16,innerHeight-100))}px`}})
  host.querySelector('.loading').remove()
  if(world.paused){document.querySelector('[data-pause]').textContent='▷';document.querySelector('[data-pause]').setAttribute('aria-label','继续乐园动画');document.querySelector('.park-population').textContent='已根据系统偏好暂停动画'}
  host.dataset.ready='true';host.dataset.facilities=world.snapshot().facilities
  host.querySelector('canvas').addEventListener('webglcontextlost',e=>{e.preventDefault();document.querySelector('[data-fallback]').hidden=false})
}catch(error){console.error('Park renderer could not initialize:',error);host.querySelector('.loading')?.remove();document.querySelector('[data-fallback]').hidden=false}
setZone(location.hash.slice(1)||'all',false)
window.addEventListener('pagehide',()=>world?.dispose(),{once:true})

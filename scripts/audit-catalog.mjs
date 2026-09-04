import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { writeFile, mkdir } from 'node:fs/promises'
import { projects } from '../src/projects.js'
const exec = promisify(execFile)
async function gh(...args) {
  const { stdout } = await exec('gh', args, { timeout: 45000, maxBuffer: 12 * 1024 * 1024 })
  return JSON.parse(stdout)
}
const repos = (await gh('repo', 'list', 'atian-create', '--limit', '250', '--json', 'name,isPrivate,isFork,description,homepageUrl,defaultBranchRef')).filter(r => !r.isPrivate && !r.isFork)
const rows = []
let cursor = 0
await Promise.all(Array.from({ length: 5 }, async () => {
  while (cursor < repos.length) {
    const repo = repos[cursor++]
    const item = projects.find(p => p.repo === repo.name)
    try {
      const tree = await gh('api', `repos/atian-create/${repo.name}/git/trees/${repo.defaultBranchRef.name}?recursive=1`)
      const files = tree.tree.filter(t => t.type === 'blob').map(t => t.path)
      let readme = ''
      try {
        const data = await gh('api', `repos/atian-create/${repo.name}/readme`)
        readme = Buffer.from(data.content, 'base64').toString('utf8')
      } catch {}
      const images = files.filter(p => /\.(png|jpe?g|webp|gif)$/i.test(p) && !/node_modules|package|icon|favicon/i.test(p))
      const screenshots = images.filter(p => /screen|preview|demo|usage|guide|step|examples|截图|教程/i.test(p))
      const english = files.find(p => /readme[._-]en[^/]*\.md$/i.test(p) || /en\/readme\.md$/i.test(p)) || ''
      const skill = files.find(p => /(^|\/)SKILL\.md$/.test(p)) || ''
      rows.push({ repo: repo.name, title: item?.title || repo.name, description: repo.description, category: item?.category || '', included: !!item, homepage: repo.homepageUrl || '', parkHomepage: item?.homepage || '', readme: !!readme, english, skill, imageCount: images.length, screenshots: screenshots.slice(0, 4), readmeEmbedsImages: /!\[[^\]]*\]\(|<img\b/i.test(readme), bilingualInReadme: /[\u4e00-\u9fff]/.test(readme) && /\b(Quick Start|Installation|Usage|Getting Started)\b/i.test(readme), truncated: !!tree.truncated })
    } catch (e) { rows.push({ repo: repo.name, included: !!item, error: e.message.slice(0, 160) }) }
  }
}))
rows.sort((a,b) => a.repo.localeCompare(b.repo))
const report = { checkedAt: new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai'}).format(new Date()), publicRepoCount: repos.length, parkCount: projects.length, missingFromPark: rows.filter(r => !r.included).map(r => r.repo), absentOnGithub: projects.filter(p => !repos.some(r => r.name === p.repo)).map(p => p.repo), rows }
await mkdir('src/data', { recursive: true })
await writeFile('src/data/catalog-audit.json', JSON.stringify(report, null, 2) + '\n')
console.log(JSON.stringify({ ...report, rows: undefined, missingEnglish: rows.filter(r => !r.english && !r.bilingualInReadme).map(r => r.repo), noReadmeImages: rows.filter(r => !r.readmeEmbedsImages).map(r => r.repo), emptyParkHomepages: rows.filter(r => r.homepage && !r.parkHomepage).map(r => ({repo:r.repo,homepage:r.homepage})), errors: rows.filter(r => r.error) }, null, 2))

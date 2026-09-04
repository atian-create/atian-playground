// Explicit publication helper for this repository. Uses existing gh authentication;
// never reads or prints credentials and never force-updates branches.
import { spawn } from 'node:child_process'
import { readFile } from 'node:fs/promises'
const repo='repos/atian-create/atian-playground'
async function api(path,method='GET',payload){
  return new Promise((resolve,reject)=>{
    const args=['api',path,'--method',method];if(payload)args.push('--input','-')
    const child=spawn('gh',args,{stdio:['pipe','pipe','pipe']});let out='',err=''
    child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>err+=d)
    child.on('error',reject);child.on('close',code=>code?reject(new Error(err)):resolve(JSON.parse(out)))
    child.stdin.end(payload?JSON.stringify(payload):undefined)
  })
}
if(process.argv[2]==='source'){
  const branch='codex/continuous-3d-park-20260905'
  const base=await api(`${repo}/git/ref/heads/main`),commit=await api(`${repo}/git/commits/${base.object.sha}`)
  const paths=['index.html','package.json','package-lock.json','README.md','README_EN.md','src/world-main.js','src/world.css','src/park-world.js','src/data/catalog-audit.json','scripts/audit-catalog.mjs','scripts/publish-pages.mjs','docs/3d-upgrade.md','docs/screenshots/park-3d-overview.png','docs/screenshots/park-3d-guide.png','docs/screenshots/park-3d-mobile.png']
  const tree=[]
  for(const path of paths){const blob=await api(`${repo}/git/blobs`,'POST',{content:(await readFile(path)).toString('base64'),encoding:'base64'});tree.push({path,mode:'100644',type:'blob',sha:blob.sha})}
  const createdTree=await api(`${repo}/git/trees`,'POST',{base_tree:commit.tree.sha,tree})
  const createdCommit=await api(`${repo}/git/commits`,'POST',{message:'Build a continuous 3D Skill park with articulated walking visitors',tree:createdTree.sha,parents:[base.object.sha]})
  await api(`${repo}/git/refs`,'POST',{ref:`refs/heads/${branch}`,sha:createdCommit.sha})
  console.log(JSON.stringify({branch,sha:createdCommit.sha,base:base.object.sha}))
}else if(process.argv[2]==='pages'){
  const existing=await api(`${repo}/contents/index.html?ref=gh-pages`)
  const result=await api(`${repo}/contents/index.html`,'PUT',{branch:'gh-pages',sha:existing.sha,message:'Publish continuous 3D park and catalog audit',content:(await readFile('dist/index.html')).toString('base64')})
  console.log(JSON.stringify({sha:result.commit.sha,url:result.commit.html_url}))
}else throw new Error('Choose an explicit operation: source or pages')

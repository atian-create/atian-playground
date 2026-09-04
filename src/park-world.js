import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export const zones = {
  visual: { x: -31, z: -27, color: 0xf0a37c, ground: 0xb9d887, title: '创作花园', en: 'CREATIVE GARDENS' },
  media: { x: 31, z: -27, color: 0xf16b52, ground: 0xb4d98c, title: '内容嘉年华', en: 'CONTENT CARNIVAL' },
  agent: { x: -31, z: 27, color: 0x539d8a, ground: 0xa8cc91, title: '知识森林', en: 'KNOWLEDGE WOODS' },
  interactive: { x: 31, z: 27, color: 0x589fc8, ground: 0xc9dda0, title: '湖畔游戏岛', en: 'PLAYFUL LAKESIDE' },
}

export function createPark(host, projects, onSelect, onHover) {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xe5f0dc)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  host.append(renderer.domElement)
  renderer.domElement.setAttribute('aria-label', '连续三维乐园。拖动转动视角，滚轮缩放，点击整座设施查看项目。所有项目也可从左侧列表访问。')
  const camera = new THREE.OrthographicCamera(-80, 80, 55, -55, .1, 600)
  camera.position.set(95, 115, 135)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.enableDamping = true
  controls.dampingFactor = .09
  controls.minPolarAngle = .25
  controls.maxPolarAngle = 1.18
  controls.minZoom = .6
  controls.maxZoom = 5
  controls.enablePan = true
  scene.add(new THREE.HemisphereLight(0xfff8e8, 0x73886b, 2.6))
  const sun = new THREE.DirectionalLight(0xfff3d9, 3)
  sun.position.set(-45, 95, 55)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  Object.assign(sun.shadow.camera, { left:-80, right:80, top:80, bottom:-80, near:1, far:220 })
  sun.shadow.normalBias = .12
  scene.add(sun)
  const materials = new Map()
  const mat = color => {
    if (!materials.has(color)) materials.set(color, new THREE.MeshStandardMaterial({ color, roughness: .86, flatShading: true }))
    return materials.get(color)
  }
  const geometries = new Map()
  const geo = (key, build) => { if (!geometries.has(key)) geometries.set(key, build()); return geometries.get(key) }
  function mesh(parent, geometry, color, x=0,y=0,z=0) {
    const obj = new THREE.Mesh(geometry, mat(color))
    obj.position.set(x,y,z); obj.castShadow = true; obj.receiveShadow = true; parent.add(obj); return obj
  }
  function box(p,w,h,d,c,x=0,y=0,z=0) { const m=mesh(p,geo('box',()=>new THREE.BoxGeometry(1,1,1)),c,x,y,z); m.scale.set(w,h,d); return m }
  function sphere(p,r,c,x=0,y=0,z=0) { const m=mesh(p,geo('sphere',()=>new THREE.SphereGeometry(1,10,8)),c,x,y,z); m.scale.setScalar(r); return m }
  function cylinder(p,rt,rb,h,c,x=0,y=0,z=0,n=12) { return mesh(p,geo(`c${rt},${rb},${h},${n}`,()=>new THREE.CylinderGeometry(rt,rb,h,n)),c,x,y,z) }
  function beam(p,a,b,r,c) {
    const v1=new THREE.Vector3(...a),v2=new THREE.Vector3(...b), dir=v2.clone().sub(v1)
    const m=cylinder(p,r,r,dir.length(),c,...v1.clone().add(v2).multiplyScalar(.5).toArray(),6)
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()); return m
  }
  function sign(p,text,x,y,z,width=9,background='#fff9dc',foreground='#304e42') {
    const canvas=document.createElement('canvas'); canvas.width=1024; canvas.height=192
    const ctx=canvas.getContext('2d');ctx.fillStyle=background;ctx.fillRect(0,0,1024,192)
    ctx.strokeStyle=foreground;ctx.lineWidth=12;ctx.strokeRect(8,8,1008,176)
    ctx.fillStyle=foreground;ctx.font='bold 64px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,512,100,960)
    const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace
    const m=new THREE.Mesh(new THREE.PlaneGeometry(width,width*192/1024),new THREE.MeshBasicMaterial({map:tex,side:THREE.DoubleSide}));m.position.set(x,y,z);p.add(m);return m
  }
  const ground=box(scene,124,2,114,0x8eaf7a,0,-1.2,0)
  box(scene,122,.35,112,0xb4d68e,0,-.08,0)
  const water=cylinder(scene,11,11,.15,0x72cbd8,30,.19,27,48)
  const animations=[]
  const nodes=[], edges=[]
  function node(x,z) { nodes.push({x,z,links:[]});return nodes.length-1 }
  function path(a,b,width=2.5) {
    if (nodes[a].links.includes(b)) return
    nodes[a].links.push(b); nodes[b].links.push(a);edges.push([a,b])
    const v1=nodes[a],v2=nodes[b],dx=v2.x-v1.x,dz=v2.z-v1.z
    const road=box(scene,width,.16,Math.hypot(dx,dz),0xf6e4b7,(v1.x+v2.x)/2,.16,(v1.z+v2.z)/2)
    road.rotation.y=Math.atan2(dx,dz)
  }
  const center=node(0,0)
  const north=node(0,-27),south=node(0,27),entry=node(0,53)
  path(north,center,4);path(center,south,4);path(south,entry,5)
  cylinder(scene,7,7,.3,0xffedd0,0,.2,0,32)
  cylinder(scene,3,3,.8,0xf1dfb8,0,.65,0,24)
  cylinder(scene,2.7,2.7,.1,0x68cddc,0,1.09,0,24)
  const fountain=[]
  for(let i=0;i<15;i++) fountain.push(sphere(scene,.12,0xe7ffff,0,2,0))
  animations.push(t=>fountain.forEach((d,i)=>{const a=i/15*Math.PI*2,u=(t*.45+i/15)%1;d.position.set(Math.cos(a)*u*2,1+Math.sin(u*Math.PI)*3,Math.sin(a)*u*2)}))
  const rng = (()=>{let seed=718;return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}})()
  function tree(x,z,size=1,color=0x78aa64) {
    const g=new THREE.Group();g.position.set(x,.2,z);scene.add(g);g.scale.setScalar(size)
    cylinder(g,.22,.34,2,0x957450,0,1,0,7)
    sphere(g,1.6,color,0,2.7,0);sphere(g,1.1,color,.55,3.8,.12)
  }
  // Landscape belongs to the same world, including the paths between districts.
  for(let i=0;i<105;i++) {
    const x=(rng()-.5)*117,z=(rng()-.5)*106
    if(Math.abs(x)<6 || Math.abs(z)<5 || Math.abs(Math.abs(z)-27)<3) continue
    const nearby=Object.values(zones).some(q=>Math.hypot(x-q.x,z-q.z)<24)
    if(!nearby) tree(x,z,.75+rng()*.7,[0x73a45c,0x85b963,0x97bc72][i%3])
  }
  const animatedFlags=[]
  function flag(p,x,y,z,c) {
    cylinder(p,.055,.055,1.8,0xf9f2da,x,y,z,6)
    const f=box(p,.8,.42,.045,c,x+.39,y+.55,z);animatedFlags.push(f)
  }
  function stall(p,c,variant) {
    box(p,3.3,2.5,2.6,0xfff0cf,0,1.4,0)
    const roof=cylinder(p,0,2.7,1.55,c,0,3.35,0,4);roof.rotation.y=Math.PI/4
    box(p,2.9,.18,1.2,c,0,2.35,1.65)
    for(let i=0;i<5;i++) box(p,.57,.17,1.22,i%2?0xfffbec:c,-1.15+i*.575,2.45,1.66)
    box(p,1.15,1.3,.1,0x497f86,0,1.32,1.34)
    for(const x of [-1.08,1.08]) box(p,.6,.6,.1,0x8fd4d9,x,1.8,1.35)
    flag(p,-1.4,4.35,0,c)
    if(variant==='camera') { cylinder(p,.58,.58,.5,0x304f53,0,3.9,1.1,16).rotation.x=Math.PI/2; sphere(p,.32,0x82cddd,0,3.9,1.4) }
    if(variant==='icecream') { cylinder(p, .65,0,1.4,0xd39d63,0,4.3,0,8);sphere(p,.85,0xffb2c3,0,5.25,0);sphere(p,.2,0xe95b49,0,6.02,0) }
    if(variant==='balloon') for(let i=0;i<4;i++) {const b=sphere(p,.55,[0xf47869,0xffdc6a,0x79c8cd,0xe6ace3][i],-1.2+i*.75,4.3+(i%2)*.6,0);beam(p,[0,2.5,0],[b.position.x,b.position.y,0],.018,0xede2c9);animations.push(t=>{b.position.y=4.3+(i%2)*.6+Math.sin(t*2+i)*.13})}
    if(variant==='glasses') for(const x of [-.62,.62]) {const m=mesh(p,new THREE.TorusGeometry(.52,.12,6,16),0x304e43,x,4.2,1);beam(p,[-.12,4.2,1],[.12,4.2,1],.08,0x304e43)}
  }
  function wheel(p,c) {
    beam(p,[-2.3,.4,0],[0,5.4,0],.19,0xf4ce6a);beam(p,[2.3,.4,0],[0,5.4,0],.19,0xf4ce6a)
    const rotor=new THREE.Group();rotor.position.set(0,5.4,.3);p.add(rotor)
    mesh(rotor,new THREE.TorusGeometry(3.7,.13,6,40),c)
    const cabins=[]
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2,x=Math.cos(a)*3.7,y=Math.sin(a)*3.7;beam(rotor,[0,0,0],[x,y,0],.055,0xfff2cf);const cabin=new THREE.Group();cabin.position.set(x,y,0);rotor.add(cabin);box(cabin,.8,.85,.8,i%2?c:0xffcd63,0,-.4,0);box(cabin,.85,.12,.85,0xfff7de,0,.12,0);cabins.push(cabin)}
    animations.push(t=>{rotor.rotation.z=t*.19;cabins.forEach(c=>c.rotation.z=-rotor.rotation.z)})
  }
  function carousel(p,c) {
    cylinder(p,2.5,2.7,.4,0xe7c477,0,.45,0,24)
    const spin=new THREE.Group();p.add(spin)
    cylinder(spin,.18,.18,4,0xffdc77,0,2.3,0)
    cylinder(spin,0,2.8,1.3,c,0,4.3,0,12)
    const horses=[]
    for(let i=0;i<6;i++){const a=i/6*Math.PI*2,x=Math.cos(a)*1.8,z=Math.sin(a)*1.8;cylinder(spin,.04,.04,3,0xf7df9d,x,2,z,6);const h=box(spin,.7,.6,.32,i%2?0xffffff:0xefb569,x,1.45,z);horses.push(h)}
    animations.push(t=>{spin.rotation.y=t*.42;horses.forEach((h,i)=>h.position.y=1.45+Math.sin(t*2+i)*.3)})
  }
  function tower(p,c) {
    cylinder(p,.9,1.45,6,c,0,3.35,0,6);cylinder(p,1.65,1.65,.85,0xffecb9,0,5.8,0,12)
    cylinder(p,0,1.9,1.3,c,0,7,0,6)
    const radar=new THREE.Group();radar.position.y=8;p.add(radar)
    const dish=mesh(radar,new THREE.SphereGeometry(1,12,6,0,Math.PI),0xf7f2d6);dish.rotation.z=.7
    beam(radar,[0,-.7,0],[0,.2,.9],.06,c);animations.push(t=>radar.rotation.y=t*.65)
  }
  function pendulum(p,c) {
    beam(p,[-2.6,.4,0],[0,6,0],.22,0x53a9c0);beam(p,[2.6,.4,0],[0,6,0],.22,0x53a9c0)
    const arm=new THREE.Group();arm.position.set(0,5.7,.2);p.add(arm)
    beam(arm,[0,0,0],[0,-3.8,0],.15,c)
    const seats=cylinder(arm,1.25,1.25,.4,c,0,-3.8,0,16);sphere(arm,.35,0xffd97c)
    animations.push(t=>{arm.rotation.z=Math.sin(t*1.1)*.85;seats.rotation.y=t})
  }
  function train(p,c) {
    const route=new THREE.EllipseCurve(0,0,2.6,1.5,0,Math.PI*2)
    const line=new THREE.BufferGeometry().setFromPoints(route.getPoints(48).map(v=>new THREE.Vector3(v.x,.32,v.y)))
    p.add(new THREE.LineLoop(line,new THREE.LineBasicMaterial({color:0x647c73})))
    const carts=[]
    for(let i=0;i<3;i++){const g=new THREE.Group();p.add(g);box(g,.9,.75,.7,c,0,.7,0);box(g,.95,.14,.8,0xffefbd,0,1.25,0);for(const x of [-.3,.3])for(const z of [-.4,.4])sphere(g,.18,0x49605a,x,.3,z);carts.push(g)}
    animations.push(t=>carts.forEach((g,i)=>{const a=t*.7-i*.47;g.position.set(Math.cos(a)*2.6,0,Math.sin(a)*1.5);g.rotation.y=-a}))
  }
  function maze(p,c) {
    for(let row=0;row<5;row++) for(let col=0;col<5;col++) if((row+col)%3!==0) box(p,.9,1.1,.9,c,(col-2)*1.1,.85,(row-2)*1.1)
    flag(p,0,3,0,0xffcd65)
  }
  function stage(p,c) {
    box(p,4.4,.6,3.5,0xd5b187,0,.6,0);box(p,4.4,3,.25,c,0,2,-1.2)
    cylinder(p,0,3.2,1.8,c,0,4,0,4).rotation.y=Math.PI/4
    const left=box(p,1.6,2.5,.13,0xd34b51,-1,2,.65),right=box(p,1.6,2.5,.13,0xd34b51,1,2,.65)
    animations.push(t=>{const open=.3+.45*(Math.sin(t*.65)+1);left.scale.x=right.scale.x=open;left.position.x=-1.9+open*.5;right.position.x=1.9-open*.5})
  }
  function boat(p,c) {
    cylinder(p,3.2,3.2,.15,0x7bd2dc,0,.32,0,32)
    const g=new THREE.Group();p.add(g)
    const hull=sphere(g,1,0xfff6db,0,.55,0);hull.scale.set(.65,.4,1.1)
    cylinder(g,.11,.15,.9,0xfff6db,0,1,.7);sphere(g,.27,0xfff6db,0,1.5,.65);box(g,.16,.12,.3,0xf7ac4f,0,1.48,.94)
    animations.push(t=>{g.position.set(Math.sin(t*.4)*1.4,Math.sin(t*1.5)*.07,Math.cos(t*.4)*1.2);g.rotation.y=t*.4+Math.PI/2})
  }
  function coaster(p,c) {
    const pts=Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return new THREE.Vector3(Math.cos(a)*3,1.7+Math.sin(a*2)*1.05,Math.sin(a)*2.2)})
    const curve=new THREE.CatmullRomCurve3(pts,true)
    mesh(p,new THREE.TubeGeometry(curve,80,.11,5,true),c)
    pts.forEach(v=>beam(p,[v.x,.2,v.z],v.toArray(),.07,0xffe4a8))
    const cars=[];for(let i=0;i<3;i++) cars.push(box(p,.6,.45,.8,0xffd677,0,0,0))
    animations.push(t=>cars.forEach((car,i)=>{const u=(t*.12-i*.045+10)%1;car.position.copy(curve.getPointAt(u));car.position.y+=.35;car.lookAt(curve.getPointAt((u+.015)%1).add(new THREE.Vector3(0,.35,0)))}))
  }
  function kind(item) {
    const n=item.facility
    if(/摩天轮/.test(n))return 'wheel'
    if(/旋转木马|飞椅|转盘/.test(n))return 'carousel'
    if(/过山车/.test(n))return 'coaster'
    if(/大摆锤|回旋镖|飞船/.test(n))return 'pendulum'
    if(/火车|列车|巡游车|观光车/.test(n))return 'train'
    if(/船|漂流/.test(n))return 'boat'
    if(/迷宫/.test(n))return 'maze'
    if(/塔|中心|总站|检查站/.test(n))return 'tower'
    if(/剧场|剧院|广播/.test(n))return 'stage'
    if(/冰淇淋/.test(n))return 'icecream'
    if(/气球/.test(n))return 'balloon'
    if(/眼镜/.test(n))return 'glasses'
    return 'camera'
  }
  const facilities=[],clickables=[]
  for(const [id,q] of Object.entries(zones)) {
    const plaza=node(q.x,q.z);path(plaza,q.z<0?north:south,3)
    cylinder(scene,22,22,.18,q.ground,q.x,.07,q.z,48)
    if(id!=='interactive') {cylinder(scene,5.5,5.5,.16,0xf6e4b7,q.x,.25,q.z,32);tree(q.x,q.z,1.8,id==='visual'?0xe6a7a9:0x6b9e66)}
    sign(scene,q.title,q.x,5.8,q.z,12)
    const items=projects.filter(p=>p.category===id), ring=[]
    // An irregular ring of plots is connected to the plaza and the shared park roads.
    for(let i=0;i<items.length;i++) {
      const a=i/items.length*Math.PI*2+.23, r=16.8+(i%3)*1.35
      const x=q.x+Math.cos(a)*r,z=q.z+Math.sin(a)*r
      const road=node(q.x+Math.cos(a)*11.8,q.z+Math.sin(a)*11.8);ring.push(road)
      if(i%4===0)path(plaza,road,2)
      const gate=node(x-Math.cos(a)*3.8,z-Math.sin(a)*3.8);path(road,gate,1.6)
      const group=new THREE.Group();group.position.set(x,.2,z);group.rotation.y=-a+Math.PI/2;scene.add(group)
      group.userData.project=items[i]
      cylinder(group,3.5,3.7,.28,0xf0debb,0,.1,0,12)
      const k=kind(items[i]);const constructors={wheel,carousel,tower,pendulum,train,maze,stage,boat,coaster}
      if(constructors[k])constructors[k](group,q.color);else stall(group,q.color,k)
      const num=sign(group,String(projects.indexOf(items[i])+1).padStart(2,'0'),0,1,3.25,1.2,'#fff8d8','#365146')
      const ringGlow=mesh(group,new THREE.TorusGeometry(3.7,.12,6,48),0xffdc66,0,.35,0);ringGlow.rotation.x=Math.PI/2;ringGlow.visible=false
      // The entire architectural envelope is selectable, including wheel spokes and openings.
      const bounds=new THREE.Box3().setFromObject(group),size=bounds.getSize(new THREE.Vector3())
      const volume=new THREE.Mesh(new THREE.BoxGeometry(Math.max(6.5,size.x),size.y,Math.max(6.5,size.z)),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}))
      volume.position.y=size.y/2;group.add(volume)
      facilities.push({group,item:items[i],ring:ringGlow,kind:k});group.traverse(m=>{if(m.isMesh)clickables.push(m)})
      for(let j=0;j<2;j++)tree(x+Math.cos(a+.4+j*.15)*4,z+Math.sin(a+.4+j*.15)*4,.6+j*.2,id==='visual'?0xe6b0af:0x77a760)
    }
    for(let i=0;i<ring.length;i++)path(ring[i],ring[(i+1)%ring.length],2.25)
  }
  // One articulated visitor model: opposite arms/legs, knee flexion, foot roll and torso weight shift.
  function visitor(index) {
    const root=new THREE.Group();scene.add(root)
    const body=new THREE.Group();root.add(body)
    const shirt=[0xe36e52,0x479bab,0xf3bd53,0x7585b9,0xe7a0ba,0x589574][index%6]
    const skin=[0xe7b18a,0xbd825d,0xf0c9a2][index%3]
    box(body,.5,.6,.31,shirt,0,1.05,0)
    sphere(body,.23,skin,0,1.59,0)
    const hair=sphere(body,.238,0x5c493a,0,1.69,-.025);hair.scale.y*=.55
    for(const x of [-.085,.085])sphere(body,.021,0x343c38,x,1.61,.212)
    const legs=[],knees=[],arms=[]
    for(const side of [-1,1]) {
      const hip=new THREE.Group();hip.position.set(side*.145,.8,0);root.add(hip);legs.push(hip)
      box(hip,.19,.36,.2,0x536778,0,-.16,0)
      const knee=new THREE.Group();knee.position.y=-.32;hip.add(knee);knees.push(knee)
      box(knee,.17,.31,.18,0x536778,0,-.14,0);box(knee,.21,.12,.32,0xffefd5,0,-.29,.07)
      const arm=new THREE.Group();arm.position.set(side*.33,1.28,0);body.add(arm);arms.push(arm)
      box(arm,.14,.29,.16,shirt,0,-.12,0);box(arm,.12,.22,.13,skin,0,-.34,.015)
    }
    root.scale.setScalar(1.05+(index%4)*.07)
    const start=index%nodes.length,next=nodes[start].links[index%nodes[start].links.length]
    return {root,body,legs,knees,arms,from:start,to:next,u:(index*.371)%1,phase:index*.73,speed:1.45+(index%5)*.13,wait:0}
  }
  const visitors=Array.from({length:58},(_,i)=>visitor(i))
  let t=0, paused=matchMedia('(prefers-reduced-motion: reduce)').matches
  let active=null,selected=null,hovered=null,flight=null,frame,last=performance.now(),fpsFrames=0,fpsElapsed=0
  const particles=new THREE.Group();scene.add(particles)
  const motes=Array.from({length:24},(_,i)=>sphere(particles,.07+(i%3)*.025,i%2?0xffe398:0xffffff))
  particles.visible=false
  const ray=new THREE.Raycaster(),pointer=new THREE.Vector2()
  function hit(event) {
    const r=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-r.left)/r.width*2-1,-(event.clientY-r.top)/r.height*2+1)
    ray.setFromCamera(pointer,camera)
    const hits=ray.intersectObjects(clickables,false)
    if(!hits.length)return null
    let m=hits[0].object;while(m&&!m.userData.project)m=m.parent
    return facilities.find(f=>f.group===m)||null
  }
  function highlight() {for(const f of facilities)f.ring.visible=f===hovered||f===selected;active=hovered||selected;particles.visible=!!active}
  let down=null
  renderer.domElement.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY};flight=null})
  renderer.domElement.addEventListener('pointermove',e=>{hovered=hit(e);highlight();renderer.domElement.style.cursor=hovered?'pointer':'grab';onHover(hovered?.item||null,e.clientX,e.clientY)})
  renderer.domElement.addEventListener('pointerleave',()=>{hovered=null;highlight();onHover(null)})
  renderer.domElement.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)<6){const f=hit(e);if(f){selected=f;highlight();onSelect(f.item.id)}}down=null})
  renderer.domElement.addEventListener('wheel',()=>{flight=null},{passive:true})
  const resize=()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);const span=Math.max(100,145*h/w);camera.left=-span*w/h/2;camera.right=span*w/h/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix()}
  const ro=new ResizeObserver(resize);ro.observe(host);resize()
  const offset=new THREE.Vector3(95,115,135)
  function focus(category,projectId) {
    const q=zones[category],f=facilities.find(f=>f.item.id===projectId)
    const target=f?f.group.position.clone():q?new THREE.Vector3(q.x,0,q.z):new THREE.Vector3()
    selected=f||null;highlight()
    flight={from:controls.target.clone(),to:target,position:camera.position.clone(),zoom:camera.zoom,toZoom:f?3.7:q?2:.88,start:performance.now()}
  }
  function animate(now) {
    frame=requestAnimationFrame(animate)
    const dt=Math.min((now-last)/1000,.05);last=now
    if(document.hidden)return
    if(!paused)t+=dt
    if(flight){const u=Math.min((now-flight.start)/1000,1),s=u*u*(3-2*u);controls.target.lerpVectors(flight.from,flight.to,s);camera.position.lerpVectors(flight.position,flight.to.clone().add(offset),s);camera.zoom=THREE.MathUtils.lerp(flight.zoom,flight.toZoom,s);camera.updateProjectionMatrix();if(u===1)flight=null}
    controls.update()
    animations.forEach(fn=>fn(t));animatedFlags.forEach((f,i)=>f.rotation.y=Math.sin(t*2+i)*.16)
    visitors.forEach((v,i)=>{
      let a=nodes[v.from],b=nodes[v.to],length=Math.hypot(a.x-b.x,a.z-b.z)
      if(!paused){if(v.wait>0)v.wait-=dt;else {v.u+=dt*v.speed/length;v.phase+=dt*v.speed*4.1}}
      if(v.u>=1){v.u=0;const old=v.from;v.from=v.to;const choices=nodes[v.from].links.filter(n=>n!==old);v.to=choices.length?choices[(i+Math.floor(t*.3))%choices.length]:old;if((i+Math.floor(t))%9===0)v.wait=.8+(i%3);a=nodes[v.from];b=nodes[v.to]}
      const dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz),lane=(i%2?1:-1)*.22
      v.root.position.set(THREE.MathUtils.lerp(a.x,b.x,v.u)+dz/l*lane,.28,THREE.MathUtils.lerp(a.z,b.z,v.u)-dx/l*lane)
      const angle=Math.atan2(dx,dz),delta=Math.atan2(Math.sin(angle-v.root.rotation.y),Math.cos(angle-v.root.rotation.y));v.root.rotation.y+=delta*Math.min(dt*9,1)
      const stride=v.wait>0?0:Math.sin(v.phase),lift=v.wait>0?0:Math.cos(v.phase*2)
      v.legs[0].rotation.x=stride*.57;v.legs[1].rotation.x=-stride*.57
      v.knees[0].rotation.x=Math.max(0,-stride)*.6;v.knees[1].rotation.x=Math.max(0,stride)*.6
      v.arms[0].rotation.x=-stride*.46;v.arms[1].rotation.x=stride*.46;v.body.position.y=.028*lift;v.body.rotation.z=stride*.025
    })
    if(active){particles.position.copy(active.group.position);motes.forEach((p,i)=>{const a=i/24*Math.PI*2+t*.55,r=3.7+Math.sin(t+i)*.15;p.position.set(Math.cos(a)*r,.5+(t*.7+i*.14)%3,Math.sin(a)*r)});active.ring.scale.setScalar(1+Math.sin(t*3)*.04)}
    renderer.render(scene,camera)
    fpsFrames++;fpsElapsed+=dt
    if(fpsElapsed>1){host.dataset.fps=String(Math.round(fpsFrames/fpsElapsed));host.dataset.visitors=String(visitors.length);host.dataset.walkPhase=visitors[0].legs[0].rotation.x.toFixed(3);fpsFrames=0;fpsElapsed=0}
  }
  frame=requestAnimationFrame(animate)
  // The park gate is geometry in the same scene as visitors and attractions.
  for(const x of [-5.6,5.6]){box(scene,1.5,5,1.5,0xffefc7,x,2.6,50);cylinder(scene,0,1.6,1.5,0xdd6550,x,5.8,50,4)}
  box(scene,12,1.5,1,0xf7efd7,0,5,50)
  sign(scene,'阿甜的 Skill 游乐园',0,5,50.56,11.5)
  return {focus, setPaused(value){paused=value;host.dataset.paused=String(paused)},get paused(){return paused},zoom(delta){flight=null;camera.zoom=THREE.MathUtils.clamp(camera.zoom*delta,.6,5);camera.updateProjectionMatrix()},dispose(){cancelAnimationFrame(frame);ro.disconnect();controls.dispose();scene.traverse(o=>{o.geometry?.dispose();if(o.material&&!materials.has(o.material.color?.getHex())){o.material.map?.dispose();o.material.dispose?.()}});materials.forEach(m=>m.dispose());renderer.dispose()},snapshot(){return {facilities:facilities.length,visitors:visitors.length,nodes:nodes.length,edges:edges.length,paused}}}
}

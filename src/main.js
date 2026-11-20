import * as THREE from 'three';
import './style.css';

const mount = document.querySelector('#game');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ab7b4);
scene.fog = new THREE.FogExp2(0x9ab7b4, 0.0085);

const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, 0.1, 220);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xdcecff, 0x3d5135, 1.8));
const sun = new THREE.DirectionalLight(0xffdfae, 2.5);
sun.position.set(-35, 55, 25);
sun.castShadow = true;
sun.shadow.mapSize.set(1536, 1536);
sun.shadow.camera.left = -65; sun.shadow.camera.right = 65;
sun.shadow.camera.top = 65; sun.shadow.camera.bottom = -65;
scene.add(sun);

const mat = (c, r=0.9, metal=0) => new THREE.MeshStandardMaterial({color:c, roughness:r, metalness:metal});
const groundMat = mat(0x506d3d);
const dirtMat = mat(0x8a7957);
const barkMat = mat(0x493321);
const leafMats = [mat(0x244a2d),mat(0x315d36),mat(0x3c6a3d)];
const stoneMat = mat(0x77796d);
const goldMat = mat(0xd4ae62,0.35,0.45);

const ground = new THREE.Mesh(new THREE.PlaneGeometry(220,220),groundMat);
ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);

function addMesh(parent, geo, material, pos, scale) {
  const m=new THREE.Mesh(geo,material); m.position.set(...pos);
  if(scale)m.scale.set(...scale); m.castShadow=true; m.receiveShadow=true; parent.add(m); return m;
}
function makeTree(x,z,s=1) {
  const g=new THREE.Group();
  addMesh(g,new THREE.CylinderGeometry(.22*s,.38*s,3.2*s,9),barkMat,[0,1.6*s,0]);
  for(let i=0;i<4;i++){
    const crown=addMesh(g,new THREE.ConeGeometry((1.55-i*.18)*s,2.5*s,9),leafMats[i%3],[0,(2.4+i*.65)*s,0]);
    crown.rotation.y=i*.35;
  }
  g.position.set(x,0,z);scene.add(g);
}
for(let i=0;i<170;i++){
  const x=(Math.random()-.5)*190,z=(Math.random()-.5)*190;
  if(Math.abs(x)<17&&Math.abs(z)<23)continue;
  makeTree(x,z,.7+Math.random()*.9);
}
for(let i=0;i<35;i++){
  const rock=addMesh(scene,new THREE.DodecahedronGeometry(.7+Math.random()*1.2,0),stoneMat,[(Math.random()-.5)*170,.3,(Math.random()-.5)*170],[1,.6,1.2]);
  rock.rotation.set(Math.random(),Math.random(),Math.random());
}
for(let i=0;i<18;i++){
  const hill=addMesh(scene,new THREE.ConeGeometry(8+Math.random()*9,13+Math.random()*18,7),mat(0x536c62),[(Math.random()-.5)*190,5,(Math.random()-.5)*190],[1,1,1]);
  hill.position.y=-1;
}

// Winding dirt trail
const trail=addMesh(scene,new THREE.PlaneGeometry(7,75),dirtMat,[6,.018,-12]);
trail.rotation.x=-Math.PI/2;trail.rotation.z=-.13;

// Castle with towers, walls, battlements and gate
const castle=new THREE.Group();
addMesh(castle,new THREE.BoxGeometry(15,7,10),mat(0x9a8a70),[0,3.5,0]);
addMesh(castle,new THREE.BoxGeometry(3,4,0.5),mat(0x493525),[0,2,5.1]);
for(const [x,z] of [[-7,-4],[7,-4],[-7,4],[7,4]]){
  addMesh(castle,new THREE.CylinderGeometry(1.35,1.55,11,10),mat(0x9d907a),[x,5.5,z]);
  addMesh(castle,new THREE.ConeGeometry(1.7,3,10),mat(0x594333),[x,12.5,z]);
}
for(let x=-5.5;x<=5.5;x+=2.2)addMesh(castle,new THREE.BoxGeometry(1,1.2,1),mat(0xb0a28a),[x,7.5,5]);
castle.position.set(-3,0,-22);scene.add(castle);
const market=new THREE.Group();
addMesh(market,new THREE.BoxGeometry(6,3.5,5),mat(0x9c7144),[0,1.75,0]);
addMesh(market,new THREE.ConeGeometry(4.5,2.6,4),mat(0x54392a),[0,4.5,0]);
addMesh(market,new THREE.BoxGeometry(2.5,.55,.2),mat(0x4a2d1c),[0,2.9,2.6]);
market.position.set(17,0,5);scene.add(market);

function makePerson(){
  const g=new THREE.Group();
  const coat=mat(0x344d52), leather=mat(0x60432c), skin=mat(0xc28e68), metal=mat(0x6d7776,.4,.6);
  addMesh(g,new THREE.CapsuleGeometry(.48,.95,5,9),coat,[0,1.28,0]);
  addMesh(g,new THREE.SphereGeometry(.34,14,12),skin,[0,2.15,0]);
  addMesh(g,new THREE.SphereGeometry(.39,12,10),leather,[0,2.43,-.02],[1,.65,1]);
  addMesh(g,new THREE.BoxGeometry(.22,.85,.24),leather,[-.25,.55,0]);
  addMesh(g,new THREE.BoxGeometry(.22,.85,.24),leather,[.25,.55,0]);
  const pack=addMesh(g,new THREE.BoxGeometry(.65,.8,.3),leather,[0,1.35,.48]);
  pack.rotation.x=-.12;
  // bow and arrow silhouette
  const bow=addMesh(g,new THREE.TorusGeometry(.52,.045,7,24,Math.PI),goldMat,[.62,1.42,0]);
  bow.rotation.z=-Math.PI/2;
  const brim=addMesh(g,new THREE.CylinderGeometry(.5,.5,.08,12),leather,[0,2.48,0]);
  return g;
}
const player=makePerson();player.position.set(0,0,5);scene.add(player);

// Bear model built from shaped meshes; animated breathing and steps
function makeBear(x,z){
  const g=new THREE.Group(), fur=mat(0x543725), furLight=mat(0x704a30), dark=mat(0x211914);
  addMesh(g,new THREE.SphereGeometry(1,18,14),fur,[0,1.15,.15],[1.05,.82,1.45]);
  addMesh(g,new THREE.SphereGeometry(.62,16,12),furLight,[0,1.72,-1.02],[.95,.9,.95]);
  addMesh(g,new THREE.SphereGeometry(.29,12,10),dark,[0,1.49,-1.56],[1,.65,1]);
  for(const s of [-1,1]){
    addMesh(g,new THREE.SphereGeometry(.2,10,8),fur,[s*.43,2.18,-1.08]);
    const leg=addMesh(g,new THREE.CylinderGeometry(.22,.28,.82,10),fur,[s*.64,.5,.82]);
    addMesh(g,new THREE.SphereGeometry(.25,10,8),dark,[s*.64,.16,.9]);
    leg.userData.leg=true;
  }
  const eyeMat=mat(0x090807,.2);
  for(const s of [-1,1])addMesh(g,new THREE.SphereGeometry(.055,8,8),eyeMat,[s*.34,1.85,-1.53]);
  g.position.set(x,0,z);scene.add(g);
  return {group:g,hp:3,alive:true,phase:Math.random()*5,baseY:1};
}
const bears=[makeBear(-12,-3),makeBear(23,-18),makeBear(-28,19),makeBear(34,30),makeBear(-38,-31),makeBear(12,42)];

function makeGrassPatch(x,z){
  const group=new THREE.Group();
  const green=mat(0x75904b);
  for(let i=0;i<5;i++){
    const blade=addMesh(group,new THREE.ConeGeometry(.09,.8,4),green,[(Math.random()-.5)*.7,.35,(Math.random()-.5)*.7]);
    blade.rotation.z=(Math.random()-.5)*.5;
  }
  group.position.set(x,0,z);scene.add(group);
}
for(let i=0;i<240;i++)makeGrassPatch((Math.random()-.5)*150,(Math.random()-.5)*150);

// Ambient fireflies / floating motes
const moteGeo=new THREE.BufferGeometry(), moteCount=180, motePos=[];
for(let i=0;i<moteCount;i++)motePos.push((Math.random()-.5)*100,Math.random()*8,(Math.random()-.5)*100);
moteGeo.setAttribute('position',new THREE.Float32BufferAttribute(motePos,3));
const motes=new THREE.Points(moteGeo,new THREE.PointsMaterial({color:0xf4d68a,size:.11,transparent:true,opacity:.55}));
scene.add(motes);

let coins=0,meat=0,health=100,xp=0,level=1,castleLevel=1,workers=0;
const $=id=>document.getElementById(id);
function hud(){
  $('coins').textContent=coins;$('meat').textContent=meat;$('health').textContent=health;
  $('level').textContent=`Hunter level ${level} · XP ${xp}`;
  $('objective').textContent=meat>=5?'Return to the market and sell your meat':meat>0?'Keep hunting to collect 5 meat':'Explore the forest and hunt a bear';
}
let toastTimer;
function toast(s){$('toast').textContent=s;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',2600);}

// Simple generated sound effects; no external audio download required
let audioCtx=null,soundOn=true;
function tone(freq,duration,type='sine',volume=.045){
  if(!soundOn)return;
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended')audioCtx.resume();
    const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
    osc.type=type;osc.frequency.setValueAtTime(freq,audioCtx.currentTime);
    gain.gain.setValueAtTime(volume,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);
    osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+duration);
  }catch(e){}
}
function sound(kind){
  if(kind==='hit'){tone(115,.16,'sawtooth');tone(65,.22,'triangle',.07)}
  if(kind==='collect'){tone(520,.12);setTimeout(()=>tone(760,.18),90)}
  if(kind==='sell'){tone(440,.1);setTimeout(()=>tone(660,.1),100);setTimeout(()=>tone(880,.2),200)}
  if(kind==='upgrade'){tone(330,.2);setTimeout(()=>tone(495,.2),120);setTimeout(()=>tone(660,.3),240)}
  if(kind==='roar'){tone(75,.45,'sawtooth',.08);setTimeout(()=>tone(58,.35,'sawtooth',.05),180)}
}

const keys={x:0,z:0},joy=$('joystick'),stick=$('stick');
let joyPointer=null;
joy.addEventListener('pointerdown',e=>{joyPointer=e.pointerId;joy.setPointerCapture(e.pointerId);moveJoy(e)});
joy.addEventListener('pointermove',e=>{if(e.pointerId===joyPointer)moveJoy(e)});
function moveJoy(e){
  const r=joy.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;
  let dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy),max=32;
  if(len>max){dx=dx/len*max;dy=dy/len*max}
  stick.style.transform=`translate(${dx}px,${dy}px)`;keys.x=dx/max;keys.z=dy/max;
}
function endJoy(e){if(e.pointerId===joyPointer){joyPointer=null;keys.x=0;keys.z=0;stick.style.transform='translate(0,0)'}}
joy.addEventListener('pointerup',endJoy);joy.addEventListener('pointercancel',endJoy);

let lastAttack=0;
$('attack').onclick=()=>{
  const now=performance.now();if(now-lastAttack<650)return;lastAttack=now;
  let target=null,distance=999;
  for(const b of bears){if(!b.alive)continue;const d=player.position.distanceTo(b.group.position);if(d<distance){distance=d;target=b}}
  if(!target||distance>6){toast('Bear ke qareeb jao!');return}
  target.hp--;sound('hit');
  if(target.hp<=0){
    target.alive=false;target.group.visible=false;meat+=3;xp+=25;
    if(xp>=100){xp-=100;level++;toast('Hunter level up!')}
    sound('collect');toast('Bear hunted! +3 meat, +25 XP');
  }else toast('Hit successful! Bear ko dobara hunt karo.');
  hud();
};
$('sell').onclick=()=>{
  if(player.position.distanceTo(market.position)>11){toast('Market ke paas jao!');return}
  if(!meat){toast('Sell karne ke liye meat nahi hai.');return}
  const earned=meat*15;coins+=earned;meat=0;sound('sell');hud();toast(`Meat sold! +${earned} coins`);
};
$('upgrade').onclick=()=>{
  const cost=castleLevel*150;if(coins<cost){toast(`Castle upgrade: ${cost} coins chahiye.`);return}
  coins-=cost;castleLevel++;castle.scale.multiplyScalar(1.055);sound('upgrade');hud();toast(`Castle upgraded to level ${castleLevel}!`);
};
$('hire').onclick=()=>{
  const cost=(workers+1)*100;if(coins<cost){toast(`Worker hire: ${cost} coins chahiye.`);return}
  coins-=cost;workers++;
  const worker=makePerson();worker.scale.set(.72,.72,.72);worker.position.set(-1+workers*1.2,0,-16);scene.add(worker);
  sound('upgrade');hud();toast(`Kingdom worker hired: ${workers}`);
};
$('sound').onclick=()=>{soundOn=!soundOn;$('sound').textContent=soundOn?'🔊 Sound ON':'🔇 Sound OFF';if(soundOn)sound('collect')};
let high=true;
$('quality').onclick=()=>{
  high=!high;renderer.setPixelRatio(Math.min(devicePixelRatio,high?1.5:1));
  renderer.shadowMap.enabled=high;$('quality').textContent=`Graphics: ${high?'HIGH':'LOW'}`;
  toast(`Graphics set to ${high?'HIGH':'LOW'}`);
};

const clock=new THREE.Clock(),cameraOffset=new THREE.Vector3(0,8.5,13);
function animate(){
  requestAnimationFrame(animate);
  const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
  const move=new THREE.Vector3(keys.x,0,keys.z);
  if(move.length()>1)move.normalize();
  player.position.addScaledVector(move,dt*8);
  player.position.x=THREE.MathUtils.clamp(player.position.x,-85,85);
  player.position.z=THREE.MathUtils.clamp(player.position.z,-85,85);
  if(move.lengthSq()>.01){player.rotation.y=Math.atan2(move.x,move.z);player.position.y=Math.abs(Math.sin(t*11))*.035}
  for(const b of bears){
    if(!b.alive)continue;
    b.phase+=dt;
    const d=b.group.position.distanceTo(player.position);
    if(d<14){
      const dir=new THREE.Vector3().subVectors(player.position,b.group.position).setY(0).normalize();
      if(d>3.3)b.group.position.addScaledVector(dir,dt*1.15);
      b.group.rotation.y=Math.atan2(dir.x,dir.z);
      if(d<3.2&&Math.random()<.002){health=Math.max(0,health-5);hud();sound('roar');toast('Bear attack! Move away!')}
    }else{
      b.group.position.x+=Math.sin(b.phase*.55)*dt*.35;
      b.group.position.z+=Math.cos(b.phase*.42)*dt*.35;
    }
    b.group.position.y=Math.sin(b.phase*2)*.035;
  }
  const targetCam=player.position.clone().add(cameraOffset);
  camera.position.lerp(targetCam,.075);
  camera.lookAt(player.position.x,player.position.y+1.1,player.position.z-2);
  motes.rotation.y=t*.018;
  renderer.render(scene,camera);
}
requestAnimationFrame(animate);
addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);
});
hud();toast('Welcome to the wild. Find a bear and hunt!');

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SandVisual } from './sand-visual.js';
import { Transformation } from './transformation.js';
import { GranularSand } from './physics.js';

/** Reusable visual: owns its renderer, resize observer and resources, never the timer. */
export class HourglassView {
  constructor(container, {assetURL='/hourglass/hourglass.glb'}={}) {
    this.container=container;this.progress=-1;this.flowing=false;this.disposed=false;this.phase=0;
    this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    this.renderer.setPixelRatio(Math.min(devicePixelRatio,2));this.renderer.setClearColor(0x080d22,0);
    this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
    this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
    this.renderer.domElement.setAttribute('aria-hidden','true');container.appendChild(this.renderer.domElement);
    this.scene=new THREE.Scene();this.scene.background=null;this.camera=new THREE.PerspectiveCamera(34,1,.1,60);this.camera.position.set(3.3,1.9,8.6);
    this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,-.05,0);this.controls.enableDamping=true;this.controls.enablePan=false;this.controls.minDistance=6.8;this.controls.maxDistance=11;this.controls.minPolarAngle=.35;this.controls.maxPolarAngle=Math.PI*.78;this.controls.saveState();
    const pmrem=new THREE.PMREMGenerator(this.renderer),studio=new THREE.Scene();studio.background=new THREE.Color(0x363636);
    for(const [x,y,z,w,h,power] of [[-3,1,2,1,5,3],[3,2,-2,.65,4,2],[0,5,0,3,2,1]]){const panel=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(1,.97,.9).multiplyScalar(power),side:THREE.DoubleSide}));panel.position.set(x,y,z);panel.lookAt(0,0,0);studio.add(panel);}
    this.environment=pmrem.fromScene(studio,.03);this.scene.environment=this.environment.texture;this.release(studio);pmrem.dispose();
    this.scene.add(new THREE.HemisphereLight(0xb9cdfb,0x282238,1));
    const key=new THREE.DirectionalLight(0xe4edff,2.5);key.position.set(-3,5,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-3;key.shadow.camera.right=3;key.shadow.camera.top=3;key.shadow.camera.bottom=-3;key.shadow.bias=-.002;this.scene.add(key);
    const rim=new THREE.DirectionalLight(0x839dff,1.5);rim.position.set(3,2,-2);this.scene.add(rim);
    const fill=new THREE.DirectionalLight(0xffd398,.8);fill.position.set(1,1,4);this.scene.add(fill);
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.3}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.965*.82;floor.receiveShadow=true;this.scene.add(floor);
    this.object=new THREE.Group();this.scene.add(this.object);this.physics=new GranularSand(3200,{radius:.02288});this.tilt=0;this.pitch=.12;this.yaw=.32;this.lift=0;this.accumulator=0;this.simulationSpeed=1;this.mode='object';this.controls.enabled=false;
    this.applyOrientation();this.roles=new Transformation();for(let i=0;i<25;i++)this.physics.step(1/60,[0,0,0]);this.physics.v.fill(0);
    this.sand=new SandVisual(this.physics);this.object.add(this.sand);this.gravity=new THREE.Vector3();this.inverse=new THREE.Quaternion();this.sand.update(0,this.roles,true);this.physics.beginTransfer(1);
    this.pointer=null;this.onDown=e=>{if(this.mode!=='object')return;this.pointer={id:e.pointerId,x:e.clientX,y:e.clientY,tilt:this.tilt,pitch:this.pitch,lift:this.lift,shift:e.shiftKey};container.setPointerCapture(e.pointerId);};
    this.onMove=e=>{if(!this.pointer||e.pointerId!==this.pointer.id)return;this.setTilt(this.pointer.tilt+(e.clientX-this.pointer.x)*.009);if(this.pointer.shift)this.setLift(this.pointer.lift-(e.clientY-this.pointer.y)*.006);else this.setDepthRotation(this.pointer.pitch+(e.clientY-this.pointer.y)*.006,this.yaw);this.onManipulate?.();};
    this.onUp=()=>{this.pointer=null;};container.addEventListener('pointerdown',this.onDown);container.addEventListener('pointermove',this.onMove);container.addEventListener('pointerup',this.onUp);container.addEventListener('pointercancel',this.onUp);
    this.ready=new GLTFLoader().loadAsync(assetURL).then(gltf=>{
      if(this.disposed){this.release(gltf.scene);return;}
      const remove=[];gltf.scene.traverse(o=>{if(!o.isMesh)return;if(o.name.startsWith('Sand_')){remove.push(o);return;}
        if(o.name==='Glass_vessel') {const old=o.material;o.material=new THREE.MeshPhysicalMaterial({color:0xffffff,metalness:0,roughness:.06,transmission:0,transparent:true,opacity:.12,depthWrite:false,envMapIntensity:.5,specularIntensity:.6});old.dispose();o.castShadow=false;}
        else {o.castShadow=true;o.receiveShadow=true;o.material.envMapIntensity=.85;}
      });remove.forEach(o=>{o.removeFromParent();o.geometry.dispose();});this.object.add(gltf.scene);this.model=gltf.scene;
      container.dataset.loaded='true';this.render(0);
    });
    this.resizeObserver=new ResizeObserver(()=>{const w=container.clientWidth,h=container.clientHeight;if(w&&h){this.renderer.setSize(w,h);this.camera.aspect=w/h;this.camera.fov=Math.max(34,THREE.MathUtils.radToDeg(2*Math.atan(Math.tan(THREE.MathUtils.degToRad(34)/2)/Math.min(1,w/h))));this.camera.updateProjectionMatrix();this.render(0);}});this.resizeObserver.observe(container);
    this.onKey=e=>{if(this.mode==='object'){if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.setTilt(this.tilt+(e.key==='ArrowLeft'?-.12:.12));this.onManipulate?.();}if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();e.shiftKey?this.setLift(this.lift+(e.key==='ArrowUp'?.1:-.1)):this.setDepthRotation(this.pitch+(e.key==='ArrowUp'?-.1:.1));this.onManipulate?.();}}if(e.key==='Home'){e.preventDefault();this.resetView();}};
    container.addEventListener('keydown',this.onKey);
  }
  setMode(mode){this.mode=mode;this.controls.enabled=mode==='orbit';}
  applyOrientation(){this.object.rotation.set(this.pitch,this.yaw,this.tilt,'YXZ');}
  setTilt(radians){this.tilt=radians;this.applyOrientation();}
  setDepthRotation(pitch,yaw=this.yaw){this.pitch=THREE.MathUtils.clamp(pitch,-1.2,1.2);this.yaw=yaw;this.applyOrientation();}
  get axisVertical(){return new THREE.Vector3(0,1,0).applyQuaternion(this.object.quaternion).y;}
  setLift(value){const old=this.lift;this.lift=THREE.MathUtils.clamp(value,-.45,.7);this.object.position.y=this.lift;if(this.flowing){const impulse=THREE.MathUtils.clamp((old-this.lift)*1.6,-.2,.2);const local=new THREE.Vector3(0,impulse,0).applyQuaternion(this.object.quaternion.clone().invert());for(let i=0;i<this.physics.v.length;i+=3){this.physics.v[i]+=local.x;this.physics.v[i+1]+=local.y;}}}
  flip(){this.flipFrom=this.tilt;this.flipTo=this.tilt+Math.PI;this.flipElapsed=0;this.flipYaw=this.yaw;}
  resetSand(){this.settledFor=0;this.physics.reset();for(let i=0;i<25;i++)this.physics.step(1/60,[0,0,0]);this.physics.v.fill(0);this.roles.reset();this.sand.reset();this.flipTo=null;this.pitch=.12;this.yaw=.32;this.setTilt(0);this.setLift(0);this.accumulator=0;this.sand.update(0,this.roles,true);this.physics.beginTransfer(1);this.onManipulate?.();}
  get readyToFlip(){return (this.settledFor??0)>=.75;}
  get canFlow(){return this.flipTo==null&&this.axisVertical*this.roles.inputSign>.08;}
  setProgress(p,flowing){this.progress=p;this.flowing=flowing;this.physics.setTransferProgress(p);}

  render(delta){if(this.disposed)return;this.controls.update();delta=Math.min(delta,.05);if(this.settleRemaining>0)this.settleRemaining=Math.max(0,this.settleRemaining-delta);
    if(this.flipTo!=null&&this.flowing){this.flipElapsed+=delta;const t=Math.min(1,this.flipElapsed/2.2),e=t*t*(3-2*t);this.yaw=this.flipYaw+Math.sin(Math.PI*e)*.38;this.setTilt(this.flipFrom+(this.flipTo-this.flipFrom)*e);this.onManipulate?.();if(t===1)this.flipTo=null;}
    if(this.flowing){this.accumulator+=delta*this.simulationSpeed;let steps=0;this.inverse.copy(this.object.quaternion).invert();this.gravity.set(0,-9.81,0).applyQuaternion(this.inverse);while(this.accumulator>=1/120&&steps<6){this.physics.step(1/120,[this.gravity.x,this.gravity.y,this.gravity.z]);this.accumulator-=1/120;steps++;}if(steps===6)this.accumulator=0;}
    this.settledFor=this.flowing&&this.canFlow&&this.physics.allSettled?(this.settledFor??0)+delta:0;
    const swapped=this.roles.update(Math.acos(THREE.MathUtils.clamp(this.axisVertical,-1,1)),delta);if(swapped){this.settledFor=0;this.physics.beginTransfer(this.roles.inputSign);this.onCycle?.();}this.sand.update(this.flowing?delta:0,this.roles);this.container.dataset.cycle=String(this.roles.cycle);this.container.dataset.inputChamber=this.roles.inputSign===1?'A':'B';this.container.dataset.lowerFraction=this.physics.lowerFraction.toFixed(3);this.container.dataset.transferred=String(this.physics.transferred);this.container.dataset.transferTotal=String(this.physics.transferTotal);this.container.dataset.refined=String(this.sand.refinement.filter(x=>x>.9).length);
    this.renderer.render(this.scene,this.camera);
  }

  resetView(){this.controls.reset();}
  release(root){root.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}
  dispose(){this.disposed=true;this.resizeObserver.disconnect();this.container.removeEventListener('keydown',this.onKey);this.controls.dispose();this.container.removeEventListener('pointerdown',this.onDown);this.container.removeEventListener('pointermove',this.onMove);this.container.removeEventListener('pointerup',this.onUp);this.container.removeEventListener('pointercancel',this.onUp);this.sand.dispose();this.release(this.scene);this.environment.dispose();this.renderer.dispose();this.renderer.domElement.remove();}
}

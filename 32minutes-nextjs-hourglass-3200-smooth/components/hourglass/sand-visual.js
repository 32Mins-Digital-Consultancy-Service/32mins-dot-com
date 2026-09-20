import * as THREE from 'three';
/** Small, lit 3D grains; one instanced sphere per physical particle. */
export class SandVisual extends THREE.Group {
 constructor(physics){
  super();this.physics=physics;this.displayPosition=new Float32Array(physics.p);this.refinement=new Float32Array(physics.count);
  this.seeds=Float32Array.from({length:physics.count},(_,i)=>((i*2654435761)>>>0)/4294967296);
  const geometry=new THREE.SphereGeometry(physics.r*.91,8,6);
  const material=new THREE.MeshStandardMaterial({color:0xffffff,metalness:.62,roughness:.34,envMapIntensity:1.15});
  this.grains=new THREE.InstancedMesh(geometry,material,physics.count);
  this.grains.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.grains.frustumCulled=false;
  this.add(this.grains);this.transform=new THREE.Matrix4();this.color=new THREE.Color();
  this.bronze=new THREE.Color('#88602d');this.gold=new THREE.Color('#edc46e');
 }
 reset(){this.refinement.fill(0);this.displayPosition.set(this.physics.p);}
 update(dt,roles){
  const p=this.physics.p;
  for(let i=0;i<this.physics.count;i++){
   const target=roles.targetRefinement(p[i*3+1]);
   if(target!==null)this.refinement[i]+=(target-this.refinement[i])*Math.min(1,dt*3);
   const k=i*3,blend=dt>0?1-Math.exp(-dt/0.035):1;
   for(let c=0;c<3;c++)this.displayPosition[k+c]+=(p[k+c]-this.displayPosition[k+c])*blend;
   this.transform.makeTranslation(this.displayPosition[k],this.displayPosition[k+1],this.displayPosition[k+2]);this.grains.setMatrixAt(i,this.transform);
   this.color.copy(this.bronze).lerp(this.gold,this.refinement[i]).multiplyScalar(.9+this.seeds[i]*.2);
   this.grains.setColorAt(i,this.color);
  }
  this.grains.instanceMatrix.needsUpdate=true;this.grains.instanceColor.needsUpdate=true;
 }
 dispose(){} // Geometry and material are released by the view's scene traversal.
}

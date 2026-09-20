import {radius} from './sand.js';
/** Position-based grain approximation. Local Y is the hourglass axis.
 *  Sphere contacts, wall constraints and transformed gravity; no rigid-body solver.
 */
export class GranularSand {
 constructor(count=2400,{radius:grainRadius=.029}={}){this.count=count;this.heightScale=.82;this.r=grainRadius;this.d=this.r*2;this.cell=this.d*1.05;this.p=new Float32Array(count*3);this.old=new Float32Array(count*3);this.v=new Float32Array(count*3);this.passed=new Uint8Array(count);this.admitted=new Uint8Array(count);this.pending=0;this.metering=false;this.contacts=new Uint8Array(count);this.next=new Int32Array(count);this.gridWidth=Math.ceil(1.8/this.cell)+4;this.gridHeight=Math.ceil(3/this.cell)+4;this.grid=new Int32Array(this.gridWidth*this.gridHeight*this.gridWidth);this.reset();}
 reset(){let n=0;const s=this.d*.98;for(let y=.16*this.heightScale;y<1.49*this.heightScale&&n<this.count;y+=s*.88){let row=Math.round(y/(s*.84));for(let x=-.67;x<=.67&&n<this.count;x+=s){for(let z=-.67;z<=.67&&n<this.count;z+=s){const xx=x+(row%2)*s*.5,zz=z+(row%2)*s*.5;if(Math.hypot(xx,zz)<this.wallRadius(y)-this.r-.025){const j=n++*3;this.p[j]=xx;this.p[j+1]=y;this.p[j+2]=zz;}}}}
 if(n<this.count)throw new Error('Particle reservoir capacity exceeded');this.v.fill(0);this.old.set(this.p);this.metering=false;}
 beginTransfer(sign=1){this.sourceSign=sign;this.admitted.fill(0);this.pending=0;this.transferred=0;this.transferTotal=0;this.transferLimit=0;this.metering=true;for(let i=0;i<this.count;i++){const source=this.p[i*3+1]*sign>=0;this.passed[i]=source?0:1;if(source)this.transferTotal++;}}
 setTransferProgress(progress){this.transferLimit=Math.min(this.transferTotal,Math.floor(Math.max(0,progress)*this.transferTotal));}
 // Reserve individual grains before they cross the outlet. The backlog cannot
 // suddenly escape as a burst when several collision projections cross the plane.
 admitGrains(dt){
  if(!this.metering)return;
  let slots=Math.min(Math.ceil(dt*120),this.transferLimit-this.transferred-this.pending);
  while(slots-->0){
   let best=-1,score=Infinity;
   for(let i=0;i<this.count;i++){
    if(this.passed[i]||this.admitted[i])continue;
    const k=i*3,y=this.p[k+1]*this.sourceSign;
    if(y>.16)continue;
    const distance=y+Math.hypot(this.p[k],this.p[k+2])*.25;
    if(distance<score){score=distance;best=i;}
   }
   if(best<0)break;
   this.admitted[best]=1;this.pending++;
  }
 }
 enforceMeter(i){
  if(!this.metering||this.passed[i])return;
  const k=i*3,side=this.p[k+1]*this.sourceSign;
  if(this.admitted[i]){
   if(side<0){this.passed[i]=1;this.transferred++;this.pending--;}
  }else if(side<this.r+.003){
   this.p[k+1]=this.sourceSign*(this.r+.003);this.v[k+1]=0;
  }
 }
 wallRadius(y){return radius(y/this.heightScale);}
 boundary(i){this.enforceMeter(i);const p=this.p,k=i*3;for(let pass=0;pass<2;pass++){p[k+1]=Math.max(-1.62*this.heightScale+this.r,Math.min(1.62*this.heightScale-this.r,p[k+1]));const y=p[k+1],r=Math.hypot(p[k],p[k+2]),allowed=Math.max(.003,this.wallRadius(y)-.02-this.r),over=r-allowed;
 if(over>0&&r>0){const slope=(this.wallRadius(y+.002)-this.wallRadius(y-.002))/.004;const scale=over/(1+slope*slope);p[k]-=p[k]/r*scale;p[k+2]-=p[k+2]/r*scale;p[k+1]+=slope*scale;}}
 // Final radial containment protects against large user-driven impulses at the neck.
 const r=Math.hypot(p[k],p[k+2]),a=Math.max(.003,this.wallRadius(p[k+1])-.02-this.r);if(r>a){p[k]*=a/r;p[k+2]*=a/r;}this.enforceMeter(i);}
 step(dt,gravity=[0,-9.81,0]){dt=Math.min(dt,1/60);const p=this.p,v=this.v;this.old.set(p);this.contacts.fill(0);this.admitGrains(dt);
 for(let i=0;i<this.count;i++){const k=i*3;for(let c=0;c<3;c++){v[k+c]=(v[k+c]+gravity[c]*dt)*Math.pow(.998,dt*60);p[k+c]+=v[k+c]*dt;}this.boundary(i);}
 const iterations=dt<=1/120?1:2;
 for(let iteration=0;iteration<iterations;iteration++){
  this.grid.fill(-1);const c=this.cell,w=this.gridWidth,h=this.gridHeight,ox=Math.floor(w/2),oy=Math.floor(h/2);
  for(let i=0;i<this.count;i++){const k=i*3,key=Math.floor(p[k]/c)+ox+w*(Math.floor(p[k+1]/c)+oy)+w*h*(Math.floor(p[k+2]/c)+ox);this.next[i]=this.grid[key];this.grid[key]=i;}
  for(let i=0;i<this.count;i++){const a=i*3,cx=Math.floor(p[a]/c)+ox,cy=Math.floor(p[a+1]/c)+oy,cz=Math.floor(p[a+2]/c)+ox;
   for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++){let j=this.grid[cx+x+w*(cy+y)+w*h*(cz+z)];while(j!==-1){if(j>i){const b=j*3,dx=p[b]-p[a],dy=p[b+1]-p[a+1],dz=p[b+2]-p[a+2],sq=dx*dx+dy*dy+dz*dz;if(iteration===iterations-1&&sq<this.d*this.d*1.8){this.contacts[i]++;this.contacts[j]++;}if(sq<this.d*this.d&&sq>1e-10){const len=Math.sqrt(sq),f=(this.d-len)/len*.46;p[a]-=dx*f;p[a+1]-=dy*f;p[a+2]-=dz*f;p[b]+=dx*f;p[b+1]+=dy*f;p[b+2]+=dz*f;}}j=this.next[j];}
   }
  }
  for(let i=0;i<this.count;i++)this.boundary(i);
 }
 // Dissipate contact energy while preserving gravity-driven free fall.
 const gLength=Math.hypot(...gravity),gx=gLength?gravity[0]/gLength:0,gy=gLength?gravity[1]/gLength:0,gz=gLength?gravity[2]/gLength:0;
 for(let i=0;i<this.count;i++){
  const k=i*3;
  for(let c=0;c<3;c++)v[k+c]=Math.max(-4,Math.min(4,(p[k+c]-this.old[k+c])/dt))*Math.pow(.92,dt*60);
  if(this.contacts[i]&&gLength){
   // Inelastic contact: remove upward bounce and damp sideways chatter,
   // retaining downward motion so friction cannot artificially plug the throat.
   const along=v[k]*gx+v[k+1]*gy+v[k+2]*gz,normal=along<0?along*.15:along;
   v[k]=(v[k]-along*gx)*.72+normal*gx;
   v[k+1]=(v[k+1]-along*gy)*.72+normal*gy;
   v[k+2]=(v[k+2]-along*gz)*.72+normal*gz;
  }
 }
 }
 get allSettled(){
  const sign=this.sourceSign??1;
  for(let i=0;i<this.count;i++){const k=i*3;if(this.p[k+1]*sign>-.25||Math.hypot(this.v[k],this.v[k+1],this.v[k+2])>.18)return false;}
  return true;
 }
 get lowerFraction(){let n=0;for(let i=1;i<this.p.length;i+=3)if(this.p[i]<0)n++;return n/this.count;}
}

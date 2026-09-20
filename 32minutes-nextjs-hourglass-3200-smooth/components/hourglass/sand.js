// The vessel and sand profiles match blender/create_hourglass.py (Y-up here).
const profile = [[0,.082],[.15,.102],[.4,.22],[.7,.46],[1,.64],[1.3,.71],[1.52,.71],[1.63,.62],[1.68,.001]];
export function radius(z) {
  z=Math.abs(z);
  for(let i=0;i<profile.length-1;i++) {
    const [a,r]=profile[i], [b,s]=profile[i+1];
    if(z<=b) { const t=Math.max(0,(z-a)/(b-a)), prev=profile[Math.max(0,i-1)], next=profile[Math.min(profile.length-1,i+2)], m0=(s-prev[1])/(b-prev[0]), m1=(next[1]-r)/(next[0]-a);
      return Math.max(.001,(2*t**3-3*t*t+1)*r+(t**3-2*t*t+t)*(b-a)*m0+(-2*t**3+3*t*t)*s+(t**3-t*t)*(b-a)*m1); }
  } return .001;
}
const inside=z=>Math.max(.0001,radius(z)-.028), dz=1.64/240;
const upperR=Array.from({length:240},(_,i)=>inside((i+.5)*dz));
const lowerR=Array.from({length:240},(_,i)=>inside(-1.64+(i+.5)*dz));
export const TOTAL=upperR.slice(0,190).reduce((v,r)=>v+Math.PI*r*r*dz,0);
export function volume(h,upper) {
  let v=0;
  for(let i=0;i<240;i++) {const z=upper?(i+.5)*dz:-1.64+(i+.5)*dz;const r=upper?(z<=h?upperR[i]:0):Math.min(lowerR[i],Math.max(0,(h-z)/.5));v+=Math.PI*r*r*dz;}
  return v;
}
export function height(amount,upper) {
  let lo=upper?0:-1.64,hi=upper?1.64:0;
  for(let i=0;i<27;i++){const mid=(lo+hi)/2;if(volume(mid,upper)<TOTAL*amount)lo=mid;else hi=mid;}
  return (lo+hi)/2;
}
const levels=Array.from({length:257},(_,i)=>[height(i/256,true),height(i/256,false)]);
function level(amount,upper) {const x=Math.max(0,Math.min(1,amount))*256,i=Math.min(255,Math.floor(x));return levels[i][upper?0:1]*(1-(x-i))+levels[i+1][upper?0:1]*(x-i);}
export function sandProfile(progress,upper) {
  const amount=upper?1-progress:progress,h=level(amount,upper),out=[];
  if(upper) {
    for(let i=0;i<=48;i++){const y=Math.max(.0001,h)*i/48;out.push([amount>0?inside(y):.0001,y]);}
    const R=inside(h);
    for(let i=1;i<=16;i++){const r=R*(1-i/16);out.push([Math.max(.0001,r),h-Math.min(.05,h*.2)*Math.exp(-r*r/.018)]);}
  }else for(let i=0;i<=64;i++){const y=-1.64+(h+1.64)*i/64;out.push([Math.max(.0001,Math.min(inside(y),(h-y)/.5)),y]);}
  return {points:out,height:h};
}

/** A stable flip swaps roles. Camera orbit never enters this state machine. */
export class Transformation {
 constructor(){this.reset();}
 reset(){this.inputSign=1;this.cycle=1;this.candidate=1;this.stableFor=0;this.previousTilt=0;}
 update(tilt,dt){if(dt<=0)return false;const speed=Math.abs(tilt-this.previousTilt)/dt;this.previousTilt=tilt;const c=Math.cos(tilt),candidate=c>.2?1:c<-.2?-1:0;
 if(!candidate||candidate===this.inputSign||speed>.65){this.stableFor=0;this.candidate=candidate;return false;}
 if(candidate!==this.candidate){this.candidate=candidate;this.stableFor=0;}
 this.stableFor+=dt;if(this.stableFor<.3)return false;this.inputSign=candidate;this.cycle++;this.stableFor=0;return true;
 }
 targetRefinement(y){return y*this.inputSign<-.035?1:y*this.inputSign>.035?0:null;}
}

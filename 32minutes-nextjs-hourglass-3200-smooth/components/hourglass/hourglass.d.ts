export class HourglassView {
  constructor(container: HTMLElement, options?: {assetURL?: string});
  ready: Promise<void>;
  canFlow: boolean;
  readyToFlip: boolean;
  roles: {cycle:number;inputSign:number};
  onCycle?: () => void;
  onManipulate?: () => void;
  setProgress(progress:number,running:boolean):void;
  setTilt(radians:number):void;
  setLift(height:number):void;
  setDepthRotation(pitch:number,yaw?:number):void;
  setMode(mode:'object'|'orbit'):void;
  resetSand():void;
  resetView():void;
  flip():void;
  render(deltaSeconds:number):void;
  dispose():void;
}

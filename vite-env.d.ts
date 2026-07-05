export type Position = 'QB'|'RB'|'WR'|'TE'|'K'|'DST';
export interface Player { id:string; name:string; position:Position; team:string; rank:number; tier:number; adp:number; }
export interface Pick { overall:number; round:number; team:number; playerId:string; }
export interface Settings { teams:number; rounds:number; mySlot:number; roster:Record<Position,number>; }
export interface Recommendation { player:Player; partner?:Player; score:number; survival:number; reasons:string[]; likelyGone:Player[]; path:string; }
export interface DraftState { picks:Pick[]; settings:Settings; players:Player[]; teamNames:string[]; }

import type { Pick, Player, Position, Settings } from './types';

export const pickTeam=(overall:number,teams:number)=>{const r=Math.ceil(overall/teams),x=(overall-1)%teams;return r%2?x+1:teams-x};
export const pickRound=(overall:number,teams:number)=>Math.ceil(overall/teams);
export const nextTurns=(after:number,slot:number,teams:number,count=4)=>{const out:number[]=[];for(let p=after+1;out.length<count;p++)if(pickTeam(p,teams)===slot)out.push(p);return out};
export const rosterFor=(picks:Pick[],team:number,players:Player[])=>picks.filter(p=>p.team===team).map(p=>players.find(x=>x.id===p.playerId)).filter(Boolean) as Player[];
export const positionCounts=(roster:Player[])=>roster.reduce((a,p)=>(a[p.position]++,a),{QB:0,RB:0,WR:0,TE:0,K:0,DST:0} as Record<Position,number>);
export const maxFall=(p:Player)=>p.rank<=12?2:p.rank<=30?4:p.rank<=60?7:10;
export const snakeLabel=(overall:number,teams:number)=>`${pickRound(overall,teams)}.${String(((overall-1)%teams)+1).padStart(2,'0')}`;
export const isDraftComplete=(picks:Pick[],s:Settings)=>picks.length>=s.teams*s.rounds;

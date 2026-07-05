import type { DraftState, Player, Position, Recommendation } from './types';
import { maxFall, nextTurns, positionCounts, rosterFor } from './draft';

const replacement:Record<Position,number>={QB:92,RB:150,WR:170,TE:105,K:210,DST:210};
const value=(p:Player,available:Player[])=>Math.max(0,(replacement[p.position]-(available.filter(x=>x.position===p.position).findIndex(x=>x.id===p.id)+p.rank))*.18);
const survival=(p:Player,target:number,current:number)=>{const distance=target-current;const edge=p.adp+maxFall(p)-target;let chance=1/(1+Math.exp(-(edge)/2.4));if(p.position==='RB'&&p.rank<=36)chance*=.72;if(distance>28)chance*=.8;return Math.max(.02,Math.min(.98,chance));};

export function recommendations(state:DraftState):Recommendation[]{
 const current=state.picks.length+1, available=state.players.filter(p=>!state.picks.some(x=>x.playerId===p.id)).sort((a,b)=>a.rank-b.rank);
 const roster=rosterFor(state.picks,state.settings.mySlot,state.players),counts=positionCounts(roster),turns=nextTurns(current-1,state.settings.mySlot,state.settings.teams,4),next=turns.find(x=>x>current)??current+state.settings.teams;
 const recent=state.picks.slice(-6).map(x=>state.players.find(p=>p.id===x.playerId)?.position).filter(Boolean) as Position[];
 const run=(pos:Position)=>recent.filter(x=>x===pos).length;
 const candidates=available.slice(0,45).map(player=>{
   const remaining=available.filter(x=>x.id!==player.id); const partnerPool=remaining.filter(p=>survival(p,next,current)>.18).slice(0,30);
   const partner=partnerPool.sort((a,b)=>(value(b,remaining)*survival(b,next,current))-(value(a,remaining)*survival(a,next,current)))[0];
   const wait=1-survival(player,next,current); const tierLeft=available.filter(p=>p.position===player.position&&p.tier===player.tier).length;
   let fit=(player.position==='RB'||player.position==='WR')?8:3;
   if(player.position==='QB'&&counts.QB>=1)fit=current>state.settings.teams*9?0:-22;
   if(player.position==='TE'&&counts.TE>=1)fit=current>state.settings.teams*9?0:-18;
   if((player.position==='K'||player.position==='DST')&&current<=state.settings.teams*(state.settings.rounds-3))fit=-60;
   const scarcity=(run(player.position)*1.8)+(tierLeft<=2?7:0); const now=value(player,available)+(50-player.rank*.32)+fit+scarcity; const future=partner?value(partner,remaining)*survival(partner,next,current):0; const score=now+future+wait*10;
   const gone=available.filter(p=>p.id!==player.id&&survival(p,next,current)<.25).slice(0,3);
   const reasons=[`${Math.round(wait*100)}% wait risk at ${player.position}`,tierLeft<=2?`Tier cliff: only ${tierLeft} left in Tier ${player.tier}`:`Preserves a realistic ${partner?.position??'depth'} option`,fit>=8?'Builds high-leverage RB/WR depth':'Balances current value and roster fit'];
   return {player,partner,score,survival:survival(player,next,current),reasons,likelyGone:gone,path:`${player.position} now → ${partner?.position??'best value'} next`};
 }).sort((a,b)=>b.score-a.score);
 const unique:Recommendation[]=[]; for(const r of candidates){if(!unique.some(x=>x.player.id===r.player.id||x.path===r.path))unique.push(r);if(unique.length===3)break} return unique;
}

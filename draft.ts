import source from './original-players.json';
import type { Player, Position } from './types';

type OriginalPlayer={id:string;name:string;team:string;pos:Position;rank:number;tier:number;adp?:number;dntExpectedPick?:number};

// The 260-player board recovered from the supplied split project. Keeping the
// adapter here isolates the old data shape from the new application model.
export const starterPlayers:Player[]=(source as OriginalPlayer[]).map(p=>({
  id:p.id,name:p.name,team:p.team,position:p.pos,rank:p.rank,tier:p.tier,
  adp:p.dntExpectedPick??p.adp??p.rank
}));

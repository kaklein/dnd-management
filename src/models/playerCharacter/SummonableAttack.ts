import { DamageType } from "@models/enum/DamageType";

export interface SummonableAttack {
  id: string;
  name: string;
  damage?: string;
  damageType?: DamageType;
  description: string;
}
import { Bird } from "../../Bird/Bird";

export interface ISkill {
  name: string;
  key: string;
  requiredPoints: number;
  duration: number;
  isReady: boolean;
  isActive: boolean;
  
  activate(bird: Bird): void;
  deactivate(bird: Bird): void;
  update(bird: Bird): void;
} 
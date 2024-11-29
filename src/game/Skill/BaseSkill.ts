import { ISkill } from "./models/ISkill";
import { Bird } from "../Bird/Bird";

export abstract class BaseSkill implements ISkill {
  public name: string;
  public key: string;
  public requiredPoints: number;
  public duration: number;
  public isReady: boolean = false;
  public isActive: boolean = false;
  protected scene: Phaser.Scene;
  protected remainingTime: number = 0;

  constructor(scene: Phaser.Scene, config: {
    name: string;
    key: string;
    requiredPoints: number;
    duration: number;
  }) {
    this.scene = scene;
    this.name = config.name;
    this.key = config.key;
    this.requiredPoints = config.requiredPoints;
    this.duration = config.duration;
  }

  public startDurationTimer(onTick: (remainingTime: number) => void) {
    this.remainingTime = this.duration;
    this.scene.time.addEvent({
      delay: 16,
      callback: () => {
        this.remainingTime -= 16;
        onTick(this.remainingTime);
      },
      repeat: this.duration / 16
    });
  }

  abstract activate(bird: Bird): void;
  abstract deactivate(bird: Bird): void;
  abstract update(bird: Bird): void;
} 
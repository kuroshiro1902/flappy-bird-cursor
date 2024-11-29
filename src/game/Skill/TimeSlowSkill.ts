import { Bird } from "../Bird/Bird";
import { BaseSkill } from "./BaseSkill";

export class TimeSlowSkill extends BaseSkill {
  private slowFactor: number;

  constructor(scene: Phaser.Scene) {
    super(scene, {
      name: 'Time Slow',
      key: 'T',
      requiredPoints: 8,
      duration: 2000
    });
    this.slowFactor = 0.5;
  }

  activate(bird: Bird): void {
    this.isActive = true;
    this.scene.physics.world.timeScale = this.slowFactor;
    
    this.scene.time.delayedCall(this.duration, () => {
      this.deactivate(bird);
    });
  }

  deactivate(bird: Bird): void {
    this.isActive = false;
    this.scene.physics.world.timeScale = 1;
  }

  update(bird: Bird): void {
    // Additional update logic if needed
  }
} 
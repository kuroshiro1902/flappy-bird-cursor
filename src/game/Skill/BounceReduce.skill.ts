import { BaseSkill } from "./BaseSkill";
import { Bird } from "../Bird/Bird";
import { GameConfig } from "@/config/GameConfig";

export class BounceReduceSkill extends BaseSkill {
  private originalVelocity: number;
  private reducedVelocity: number = GameConfig.BIRD.JUMP_SPEED * 0.75;

  constructor(scene: Phaser.Scene) {
    super(scene, {
      name: 'Bounce',
      key: 'W',
      requiredPoints: 7,
      duration: 6000
    });
    this.originalVelocity = GameConfig.BIRD.JUMP_SPEED;
  }

  activate(bird: Bird): void {
    if (!bird.sprite.body) return;

    this.isActive = true;
    // Thay đổi jump speed của bird
    GameConfig.BIRD.JUMP_SPEED = this.reducedVelocity;
    bird.sprite.setTint(0x00ff99);

    this.scene.time.delayedCall(this.duration, () => {
      this.deactivate(bird);
    });
  }

  deactivate(bird: Bird): void {
    if (!bird.sprite.body) return;

    this.isActive = false;
    // Khôi phục jump speed
    GameConfig.BIRD.JUMP_SPEED = this.originalVelocity;
    bird.sprite.clearTint();
  }

  update(bird: Bird): void {}
} 
import { GameConfig } from "@/config/GameConfig";
import { Bird } from "../Bird/Bird";
import { BaseSkill } from "./BaseSkill";

export class DashSkill extends BaseSkill {
  private dashDistance: number;

  constructor(scene: Phaser.Scene) {
    super(scene, {
      name: 'Dash',
      key: 'D',
      requiredPoints: 5,
      duration: 275
    });
    this.dashDistance = 175;
  }

  activate(bird: Bird): void {
    if (!bird.sprite.body) return;

    this.isActive = true;
    const body = bird.sprite.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(0);
    body.setVelocityY(0);
    body.setVelocityX(this.dashDistance);

    this.scene.time.delayedCall(this.duration, () => {
      this.deactivate(bird);
    });
  }

  deactivate(bird: Bird): void {
    if (!bird.sprite.body) return;

    this.isActive = false;
    const body = bird.sprite.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(GameConfig.BIRD.GRAVITY);
    body.setVelocityX(0);
  }

  update(bird: Bird): void {
    if (this.isActive) {
      bird.sprite.angle = 0;
    }
  }
} 
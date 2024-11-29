import { BaseSkill } from "./BaseSkill";
import { Bird } from "../Bird/Bird";
import { GameConfig } from "../../config/GameConfig";

export class GravityReverseSkill extends BaseSkill {
  constructor(scene: Phaser.Scene) {
    super(scene, {
      name: 'Reverse',
      key: 'R',
      requiredPoints: 7,
      duration: 2000
    });
  }

  activate(bird: Bird): void {
    if (!bird.sprite.body) return;

    this.isActive = true;
    const body = bird.sprite.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(-GameConfig.BIRD.GRAVITY);  // Đảo ngược trọng lực
    bird.sprite.setFlipY(true);  // Lật ngược bird

    this.scene.time.delayedCall(this.duration, () => {
      this.deactivate(bird);
    });
  }

  deactivate(bird: Bird): void {
    if (!bird.sprite.body) return;
    
    this.isActive = false;
    const body = bird.sprite.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(GameConfig.BIRD.GRAVITY);
    bird.sprite.setFlipY(false);
  }

  update(bird: Bird): void {}
}
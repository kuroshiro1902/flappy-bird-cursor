import { BaseSkill } from "./BaseSkill";
import { Bird } from "../Bird/Bird";

export class GhostSkill extends BaseSkill {
  constructor(scene: Phaser.Scene) {
    super(scene, {
      name: 'Ghost',
      key: 'Q',
      requiredPoints: 10,
      duration: 1500
    });
  }

  activate(bird: Bird): void {
    if (!bird.sprite.body) return;

    this.isActive = true;
    bird.sprite.alpha = 0.5;
    
    // Sửa lại cách truy cập body
    const body = bird.sprite.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = true;

    this.scene.time.delayedCall(this.duration, () => {
      this.deactivate(bird);
    });
  }

  deactivate(bird: Bird): void {
    if (!bird.sprite.body) return;

    this.isActive = false;
    bird.sprite.alpha = 1;
    
    // Sửa lại cách truy cập body
    const body = bird.sprite.body as Phaser.Physics.Arcade.Body;
    body.checkCollision.none = false;
  }

  update(bird: Bird): void {}
}
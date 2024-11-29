import { GameConfig } from '../config/GameConfig';

export class Bird {
  public sprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, 'bird');
    this.sprite.setGravityY(GameConfig.BIRD.GRAVITY);
  }

  public update(isDashing: boolean) {
    if (!isDashing) {
      this.sprite.angle = Phaser.Math.Clamp(
        (this.sprite.body?.velocity.y ?? 0) * GameConfig.BIRD.ROTATION_FACTOR,
        GameConfig.BIRD.MIN_ANGLE,
        GameConfig.BIRD.MAX_ANGLE
      );
    } else {
      this.sprite.angle = 0;
    }
  }

  public jump(isDashing: boolean) {
    if (!isDashing) {
      this.sprite.setVelocityY(GameConfig.BIRD.JUMP_SPEED);
    }
  }
} 
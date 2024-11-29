import { GameConfig } from "@/config/GameConfig";
import { Bird } from "./Bird";

export class SkillManager {
  private scene: Phaser.Scene;
  private bird: Bird;
  private ragePoints: number = 0;
  private hasSkill: boolean = false;
  private rageText!: Phaser.GameObjects.Text;
  private skillText!: Phaser.GameObjects.Text;
  private isDashing: boolean = false;

  constructor(scene: Phaser.Scene, bird: Bird) {
    this.scene = scene;
    this.bird = bird;
    this.setupUI();
    this.setupInput();
  }

  private setupUI() {
    // Hiển thị trạng thái skill
    this.skillText = this.scene.add.text(
      GameConfig.WIDTH - 100, 
      16, 
      `Skill: ${this.hasSkill ? 'Ready' : 'Not Ready'}`
    );
    
    // Hiển thị điểm nộ hiện tại
    this.rageText = this.scene.add.text(
      GameConfig.WIDTH - 100, 
      48, 
      `Rage: ${this.ragePoints}/${GameConfig.SKILL.RAGE_REQUIRED}`
    );
  }

  private setupInput() {
    // Sử dụng key object thay vì event
    const dashKey = this.scene.input.keyboard?.addKey(GameConfig.SKILL.KEY);
    dashKey?.on('down', () => {
      console.log('Key pressed, hasSkill:', this.hasSkill, 'isDashing:', this.isDashing);
      this.tryActivateDash();
    });
  }

  private tryActivateDash() {
    if (this.hasSkill && !this.isDashing) {
      console.log('Activating dash');
      this.activateDash();
    }
  }

  private activateDash() {
    if (!this.bird.sprite.body) return;  // Kiểm tra body tồn tại

    this.isDashing = true;
    this.hasSkill = false;
    this.updateUI();

    console.log('DASH!');
    
    // Lưu vị trí hiện tại
    const startX = this.bird.sprite.x;
    const currentY = this.bird.sprite.y;

    // Tắt gravity và đặt vận tốc
    const body = this.bird.sprite.body as Phaser.Physics.Arcade.Body;
    body.setGravityY(0);
    body.setVelocityY(0);
    body.setVelocityX(GameConfig.SKILL.DASH_DISTANCE);

    // Sử dụng timer thay vì tween
    this.scene.time.delayedCall(GameConfig.SKILL.DASH_DURATION, () => {
      if (!this.bird.sprite.body) return;
      
      console.log('Dash end');
      const body = this.bird.sprite.body as Phaser.Physics.Arcade.Body;
      body.setGravityY(GameConfig.BIRD.GRAVITY);
      body.setVelocityX(0);
      this.isDashing = false;
    });
  }

  public addRagePoint() {
    if (this.hasSkill) return;

    this.ragePoints++;
    console.log('Rage points:', this.ragePoints);
    
    if (this.ragePoints >= GameConfig.SKILL.RAGE_REQUIRED) {
      this.ragePoints = 0;
      this.hasSkill = true;
      console.log('Skill ready!');
      this.updateUI();
    }
    this.updateUI();
  }

  private updateUI() {
    this.skillText.setText(`Skill: ${this.hasSkill ? 'Ready' : 'Not Ready'}`);
    this.rageText.setText(`Rage: ${this.ragePoints}/${GameConfig.SKILL.RAGE_REQUIRED}`);
  }

  public isDashActive() {
    return this.isDashing;
  }
}
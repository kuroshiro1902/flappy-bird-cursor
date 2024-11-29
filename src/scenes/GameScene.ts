import { GameConfig } from '../config/GameConfig';
import { Bird } from '../game/Bird';
import { PipeManager } from '../game/PipeManager';
import { ScoreManager } from '../game/ScoreManager';
import { SkillManager } from '../game/SkillManager';

export class GameScene extends Phaser.Scene {
  private bird!: Bird;
  private pipeManager!: PipeManager;
  private scoreManager!: ScoreManager;
  private skillManager!: SkillManager;
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('bird', '/assets/bird.png');
    this.load.image('pipe', '/assets/pipe.png');
    this.load.image('background', '/assets/background.png');
  }

  create() {
    // Add background
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(GameConfig.WIDTH, GameConfig.HEIGHT);

    // Khởi tạo theo thứ tự mới
    this.bird = new Bird(this, GameConfig.BIRD.X_POSITION, GameConfig.HEIGHT / 2);
    this.skillManager = new SkillManager(this, this.bird);
    this.scoreManager = new ScoreManager(this, this.skillManager);
    this.pipeManager = new PipeManager(this, this.scoreManager, this.bird);

    // Setup collisions
    this.physics.add.collider(
      this.bird.sprite,
      this.pipeManager.getPipes(),
      this.gameOverHandler,
      undefined,
      this
    );

    // Setup input
    this.setupInput();
  }

  update() {
    if (this.gameOver) return;

    this.bird.update(this.skillManager.isDashActive());

    if (this.bird.sprite.y < 0 || this.bird.sprite.y > GameConfig.HEIGHT) {
      this.gameOverHandler();
    }
  }

  private setupInput() {
    this.input.on('pointerdown', () => this.handleInput());
    this.input.keyboard?.on('keydown-SPACE', () => this.handleInput());
  }

  private handleInput() {
    if (this.gameOver) {
      this.scene.restart();
      this.gameOver = false;
      return;
    }
    this.bird.jump(this.skillManager.isDashActive());
  }

  private gameOverHandler() {
    this.gameOver = true;
    this.pipeManager.stop();

    this.add.text(
      GameConfig.WIDTH / 2,
      GameConfig.HEIGHT / 2,
      GameConfig.GAME_OVER.TEXT,
      {
        fontSize: GameConfig.GAME_OVER.FONT_SIZE,
        color: GameConfig.GAME_OVER.COLOR,
        align: 'center'
      }
    ).setOrigin(0.5);
  }
} 
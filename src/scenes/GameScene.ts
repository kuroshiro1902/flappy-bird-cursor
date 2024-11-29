import { GameConfig } from '../config/GameConfig';
import { Bird } from '../game/Bird/Bird';
import { PipeManager } from '../game/Pipe/PipeManager';
import { ScoreManager } from '../game/ScoreManager';
import { SkillManager } from '../game/Skill/SkillManager';

export class GameScene extends Phaser.Scene {
  private bird!: Bird;
  private pipeManager!: PipeManager;
  private scoreManager!: ScoreManager;
  private skillManager!: SkillManager;
  private gameOver: boolean = false;
  private isPaused: boolean = false;
  private pauseOverlay!: Phaser.GameObjects.Container;

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

    // Setup pause input
    this.input.keyboard?.addKey('ESC').on('down', () => {
      this.togglePause();
    });

    // Tạo pause overlay (ẩn ban đầu)
    this.createPauseOverlay();
  }

  private createPauseOverlay() {
    this.pauseOverlay = this.add.container(0, 0);
    
    // Background mờ
    const bg = this.add.rectangle(
      0, 0, 
      GameConfig.WIDTH, 
      GameConfig.HEIGHT, 
      0x000000, 0.7
    );
    bg.setOrigin(0, 0);

    // Title
    const title = this.add.text(
      GameConfig.WIDTH / 2,
      50,
      'PAUSED',
      {
        fontSize: '48px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    ).setOrigin(0.5);

    // Instruction
    const instruction = this.add.text(
      GameConfig.WIDTH / 2,
      100,
      'Press ESC to resume',
      {
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(0.5);

    this.pauseOverlay.add([bg, title, instruction]);
    this.pauseOverlay.setVisible(false);
  }

  private togglePause() {
    this.isPaused = !this.isPaused;
    
    if (this.isPaused) {
      // Pause game
      this.physics.pause();
      this.pauseOverlay.setVisible(true);
      // Hiển thị skill list trong pause menu
      this.skillManager.showSkillList(this.pauseOverlay);
    } else {
      // Resume game
      this.physics.resume();
      this.pauseOverlay.setVisible(false);
      // Ẩn skill list
      this.skillManager.hideSkillList();
    }
  }

  update() {
    if (this.isPaused) return;

    if (this.gameOver) return;

    // Cập nhật skill manager
    this.skillManager.update();
    
    // Kiểm tra dash skill
    this.bird.update(this.skillManager.isSkillActive('Dash'));

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
    this.bird.jump(this.skillManager.isSkillActive('Dash'));
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
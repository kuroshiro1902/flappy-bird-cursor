import { Scene } from 'phaser';
import { GameConfig } from '../config/GameConfig';

export class GameScene extends Scene {
  private bird!: Phaser.Physics.Arcade.Sprite;
  private pipes!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameOver: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load assets
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
    this.load.image('background', 'assets/background.png');
  }

  create() {
    // Add background và cho phép kéo giãn để lấp đầy màn hình
    this.add.image(0, 0, 'background')
      .setOrigin(0, 0)
      .setDisplaySize(GameConfig.WIDTH, GameConfig.HEIGHT);

    // Create bird với kích thước thực
    this.bird = this.physics.add.sprite(
      GameConfig.BIRD.X_POSITION,
      GameConfig.HEIGHT / 2,
      'bird'
    );
    this.bird.setGravityY(GameConfig.BIRD.GRAVITY);

    // Create pipes group
    this.pipes = this.physics.add.group();

    // Add collision between bird and pipes
    this.physics.add.collider(this.bird, this.pipes, this.gameOverHandler, undefined, this);

    // Add score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#fff'
    });

    // Add input handler
    this.input.on('pointerdown', this.jump, this);
    this.input.keyboard?.on('keydown-SPACE', this.jump, this);

    // Start spawning pipes
    this.time.addEvent({
      delay: GameConfig.PIPE.SPAWN_TIME,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true
    });
  }

  update() {
    if (this.gameOver) {
      return;
    }

    // Check if bird is out of bounds
    if (this.bird.y < 0 || this.bird.y > GameConfig.HEIGHT) {
      this.gameOverHandler();
    }

    // Rotate bird based on velocity
    this.bird.angle = Phaser.Math.Clamp(
      (this.bird.body?.velocity.y ?? 0) * 0.1,
      -30,
      30
    );
  }

  private jump() {
    if (this.gameOver) {
      this.scene.restart();
      this.gameOver = false;
      this.score = 0;
      return;
    }

    this.bird.setVelocityY(GameConfig.BIRD.JUMP_SPEED);
  }

  private spawnPipes() {
    if (this.gameOver) return;

    const pipeGap = GameConfig.PIPE.GAP;
    const pipeVerticalPosition = Phaser.Math.Between(100, GameConfig.HEIGHT - 100 - pipeGap);

    // Create top pipe
    const topPipe = this.pipes.create(
      GameConfig.WIDTH,
      pipeVerticalPosition,
      'pipe'
    ) as Phaser.Physics.Arcade.Sprite;
    topPipe
      .setFlipY(true)
      .setOrigin(0.5, 1);
    
    // Create bottom pipe
    const bottomPipe = this.pipes.create(
      GameConfig.WIDTH,
      pipeVerticalPosition + pipeGap,
      'pipe'
    ) as Phaser.Physics.Arcade.Sprite;
    bottomPipe.setOrigin(0.5, 0);

    // Set pipe properties
    [topPipe, bottomPipe].forEach(pipe => {
      pipe.setImmovable(true);
      pipe.setVelocityX(GameConfig.PIPE.SPEED);
      (pipe.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    });

    // Add score trigger
    const scoreTrigger = this.add.rectangle(
      GameConfig.WIDTH,                      // Vị trí X ban đầu
      pipeVerticalPosition + pipeGap/2,      // Giữa khoảng trống
      2,                                     // Chiều rộng trigger
      pipeGap - 10,                         // Chiều cao trigger
      // 0xff0000,                             // Màu đỏ (debug)
      // 0.5                                   // Độ trong suốt (debug)
    );

    // Enable physics cho trigger
    this.physics.add.existing(scoreTrigger);  // Bỏ true để không phải static body
    
    // Set properties cho trigger body
    const triggerBody = scoreTrigger.body as Phaser.Physics.Arcade.Body;
    triggerBody.allowGravity = false;
    triggerBody.velocity.x = GameConfig.PIPE.SPEED;

    // Overlap callback
    this.physics.add.overlap(this.bird, scoreTrigger, () => {
      if (!scoreTrigger.getData('scored')) {
        this.score += 1;
        this.scoreText.setText(`Score: ${this.score}`);
        scoreTrigger.setData('scored', true);
        scoreTrigger.destroy();
      }
    });

    // Auto destroy khi ra khỏi màn hình
    this.time.delayedCall(5000, () => {
      if (scoreTrigger) {
        scoreTrigger.destroy();
      }
    });
  }

  private gameOverHandler() {
    this.gameOver = true;
    this.pipes.setVelocityX(0);
    
    // Dừng tất cả các score triggers
    this.physics.world.bodies.getArray()
      .filter(body => body.gameObject instanceof Phaser.GameObjects.Rectangle)
      .forEach(body => {
        body.velocity.x = 0;
      });

    this.add.text(GameConfig.WIDTH / 2, GameConfig.HEIGHT / 2, 'Game Over\nClick to restart', {
      fontSize: '48px',
      color: '#fff',
      align: 'center'
    }).setOrigin(0.5);
  }
} 
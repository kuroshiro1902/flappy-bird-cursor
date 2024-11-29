import { GameConfig } from '../config/GameConfig';
import { ScoreManager } from './ScoreManager';
import { Bird } from './Bird';

export class PipeManager {
  private scene: Phaser.Scene;
  private pipes: Phaser.Physics.Arcade.Group;
  private scoreManager: ScoreManager;
  private spawnTimer!: Phaser.Time.TimerEvent;
  private bird: Bird;

  constructor(scene: Phaser.Scene, scoreManager: ScoreManager, bird: Bird) {
    this.scene = scene;
    this.scoreManager = scoreManager;
    this.bird = bird;
    this.pipes = scene.physics.add.group();
    this.setupPipeSpawning();
  }

  public stop() {
    this.pipes.setVelocityX(0);
    this.spawnTimer.destroy();
  }

  private setupPipeSpawning() {
    this.spawnTimer = this.scene.time.addEvent({
      delay: GameConfig.PIPE.SPAWN_TIME,
      callback: this.spawnPipes,
      callbackScope: this,
      loop: true
    });
  }

  private spawnPipes() {
    const pipeGap = GameConfig.PIPE.GAP;
    const pipeVerticalPosition = Phaser.Math.Between(
      GameConfig.PIPE.MIN_Y,
      GameConfig.HEIGHT - GameConfig.PIPE.MARGIN_BOTTOM - pipeGap
    );

    // Create pipes
    const topPipe = this.createPipe(pipeVerticalPosition, true);
    const bottomPipe = this.createPipe(pipeVerticalPosition + pipeGap, false);
    
    // Create score trigger
    const scoreTrigger = this.scene.add.rectangle(
      GameConfig.WIDTH,
      pipeVerticalPosition + pipeGap/2,
      GameConfig.SCORE.TRIGGER_WIDTH,
      pipeGap - GameConfig.SCORE.TRIGGER_PADDING,
      // 0xff0000,
      // 0.5
    );

    this.scene.physics.add.existing(scoreTrigger);
    const triggerBody = scoreTrigger.body as Phaser.Physics.Arcade.Body;
    triggerBody.allowGravity = false;
    triggerBody.velocity.x = GameConfig.PIPE.SPEED;

    this.scene.physics.add.overlap(
      this.bird.sprite,
      scoreTrigger,
      () => this.handleScoreTrigger(scoreTrigger)
    );

    this.scene.time.delayedCall(GameConfig.PIPE.DESTROY_DELAY, () => {
      scoreTrigger.destroy();
    });
  }

  private createPipe(y: number, isTop: boolean) {
    const pipe = this.pipes.create(
      GameConfig.WIDTH,
      y,
      'pipe'
    ) as Phaser.Physics.Arcade.Sprite;

    if (isTop) {
      pipe.setFlipY(true).setOrigin(0.5, 1);
    } else {
      pipe.setOrigin(0.5, 0);
    }

    pipe.setImmovable(true);
    pipe.setVelocityX(GameConfig.PIPE.SPEED);
    (pipe.body as Phaser.Physics.Arcade.Body).allowGravity = false;

    return pipe;
  }

  private handleScoreTrigger(trigger: Phaser.GameObjects.Rectangle) {
    if (!trigger.getData('scored')) {
      this.scoreManager.addScore();
      trigger.setData('scored', true);
      trigger.destroy();
    }
  }

  public getPipes() {
    return this.pipes;
  }
} 
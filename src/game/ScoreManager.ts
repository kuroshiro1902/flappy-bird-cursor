import { GameConfig } from "@/config/GameConfig";
import { SkillManager } from "./Skill/SkillManager";

export class ScoreManager {
  private score: number = 0;
  private scoreText: Phaser.GameObjects.Text;
  private skillManager: SkillManager;

  constructor(scene: Phaser.Scene, skillManager: SkillManager) {
    this.skillManager = skillManager;
    this.scoreText = scene.add.text(
      GameConfig.SCORE.X,
      GameConfig.SCORE.Y,
      'Score: 0',
      {
        fontSize: GameConfig.SCORE.FONT_SIZE,
        color: GameConfig.SCORE.COLOR
      }
    );
  }

  public addScore() {
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
    this.skillManager.addRagePoint();
  }

  public getScore() {
    return this.score;
  }

  public reset() {
    this.score = 0;
    this.scoreText.setText('Score: 0');
  }
} 
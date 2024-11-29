import { GameConfig } from "@/config/GameConfig";
import { ISkill } from "./models/ISkill";

/**
 * SkillUIManager là class chuyên quản lý phần giao diện (UI) của các skill, giúp người chơi biết:
 * Có những skill nào
 * Phím tắt để kích hoạt skill
 * Trạng thái của skill (Ready/Not Ready)
 * VD:
 * [D] Dash: Ready
 * [T] Time Slow: Not Ready
 * Rage Points: 3/5 
 */
export class SkillUIManager {
  private scene: Phaser.Scene;
  private skillUIs: Map<string, {
    container: Phaser.GameObjects.Container;
    statusText: Phaser.GameObjects.Text;
    keyText: Phaser.GameObjects.Text;
  }>;
  private rageBar!: Phaser.GameObjects.Rectangle;
  private rageBarBg!: Phaser.GameObjects.Rectangle;
  private rageText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.skillUIs = new Map();
    this.createRageBar();
  }

  private createRageBar() {
    // Background cho rage bar
    this.rageBarBg = this.scene.add.rectangle(
      GameConfig.WIDTH - 120,
      10,
      100,
      10,
      0x666666
    );

    // Rage bar
    this.rageBar = this.scene.add.rectangle(
      GameConfig.WIDTH - 120,
      10,
      100,
      10,
      0x0000ff
    );

    // Rage text
    this.rageText = this.scene.add.text(
      GameConfig.WIDTH - 170,
      5,
      'Rage: 0/15',
      {
        fontSize: '14px',
        color: '#ffffff'
      }
    );
  }

  public updateRageBar(currentRage: number, maxRage: number) {
    const width = (currentRage / maxRage) * 100;
    this.rageBar.width = width;
    this.rageText.setText(`Rage: ${currentRage}/${maxRage}`);
  }

  public addSkillUI(skill: ISkill) {
    const index = this.skillUIs.size;
    const yOffset = 20 + index * 40;

    // Container cho từng skill
    const container = this.scene.add.container(GameConfig.WIDTH - 120, yOffset);
    
    // Key binding và tên skill
    const keyText = this.scene.add.text(0, 0, `[${skill.key}] ${skill.name}`, {
      fontSize: '16px',
      color: '#fff'
    });

    // Trạng thái skill
    const statusText = this.scene.add.text(0, 20, 'Not Ready', {
      fontSize: '14px',
      color: '#ff0000'
    });

    container.add([keyText, statusText]);

    this.skillUIs.set(skill.name, {
      container,
      statusText,
      keyText
    });
  }

  public updateSkillUI(skill: ISkill) {
    const ui = this.skillUIs.get(skill.name);
    if (ui) {
      ui.statusText.setText(skill.isReady ? 'Ready' : 'Not Ready');
      ui.statusText.setColor(skill.isReady ? '#00ff00' : '#ff0000');
    }
  }
}
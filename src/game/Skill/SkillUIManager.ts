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

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.skillUIs = new Map();
  }

  public addSkillUI(skill: ISkill) {
    const container = this.scene.add.container(GameConfig.WIDTH - 120, 20);
    
    const statusText = this.scene.add.text(0, 0, 'Not Ready', {
      fontSize: '16px',
      color: '#fff'
    });

    const keyText = this.scene.add.text(0, 20, `[${skill.key}] ${skill.name}`, {
      fontSize: '14px',
      color: '#fff'
    });

    container.add([statusText, keyText]);

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
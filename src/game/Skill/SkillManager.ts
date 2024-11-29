import { Bird } from "../Bird/Bird";
import { ISkill } from "./models/ISkill";
import { DashSkill } from "./Dash.skill";
import { SkillUIManager } from "./SkillUIManager";
import { GhostSkill } from "./Ghost.skill";
import { GameConfig } from "@/config/GameConfig";
import { BounceReduceSkill } from "./BounceReduce.skill";
import { BaseSkill } from "./BaseSkill";

export class SkillManager {
  private scene: Phaser.Scene;
  private bird: Bird;
  private skills: Map<string, ISkill>;
  private currentRange: number = 0;
  private maxRange: number = 15; // Nộ tối đa
  private uiManager: SkillUIManager;
  private skillListContainer?: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, bird: Bird) {
    this.scene = scene;
    this.bird = bird;
    this.skills = new Map();
    this.uiManager = new SkillUIManager(scene);
    this.registerSkills();
    this.setupInputs();
  }

  private registerSkills() {
    // Đăng ký các skill
    this.addSkill(new DashSkill(this.scene));
    this.addSkill(new BounceReduceSkill(this.scene));
    this.addSkill(new GhostSkill(this.scene));
  }

  private addSkill(skill: ISkill) {
    this.skills.set(skill.name, skill);
    this.uiManager.addSkillUI(skill);
  }

  private setupInputs() {
    this.skills.forEach(skill => {
      const key = this.scene.input.keyboard?.addKey(skill.key);
      key?.on('down', () => this.tryActivateSkill(skill));
    });
  }

  private tryActivateSkill(skill: ISkill) {
    if (!skill.isActive && this.currentRange >= skill.requiredPoints) {
      skill.activate(this.bird);
      
      if (skill instanceof BaseSkill) {
        (skill as BaseSkill).startDurationTimer((remainingTime) => {
          this.uiManager.updateDurationBar(skill, remainingTime);
        });
      }

      this.currentRange -= skill.requiredPoints;
      this.uiManager.updateRageBar(this.currentRange, this.maxRange);
      this.updateSkillsStatus();
    }
  }

  public addManaPoint() {
    if (this.currentRange < this.maxRange) {
      this.currentRange++;
      this.uiManager.updateRageBar(this.currentRange, this.maxRange);
      this.updateSkillsStatus();
    }
  }

  private updateSkillsStatus() {
    this.skills.forEach(skill => {
      // Skill sẵn sàng nếu có đủ nộ
      skill.isReady = this.currentRange >= skill.requiredPoints;
      this.uiManager.updateSkillUI(skill);
    });
  }

  public update() {
    this.skills.forEach(skill => {
      if (skill.isActive) {
        skill.update(this.bird);
      }
    });
  }

  public isSkillActive(skillName: string): boolean {
    const skill = this.skills.get(skillName);
    return skill ? skill.isActive : false;
  }

  public showSkillList(parentContainer: Phaser.GameObjects.Container) {
    // Tạo container cho skill list
    this.skillListContainer = this.scene.add.container(
      GameConfig.WIDTH / 2 - 200,
      150
    );

    // Title cho skill list
    const title = this.scene.add.text(
      0, 0,
      'AVAILABLE SKILLS',
      {
        fontSize: '32px',
        color: '#ffffff',
        fontStyle: 'bold'
      }
    );

    this.skillListContainer.add(title);

    // Hiển thị từng skill
    let yOffset = 50;
    this.skills.forEach((skill, name) => {
      const skillInfo = this.scene.add.text(
        0, yOffset,
        `[${skill.key}] ${name}\n` +
        `Required Points: ${skill.requiredPoints}\n` +
        `Duration: ${skill.duration}ms\n`,
        {
          fontSize: '24px',
          color: '#ffffff',
          lineSpacing: 5
        }
      );
      
      this.skillListContainer?.add(skillInfo);
      yOffset += 100;
    });

    parentContainer.add(this.skillListContainer);
  }

  public hideSkillList() {
    this.skillListContainer?.destroy();
    this.skillListContainer = undefined;
  }
}
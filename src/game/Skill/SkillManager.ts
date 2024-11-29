import { GameConfig } from "@/config/GameConfig";
import { Bird } from "../Bird/Bird";
import { ISkill } from "./models/ISkill";
import { DashSkill } from "./DashSkill.skill";
import { SkillUIManager } from "./SkillUIManager";

export class SkillManager {
  private scene: Phaser.Scene;
  private bird: Bird;
  private skills: Map<string, ISkill>;
  private ragePoints: number = 0;
  private uiManager: SkillUIManager;

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
    // Thêm skill mới ở đây
    // this.addSkill(new TimeSlowSkill(this.scene));
    // this.addSkill(new ShieldSkill(this.scene));
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
    if (skill.isReady && !skill.isActive) {
      skill.activate(this.bird);
      skill.isReady = false;
      this.uiManager.updateSkillUI(skill);
    }
  }

  public addRagePoint() {
    this.ragePoints++;
    
    this.skills.forEach(skill => {
      if (!skill.isReady && this.ragePoints >= skill.requiredPoints) {
        skill.isReady = true;
        this.ragePoints = 0;
        this.uiManager.updateSkillUI(skill);
      }
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
}
import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService, replaceTokens } from '../../../core/rule-templates.service';
import { ClassTypeId, ClassTypeOption } from '../point-two/rule-point-two.component';

interface ClassTypeVerificationParams {
  verificationRules: string;
  helperMaterials: string;
}

@Component({
  selector: 'app-rule-point-three',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rule-point-three.component.html',
  styleUrl: './rule-point-three.component.scss',
})
export class RulePointThreeComponent {
  readonly selectedTypes = input.required<ClassTypeOption[]>();
  readonly isExamSubject = input(false);
  private readonly templates = inject(RuleTemplatesService);

  private readonly paramsState = signal<Record<ClassTypeId, ClassTypeVerificationParams>>({
    lecture: this.createDefaultParams('lecture'),
    classes: this.createDefaultParams('classes'),
    laboratory: this.createDefaultParams('laboratory'),
    project: this.createDefaultParams('project'),
    computer_classes: this.createDefaultParams('computer_classes'),
    seminar: this.createDefaultParams('seminar'),
  });

  constructor() {
    effect(() => {
      const template = this.templates.rulePointThreeTemplate();
      const nextLectureDefault = this.isExamSubject()
        ? template.lectureExam
        : template.lectureCredit;
      const previousLectureDefault = this.isExamSubject()
        ? template.lectureCredit
        : template.lectureExam;
      const currentLectureRules = this.paramsState().lecture.verificationRules;
      const isKnownDefault =
        currentLectureRules === previousLectureDefault ||
        currentLectureRules === template.lectureCredit ||
        currentLectureRules === template.lectureExam;

      if (currentLectureRules !== nextLectureDefault && isKnownDefault) {
        this.patchTypeParams('lecture', { verificationRules: nextLectureDefault });
      }
    });
  }

  protected readonly generatedText = computed(() => {
    return this.selectedTypes()
      .map((type) => {
        const params = this.paramsState()[type.id];
        const helperMaterials = params.helperMaterials.trim();
        const helperMaterialsLine = helperMaterials
          ? replaceTokens(this.templates.rulePointThreeTemplate().helperMaterials, {
            materials: helperMaterials,
          })
          : '';

        return `${this.typeLabel(type.id)}: ${params.verificationRules.trim()}${helperMaterialsLine}`;
      })
      .join('\n\n');
  });

  protected getParams(typeId: ClassTypeId): ClassTypeVerificationParams {
    return this.paramsState()[typeId];
  }

  protected updateVerificationRules(typeId: ClassTypeId, verificationRules: string): void {
    this.patchTypeParams(typeId, { verificationRules });
  }

  protected updateHelperMaterials(typeId: ClassTypeId, helperMaterials: string): void {
    this.patchTypeParams(typeId, { helperMaterials });
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }

  private patchTypeParams(typeId: ClassTypeId, patch: Partial<ClassTypeVerificationParams>): void {
    this.paramsState.update((state) => ({
      ...state,
      [typeId]: {
        ...state[typeId],
        ...patch,
      },
    }));
  }

  private createDefaultParams(typeId: ClassTypeId): ClassTypeVerificationParams {
    return {
      verificationRules: this.defaultVerificationRules(typeId),
      helperMaterials: '',
    };
  }

  private typeLabel(typeId: ClassTypeId): string {
    const template = this.templates.rulePointThreeTemplate();
    switch (typeId) {
      case 'lecture':
        return template.typeLecture;
      case 'classes':
        return template.typeClasses;
      case 'laboratory':
        return template.typeLaboratory;
      case 'project':
        return template.typeProject;
      case 'computer_classes':
        return template.typeComputerClasses;
      case 'seminar':
        return template.typeSeminar;
      default:
        return '';
    }
  }

  private defaultVerificationRules(typeId: ClassTypeId): string {
    const template = this.templates.rulePointThreeTemplate();
    switch (typeId) {
      case 'lecture':
        return this.isExamSubject()
          ? template.lectureExam
          : template.lectureCredit;
      case 'project':
        return template.project;
      case 'laboratory':
        return template.laboratory;
      case 'computer_classes':
        return template.computerClasses;
      case 'seminar':
        return template.seminar;
      case 'classes':
        return template.classes;
      default:
        return '';
    }
  }
}

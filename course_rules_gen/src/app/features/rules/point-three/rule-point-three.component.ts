import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClassTypeId, ClassTypeOption } from '../point-two/rule-point-two.component';

interface ClassTypeVerificationParams {
  verificationRules: string;
  helperMaterials: string;
}

@Component({
  selector: 'app-rule-point-three',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-three.component.html',
  styleUrl: './rule-point-three.component.scss',
})
export class RulePointThreeComponent {
  private static readonly LECTURE_DEFAULT_CREDIT =
    'Zaliczenie wykładu na podstawie kolokwium, z którego można otrzymać XX punktów. Do zaliczenia przedmiotu konieczne jest zdobycie min. 50% punktów.';
  private static readonly LECTURE_DEFAULT_EXAM =
    'Zaliczenie wykładu na podstawie egzaminu pisemnego składającego się z XX zadań.';

  readonly selectedTypes = input.required<ClassTypeOption[]>();
  readonly isExamSubject = input(false);

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
      const nextLectureDefault = this.isExamSubject()
        ? RulePointThreeComponent.LECTURE_DEFAULT_EXAM
        : RulePointThreeComponent.LECTURE_DEFAULT_CREDIT;
      const previousLectureDefault = this.isExamSubject()
        ? RulePointThreeComponent.LECTURE_DEFAULT_CREDIT
        : RulePointThreeComponent.LECTURE_DEFAULT_EXAM;
      const currentLectureRules = this.paramsState().lecture.verificationRules;
      const isKnownDefault =
        currentLectureRules === previousLectureDefault ||
        currentLectureRules === RulePointThreeComponent.LECTURE_DEFAULT_CREDIT ||
        currentLectureRules === RulePointThreeComponent.LECTURE_DEFAULT_EXAM;

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
          ? ` Dopuszczone materiały i urządzenia pomocnicze: ${helperMaterials}.`
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
    switch (typeId) {
      case 'lecture':
        return 'Wykład';
      case 'classes':
        return 'Ćwiczenia';
      case 'laboratory':
        return 'Laboratorium';
      case 'project':
        return 'Projekt';
      case 'computer_classes':
        return 'Ćwiczenia komputerowe';
      case 'seminar':
        return 'Seminarium';
      default:
        return '';
    }
  }

  private defaultVerificationRules(typeId: ClassTypeId): string {
    switch (typeId) {
      case 'lecture':
        return this.isExamSubject()
          ? RulePointThreeComponent.LECTURE_DEFAULT_EXAM
          : RulePointThreeComponent.LECTURE_DEFAULT_CREDIT;
      case 'project':
        return 'Zaliczenie zajęć projektowych na podstawie ocen z XX wykonywanych w trakcie semestru projektów.';
      case 'laboratory':
        return 'Zaliczenie laboratorium na podstawie punktów zdobywanych za kolejne ćwiczenia (wymagane zdobycie min. 50% punktów).';
      case 'computer_classes':
        return 'Zaliczenie ćwiczeń komputerowych na podstawie kolokwium, z którego można otrzymać XX punktów. Do zaliczenia przedmiotu konieczne jest zdobycie min. 50% punktów.';
      case 'seminar':
        return 'Zaliczenie na podstawie prezentacji tematu pracy dyplomowej (33% oceny), prezentacji wybranego pytania dyplomowego (33% oceny) oraz opracowania wybranego pytania dyplomowego (34% oceny).';
      case 'classes':
        return 'Zaliczenie ćwiczeń na podstawie dwóch kolokwiów, wymagane jest uzyskanie co najmniej 50% z każdego kolokwium.';
      default:
        return '';
    }
  }
}

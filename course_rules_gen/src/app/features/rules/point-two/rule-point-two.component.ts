import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService, replaceTokens } from '../../../core/rule-templates.service';

export type ClassTypeId =
  | 'lecture'
  | 'classes'
  | 'laboratory'
  | 'project'
  | 'computer_classes'
  | 'seminar';

export interface ClassTypeOption {
  id: ClassTypeId;
  label: string;
}

interface ClassTypeParams {
  maxUnexcusedAbsences: number;
  allowMakeup: boolean;
  makeupRulesText: string;
}

const DEFAULT_MAKEUP_RULES_TEXT =
  'Odrobienie zajęć z dnia usprawiedliwionej nieobecności możliwe jest z inną grupą realizującą przedmiot w terminie ustalonym z prowadzącym zajęcia lub koordynatorem przedmiotu.';

@Component({
  selector: 'app-rule-point-two',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rule-point-two.component.html',
  styleUrl: './rule-point-two.component.scss',
})
export class RulePointTwoComponent {
  readonly selectedTypes = input.required<ClassTypeOption[]>();
  private readonly templates = inject(RuleTemplatesService);
  private previousMakeupDefault = '';

  private readonly paramsState = signal<Record<ClassTypeId, ClassTypeParams>>({
    lecture: this.createDefaultParams(),
    classes: this.createDefaultParams(),
    laboratory: this.createDefaultParams(),
    project: this.createDefaultParams(),
    computer_classes: this.createDefaultParams(),
    seminar: this.createDefaultParams(),
  });

  protected readonly generatedText = computed(() => {
    return this.selectedTypes()
      .map((type) => this.buildParagraphForType(type.id))
      .join('\n\n');
  });

  protected getParams(typeId: ClassTypeId): ClassTypeParams {
    return this.paramsState()[typeId];
  }

  protected updateMaxAbsences(typeId: ClassTypeId, value: string): void {
    const parsed = Number.parseInt(value, 10);
    const nextValue = Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);

    this.patchTypeParams(typeId, { maxUnexcusedAbsences: nextValue });
  }

  protected updateAllowMakeup(typeId: ClassTypeId, allowMakeup: boolean): void {
    this.patchTypeParams(typeId, { allowMakeup });
  }

  protected updateMakeupRulesText(typeId: ClassTypeId, makeupRulesText: string): void {
    this.patchTypeParams(typeId, { makeupRulesText });
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }

  constructor() {
    effect(() => {
      const currentDefault = this.templates.rulePointTwoTemplate().makeupRulesDefault;

      this.paramsState.update((state) => {
        const nextState: Record<ClassTypeId, ClassTypeParams> = { ...state };
        let changed = false;

        const typeIds: ClassTypeId[] = [
          'lecture',
          'classes',
          'laboratory',
          'project',
          'computer_classes',
          'seminar',
        ];

        for (const typeId of typeIds) {
          const currentText = state[typeId].makeupRulesText;
          const isKnownDefault =
            currentText === '' ||
            currentText === currentDefault ||
            currentText === DEFAULT_MAKEUP_RULES_TEXT ||
            currentText === this.previousMakeupDefault;

          if (isKnownDefault && currentText !== currentDefault) {
            nextState[typeId] = {
              ...state[typeId],
              makeupRulesText: currentDefault,
            };
            changed = true;
          }
        }

        return changed ? nextState : state;
      });

      this.previousMakeupDefault = currentDefault;
    }, { allowSignalWrites: true });
  }

  private createDefaultParams(): ClassTypeParams {
    return {
      maxUnexcusedAbsences: 1,
      allowMakeup: false,
      makeupRulesText: this.templates.rulePointTwoTemplate().makeupRulesDefault,
    };
  }

  private patchTypeParams(typeId: ClassTypeId, patch: Partial<ClassTypeParams>): void {
    this.paramsState.update((state) => ({
      ...state,
      [typeId]: {
        ...state[typeId],
        ...patch,
      },
    }));
  }

  private buildParagraphForType(typeId: ClassTypeId): string {
    const template = this.templates.rulePointTwoTemplate();

    if (typeId === 'lecture') {
      return template.lecture;
    }

    const params = this.paramsState()[typeId];
    const locative = this.classTypeLocative(typeId);
    const absences = this.formatUnexcusedAbsences(params.maxUnexcusedAbsences);

    const baseText = replaceTokens(template.base, {
      locative,
      absences,
    });

    if (!params.allowMakeup) {
      return baseText;
    }

    return `${baseText} ${params.makeupRulesText.trim()}`;
  }

  private classTypeLocative(typeId: ClassTypeId): string {
    const template = this.templates.rulePointTwoTemplate();
    switch (typeId) {
      case 'classes':
        return template.locativeClasses;
      case 'laboratory':
        return template.locativeLaboratory;
      case 'project':
        return template.locativeProject;
      case 'computer_classes':
        return template.locativeComputerClasses;
      case 'seminar':
        return template.locativeSeminar;
      case 'lecture':
      default:
        return template.locativeLecture;
    }
  }

  private formatUnexcusedAbsences(count: number): string {
    const template = this.templates.rulePointTwoTemplate();
    if (count === 1) {
      return template.absences1;
    }

    if (count >= 2 && count <= 4) {
      return replaceTokens(template.absences2To4, { count: count.toString() });
    }

    return replaceTokens(template.absencesMany, { count: count.toString() });
  }
}

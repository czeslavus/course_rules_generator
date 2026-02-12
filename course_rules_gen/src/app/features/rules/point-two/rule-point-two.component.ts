import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-two.component.html',
  styleUrl: './rule-point-two.component.scss',
})
export class RulePointTwoComponent {
  readonly selectedTypes = input.required<ClassTypeOption[]>();

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

  private createDefaultParams(): ClassTypeParams {
    return {
      maxUnexcusedAbsences: 1,
      allowMakeup: false,
      makeupRulesText: DEFAULT_MAKEUP_RULES_TEXT,
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
    if (typeId === 'lecture') {
      return 'Uczestnictwo w wykładach jest nieobowiązkowe.';
    }

    const params = this.paramsState()[typeId];
    const baseText =
      `Obecność na ${this.classTypeLocative(typeId)} jest obowiązkowa. ` +
      `Dopuszcza się maksymalnie ${this.formatUnexcusedAbsences(params.maxUnexcusedAbsences)}. ` +
      'Usprawiedliwienie nieobecności powinno nastąpić najpóźniej w ciągu tygodnia od zakończenia nieobecności. ' +
      'Odpowiedni dokument należy okazać lub przesłać e-mailem prowadzącemu zajęcia lub koordynatorowi przedmiotu.';

    if (!params.allowMakeup) {
      return baseText;
    }

    return `${baseText} ${params.makeupRulesText.trim()}`;
  }

  private classTypeLocative(typeId: ClassTypeId): string {
    switch (typeId) {
      case 'classes':
        return 'ćwiczeniach';
      case 'laboratory':
        return 'laboratorium';
      case 'project':
        return 'projekcie';
      case 'computer_classes':
        return 'ćwiczeniach komputerowych';
      case 'seminar':
        return 'seminarium';
      case 'lecture':
      default:
        return 'wykładach';
    }
  }

  private formatUnexcusedAbsences(count: number): string {
    if (count === 1) {
      return '1 nieusprawiedliwioną nieobecność';
    }

    if (count >= 2 && count <= 4) {
      return `${count} nieusprawiedliwione nieobecności`;
    }

    return `${count} nieusprawiedliwionych nieobecności`;
  }
}

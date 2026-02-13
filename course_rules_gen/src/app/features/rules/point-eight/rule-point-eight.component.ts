import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-eight',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-eight.component.html',
})
export class RulePointEightComponent {
  readonly isExamSubject = input(false);
  private readonly templates = inject(RuleTemplatesService);

  protected readonly textState = signal<string>('');

  constructor() {
    effect(() => {
      const template = this.templates.rulePointEightTemplate();
      const nextDefault = this.defaultText(template);
      const previousDefault = this.isExamSubject()
        ? template.nonExamDefault
        : template.examDefault;
      const current = this.textState();

      const isKnownDefault =
        current === '' ||
        current === template.examDefault ||
        current === template.nonExamDefault;

      if (current !== nextDefault && (current === previousDefault || isKnownDefault)) {
        this.textState.set(nextDefault);
      }
    }, { allowSignalWrites: true });
  }

  protected readonly generatedText = computed(() => this.textState().trim());

  protected updateText(text: string): void {
    this.textState.set(text);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }

  private defaultText(template: { examDefault: string; nonExamDefault: string }): string {
    return this.isExamSubject()
      ? template.examDefault
      : template.nonExamDefault;
  }
}

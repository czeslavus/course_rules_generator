import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-five',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-five.component.html',
})
export class RulePointFiveComponent {
  readonly isExamSubject = input(false);
  private readonly templates = inject(RuleTemplatesService);

  // Initialize with default based on input, but using template values
  protected readonly textState = signal<string>('');

  constructor() {
    // Initial setup in constructor to access inputs/signals
    // We use effect to react to changes, but also need initial value
    effect(() => {
      const template = this.templates.rulePointFiveTemplate();
      const nextDefault = this.defaultText(template);
      const previousDefault = this.isExamSubject()
        ? template.nonExamDefault
        : template.examDefault;
      const current = this.textState();

      // If current is empty (initial) or matches a default, update it
      // Note: checking against previous defaults from *before* template load might be tricky
      // so we check against *any* known default from current template
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

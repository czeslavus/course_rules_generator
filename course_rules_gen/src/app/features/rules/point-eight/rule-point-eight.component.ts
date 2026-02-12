import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule-point-eight',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-eight.component.html',
})
export class RulePointEightComponent {
  private static readonly EXAM_DEFAULT_TEXT =
    'Termin egzaminu poprawkowego określa harmonogram wrześniowej sesji egzaminacyjnej';
  private static readonly NON_EXAM_DEFAULT_TEXT =
    'W przedmiocie nie przewiduje się dodatkowych terminów poprawkowych';

  readonly isExamSubject = input(false);

  protected readonly textState = signal<string>(this.defaultText());

  constructor() {
    effect(() => {
      const nextDefault = this.defaultText();
      const previousDefault = this.isExamSubject()
        ? RulePointEightComponent.NON_EXAM_DEFAULT_TEXT
        : RulePointEightComponent.EXAM_DEFAULT_TEXT;
      const current = this.textState();
      const isKnownDefault =
        current === RulePointEightComponent.EXAM_DEFAULT_TEXT ||
        current === RulePointEightComponent.NON_EXAM_DEFAULT_TEXT;

      if (current !== nextDefault && (current === previousDefault || isKnownDefault)) {
        this.textState.set(nextDefault);
      }
    });
  }

  protected readonly generatedText = computed(() => this.textState().trim());

  protected updateText(text: string): void {
    this.textState.set(text);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }

  private defaultText(): string {
    return this.isExamSubject()
      ? RulePointEightComponent.EXAM_DEFAULT_TEXT
      : RulePointEightComponent.NON_EXAM_DEFAULT_TEXT;
  }
}

import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule-point-five',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-five.component.html',
})
export class RulePointFiveComponent {
  private static readonly EXAM_DEFAULT_TEXT =
    'Dodatkowy "zerowy" termin egzaminu odbędie się na ostatnim wykładzie';
  private static readonly NON_EXAM_DEFAULT_TEXT =
    'Dodatkowe terminy poza wskazanymi w pkt 4 nie są przewidziane';

  readonly isExamSubject = input(false);

  protected readonly textState = signal<string>(this.defaultText());

  constructor() {
    effect(() => {
      const nextDefault = this.defaultText();
      const previousDefault = this.isExamSubject()
        ? RulePointFiveComponent.NON_EXAM_DEFAULT_TEXT
        : RulePointFiveComponent.EXAM_DEFAULT_TEXT;
      const current = this.textState();
      const isKnownDefault =
        current === RulePointFiveComponent.EXAM_DEFAULT_TEXT ||
        current === RulePointFiveComponent.NON_EXAM_DEFAULT_TEXT;

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
      ? RulePointFiveComponent.EXAM_DEFAULT_TEXT
      : RulePointFiveComponent.NON_EXAM_DEFAULT_TEXT;
  }
}

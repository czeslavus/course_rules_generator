import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule-point-six',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-six.component.html',
})
export class RulePointSixComponent {
  private static readonly DEFAULT_TEXT = `Ocena końcowa wystawiana jest na podstawie sumy punktów z kolokwium i zadań według zależności:
% zdobytych punktów         Ocena
< 50% - 60% >                          3,0
( 60% - 70% >                          3,5
( 70% - 80% >                          4,0
( 80% - 90% >                          4,5
( 90% - 100% >                        5,0`;

  protected readonly textState = signal<string>(RulePointSixComponent.DEFAULT_TEXT);

  protected readonly generatedText = computed(() => this.textState().trim());

  protected updateText(text: string): void {
    this.textState.set(text);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }
}

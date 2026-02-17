import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-six',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rule-point-six.component.html',
})
export class RulePointSixComponent {
  private readonly templates = inject(RuleTemplatesService);
  private previousDefaultText = '';

  protected readonly internalTextState = signal<string>('');

  constructor() {
    effect(() => {
      const currentDefault = this.templates.rulePointSixTemplate().defaultText;
      const current = this.internalTextState();
      const isKnownDefault =
        current === '' ||
        current === currentDefault ||
        current === this.previousDefaultText;

      if (current !== currentDefault && isKnownDefault) {
        this.internalTextState.set(currentDefault);
      }

      this.previousDefaultText = currentDefault;
    }, { allowSignalWrites: true });
  }

  protected readonly generatedText = computed(() => this.internalTextState().trim());

  protected updateText(text: string): void {
    this.internalTextState.set(text);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }
}

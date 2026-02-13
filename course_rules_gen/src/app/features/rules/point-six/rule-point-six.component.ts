import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-six',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-six.component.html',
})
export class RulePointSixComponent {
  private readonly templates = inject(RuleTemplatesService);

  protected readonly textState = computed(() => this.templates.rulePointSixTemplate().defaultText);

  protected readonly internalTextState = signal<string>('');

  constructor() {
    const t = this.templates.rulePointSixTemplate();
    this.internalTextState.set(t.defaultText);
  }

  protected readonly generatedText = computed(() => this.internalTextState().trim());

  protected updateText(text: string): void {
    this.internalTextState.set(text);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }
}

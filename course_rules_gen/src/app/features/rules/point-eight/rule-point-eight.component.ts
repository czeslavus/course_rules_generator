import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-eight',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rule-point-eight.component.html',
})
export class RulePointEightComponent {
  readonly isExamSubject = input(false);
  private readonly templates = inject(RuleTemplatesService);
  private previousDefaults: [string, string] = ['', ''];

  protected readonly textState = signal<string>('');

  constructor() {
    effect(() => {
      const template = this.templates.rulePointEightTemplate();
      const nextDefault = this.defaultText(template);
      const current = this.textState();

      const isKnownDefault =
        current === '' ||
        current === template.examDefault ||
        current === template.nonExamDefault ||
        current === this.previousDefaults[0] ||
        current === this.previousDefaults[1];

      if (current !== nextDefault && isKnownDefault) {
        this.textState.set(nextDefault);
      }

      this.previousDefaults = [template.examDefault, template.nonExamDefault];
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

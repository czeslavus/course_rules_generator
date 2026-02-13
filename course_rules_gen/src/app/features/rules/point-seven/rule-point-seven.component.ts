import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RuleTemplatesService, replaceTokens } from '../../../core/rule-templates.service';

type PublicationSystem = 'USOS' | 'LeON';

@Component({
  selector: 'app-rule-point-seven',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-seven.component.html',
})
export class RulePointSevenComponent {
  private readonly templates = inject(RuleTemplatesService);

  protected readonly systemState = signal<PublicationSystem>('USOS');
  protected readonly textState = signal<string>('');

  constructor() {
    effect(() => {
      const template = this.templates.rulePointSevenTemplate();
      const system = this.systemState();
      const nextDefault = this.defaultText(template, system);
      const previousDefault = this.defaultText(template, system === 'USOS' ? 'LeON' : 'USOS');
      const current = this.textState();

      const isKnownDefault =
        current === '' ||
        current === this.defaultText(template, 'USOS') ||
        current === this.defaultText(template, 'LeON');

      if (current !== nextDefault && (current === previousDefault || isKnownDefault)) {
        this.textState.set(nextDefault);
      }
    }, { allowSignalWrites: true });
  }

  protected readonly generatedText = computed(() => this.textState().trim());

  protected updateSystem(system: PublicationSystem): void {
    this.systemState.set(system);
  }

  protected updateText(text: string): void {
    this.textState.set(text);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }

  private defaultText(template: { defaultTemplate: string }, system: PublicationSystem): string {
    return replaceTokens(template.defaultTemplate, { SYSTEM: system });
  }
}

import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService, replaceTokens } from '../../../core/rule-templates.service';

type PublicationSystem = 'USOS' | 'LeON';

@Component({
  selector: 'app-rule-point-seven',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rule-point-seven.component.html',
})
export class RulePointSevenComponent {
  private readonly templates = inject(RuleTemplatesService);
  private previousDefaults: [string, string] = ['', ''];

  protected readonly systemState = signal<PublicationSystem>('USOS');
  protected readonly textState = signal<string>('');

  constructor() {
    effect(() => {
      const template = this.templates.rulePointSevenTemplate();
      const system = this.systemState();
      const usosDefault = this.defaultText(template, 'USOS');
      const leonDefault = this.defaultText(template, 'LeON');
      const nextDefault = system === 'USOS' ? usosDefault : leonDefault;
      const current = this.textState();

      const isKnownDefault =
        current === '' ||
        current === usosDefault ||
        current === leonDefault ||
        current === this.previousDefaults[0] ||
        current === this.previousDefaults[1];

      if (current !== nextDefault && isKnownDefault) {
        this.textState.set(nextDefault);
      }

      this.previousDefaults = [usosDefault, leonDefault];
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

import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-ten',
  imports: [FormsModule, TranslateModule],
  templateUrl: './rule-point-ten.component.html',
})
export class RulePointTenComponent {
  private readonly templates = inject(RuleTemplatesService);
  private previousTemplateText = '';

  private readonly textState = signal('');

  constructor() {
    effect(() => {
      const templateText = this.templates.rulePointTenTemplate().text;
      const current = this.textState();
      const isKnownDefault =
        current === '' ||
        current === templateText ||
        current === this.previousTemplateText;

      if (current !== templateText && isKnownDefault) {
        this.textState.set(templateText);
      }

      this.previousTemplateText = templateText;
    }, { allowSignalWrites: true });
  }

  protected readonly text = computed(() => this.textState());

  protected updateText(value: string): void {
    this.textState.set(value);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.text());
  }
}

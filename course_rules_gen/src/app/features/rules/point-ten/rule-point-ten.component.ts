import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-ten',
  imports: [FormsModule],
  templateUrl: './rule-point-ten.component.html',
})
export class RulePointTenComponent {
  private readonly templates = inject(RuleTemplatesService);

  private readonly textState = signal('');

  constructor() {
    effect(() => {
      const templateText = this.templates.rulePointTenTemplate().text;
      if (this.textState() === '') {
        this.textState.set(templateText);
      }
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

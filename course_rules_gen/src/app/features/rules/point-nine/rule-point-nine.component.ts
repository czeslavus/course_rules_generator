import { Component, inject } from '@angular/core';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-nine',
  templateUrl: './rule-point-nine.component.html',
})
export class RulePointNineComponent {
  private readonly templates = inject(RuleTemplatesService);

  get text(): string {
    return this.templates.rulePointNineTemplate().text;
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.text);
  }
}

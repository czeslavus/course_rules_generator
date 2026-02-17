import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

@Component({
  selector: 'app-rule-point-nine',
  imports: [TranslateModule],
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

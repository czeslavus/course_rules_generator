import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { RuleTemplatesService } from '../../../core/rule-templates.service';

function replaceTokens(template: string, values: Record<string, string>): string {
  return template.replace(/\[\[([a-zA-Z0-9_]+)\]\]/g, (_fullMatch, token: string) => values[token] ?? '');
}

@Component({
  selector: 'app-rule-point-one',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rule-point-one.component.html',
  styleUrl: './rule-point-one.component.scss',
})
export class RulePointOneComponent {
  private readonly fb = inject(FormBuilder);
  private readonly templates = inject(RuleTemplatesService);

  protected readonly form = this.fb.nonNullable.group({
    subjectType: ['obowiązkowy', Validators.required],
    degreeLevel: ['I', Validators.required],
    programme: ['Mechatronika', Validators.required],
    prerequisites: [''],
  });

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly generatedText = computed(() => {
    const { subjectType, degreeLevel, programme, prerequisites } = this.formValue();
    const template = this.templates.rulePointOneTemplate();
    const resolvedProgramme = programme ?? '';
    const programmePart =
      resolvedProgramme === template.commonProgrammeValue
        ? template.programmeCommon
        : replaceTokens(template.programmeDefault, { programme: resolvedProgramme });

    const normalizedPrerequisites = (prerequisites ?? '').trim();
    const prerequisitesLine = normalizedPrerequisites
      ? replaceTokens(template.prerequisitesProvided, { prerequisites: normalizedPrerequisites })
      : template.prerequisitesNone;

    return replaceTokens(template.main, {
      subjectType: subjectType ?? '',
      degreeLevel: degreeLevel ?? '',
      programmePart,
      prerequisitesLine,
    });
  });

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }
}

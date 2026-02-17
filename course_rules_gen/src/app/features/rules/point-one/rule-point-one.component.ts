import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { RuleTemplatesService, replaceTokens } from '../../../core/rule-templates.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';

type SubjectTypeValue = 'OBOWIĄZKOWY' | 'WARIANTOWY' | 'OBIERALNY';
type ProgrammeValue = 'MECHATRONICS' | 'AUTOMATION' | 'BIOMEDICAL_ENGINEERING' | 'COMMON_PART';

@Component({
  selector: 'app-rule-point-one',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './rule-point-one.component.html',
  styleUrl: './rule-point-one.component.scss',
})

export class RulePointOneComponent {
  private readonly fb = inject(FormBuilder);
  private readonly templates = inject(RuleTemplatesService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

  protected readonly form = this.fb.nonNullable.group({
    subjectType: ['OBOWIĄZKOWY' as SubjectTypeValue, Validators.required],
    degreeLevel: ['I', Validators.required],
    programme: ['MECHATRONICS' as ProgrammeValue, Validators.required],
    prerequisites: [''],
  });

  private readonly formValue = toSignal(
    this.form.valueChanges.pipe(startWith(this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );

  protected readonly generatedText = computed(() => {
    // Register dependency on language change
    this.languageService.currentLang();

    const { subjectType, degreeLevel, programme, prerequisites } = this.formValue();
    const template = this.templates.rulePointOneTemplate();
    const resolvedProgramme = (programme ?? 'MECHATRONICS') as ProgrammeValue;
    const resolvedSubjectType = (subjectType ?? 'OBOWIĄZKOWY') as SubjectTypeValue;

    const degreeLevelTranslated = degreeLevel ?? ''; // "I", "II" are likely universal or can be keyed if needed

    const subjectTypeTranslated = this.translate.instant(
      `RULES.POINT_ONE.SUBJECT_TYPE_OPTIONS.${resolvedSubjectType}`,
    );
    const programmeTranslated = this.translate.instant(
      `RULES.POINT_ONE.PROGRAMMES.${resolvedProgramme}`,
    );

    const programmePart =
      resolvedProgramme === 'COMMON_PART'
        ? template.programmeCommon
        : replaceTokens(template.programmeDefault, { programme: programmeTranslated });

    const normalizedPrerequisites = (prerequisites ?? '').trim();
    const prerequisitesLine = normalizedPrerequisites
      ? replaceTokens(template.prerequisitesProvided, { prerequisites: normalizedPrerequisites })
      : template.prerequisitesNone;

    return replaceTokens(template.main, {
      subjectType: subjectTypeTranslated,
      degreeLevel: degreeLevelTranslated,
      programmePart,
      prerequisitesLine,
    });
  });

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }
}

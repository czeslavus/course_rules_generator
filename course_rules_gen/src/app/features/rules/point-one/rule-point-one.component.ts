import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { RuleTemplatesService, replaceTokens } from '../../../core/rule-templates.service';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/language.service';

@Component({
  selector: 'app-rule-point-one',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rule-point-one.component.html',
  styleUrl: './rule-point-one.component.scss',
})

export class RulePointOneComponent {
  private readonly fb = inject(FormBuilder);
  private readonly templates = inject(RuleTemplatesService);
  private readonly translate = inject(TranslateService);
  private readonly languageService = inject(LanguageService);

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
    // Register dependency on language change
    this.languageService.currentLang();

    const { subjectType, degreeLevel, programme, prerequisites } = this.formValue();
    const template = this.templates.rulePointOneTemplate();
    const resolvedProgramme = programme ?? '';

    // Translate parameters
    const subjectTypeKey = `RULES.POINT_ONE.SUBJECT_TYPE_OPTIONS.${(subjectType ?? '').toUpperCase()}`;
    const subjectTypeTranslated = this.translate.instant(subjectTypeKey);

    const degreeLevelTranslated = degreeLevel ?? ''; // "I", "II" are likely universal or can be keyed if needed

    // Check if programme needs translation or mapping
    // For now assuming programme names might be specific, but let's try to look them up if keys exist, else keep original
    // The current form usage has specific string values.
    // Let's assume we map them or leave them if they are proper names.
    // "Mechatronika" -> "Mechatronics" in EN.
    // We can try to translate `RULES.POINT_ONE.PROGRAMME_OPTIONS.${programme}` if we assume keys.
    // Or just rely on the template content for static parts.
    // Use a helper to try translating or fallback?
    // For specific known values:
    let programmeTranslated = resolvedProgramme;
    if (resolvedProgramme === 'Mechatronika') programmeTranslated = this.translate.instant('RULES.POINT_ONE.PROGRAMMES.MECHATRONICS');
    else if (resolvedProgramme === 'Inżynieria Biomedyczna') programmeTranslated = this.translate.instant('RULES.POINT_ONE.PROGRAMMES.BIOMEDICAL_ENGINEERING');
    else if (resolvedProgramme === 'Automatyka Robotyka i Informatyka Przemysłowa') programmeTranslated = this.translate.instant('RULES.POINT_ONE.PROGRAMMES.AUTOMATION');
    else if (resolvedProgramme.startsWith('Część wspólna')) programmeTranslated = this.translate.instant('RULES.POINT_ONE.PROGRAMMES.COMMON_PART');


    const programmePart =
      resolvedProgramme === template.commonProgrammeValue
        ? template.programmeCommon // This comes from template, so it should be already localized if template is loaded correctly
        : replaceTokens(template.programmeDefault, { programme: programmeTranslated });

    const normalizedPrerequisites = (prerequisites ?? '').trim();
    const prerequisitesLine = normalizedPrerequisites
      ? replaceTokens(template.prerequisitesProvided, { prerequisites: normalizedPrerequisites })
      : template.prerequisitesNone;

    return replaceTokens(template.main, {
      subjectType: subjectTypeTranslated.startsWith('RULES.') ? (subjectType ?? '') : subjectTypeTranslated,
      degreeLevel: degreeLevelTranslated,
      programmePart,
      prerequisitesLine,
    });
  });

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }
}

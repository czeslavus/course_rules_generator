import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-rule-point-one',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rule-point-one.component.html',
  styleUrl: './rule-point-one.component.scss',
})
export class RulePointOneComponent {
  private readonly fb = inject(FormBuilder);
  
  protected readonly form = this.fb.nonNullable.group({
    subjectType: ['obowiązkowy', Validators.required],
    degreeLevel: ['I', Validators.required],
    programme: ['Mechatronika', Validators.required],
    prerequisites: [''],
  });

  protected readonly generatedText = computed(() => {
    const { subjectType, degreeLevel, programme, prerequisites } = this.form.getRawValue();

    const normalizedPrerequisites = prerequisites.trim();
    const prerequisitesLine = normalizedPrerequisites
      ? `Wymagania wstępne: ${normalizedPrerequisites}.`
      : 'Brak wymagań wstępnych.';

    return `Przedmiot ${subjectType} dla studentów studiów ${degreeLevel} na kierunku / części wspólnej ${programme}. ${prerequisitesLine}`;
  });

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }
}

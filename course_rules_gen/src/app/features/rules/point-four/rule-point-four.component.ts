import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RuleTemplatesService, replaceTokens } from '../../../core/rule-templates.service';
import { ClassTypeId, ClassTypeOption } from '../point-two/rule-point-two.component';

interface CountScheduleParams {
  count: number;
  weeks: number[];
}

interface TextScheduleParams {
  text: string;
}

interface PointFourParamsState {
  lecture: CountScheduleParams;
  classes: CountScheduleParams;
  project: CountScheduleParams;
  laboratory: TextScheduleParams;
  computer_classes: TextScheduleParams;
  seminar: TextScheduleParams;
}

@Component({
  selector: 'app-rule-point-four',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './rule-point-four.component.html',
})
export class RulePointFourComponent {
  readonly selectedTypes = input.required<ClassTypeOption[]>();
  readonly isExamSubject = input(false);
  private readonly templates = inject(RuleTemplatesService);
  private previousLabReportDefault = '';
  private previousSeminarDefault = '';

  private readonly paramsState = signal<PointFourParamsState>({
    lecture: this.createCountScheduleParams(this.defaultLectureColloquiumCount()),
    classes: this.createCountScheduleParams(2),
    project: this.createCountScheduleParams(0),
    laboratory: { text: this.templates.rulePointFourTemplate().labReportDefault },
    computer_classes: { text: this.templates.rulePointFourTemplate().labReportDefault },
    seminar: { text: this.templates.rulePointFourTemplate().seminar },
  });

  constructor() {
    effect(() => {
      const nextDefault = this.defaultLectureColloquiumCount();
      const previousDefault = this.isExamSubject() ? 2 : 0;
      const currentLectureParams = this.paramsState().lecture;

      if (
        currentLectureParams.count === previousDefault &&
        this.sameWeeks(currentLectureParams.weeks, this.defaultWeeks(previousDefault))
      ) {
        this.patchCountSchedule('lecture', {
          count: nextDefault,
          weeks: this.defaultWeeks(nextDefault),
        });
      }
    });

    effect(() => {
      const template = this.templates.rulePointFourTemplate();
      const defaultText = template.labReportDefault;
      const seminarDefaultText = template.seminar;

      this.paramsState.update((state) => {
        const nextState = { ...state };
        let changed = false;

        const labText = state.laboratory.text;
        const compText = state.computer_classes.text;
        const seminarText = state.seminar.text;
        const isLabKnownDefault =
          labText === '' || labText === defaultText || labText === this.previousLabReportDefault;
        const isCompKnownDefault =
          compText === '' || compText === defaultText || compText === this.previousLabReportDefault;
        const isSeminarKnownDefault =
          seminarText === '' ||
          seminarText === seminarDefaultText ||
          seminarText === this.previousSeminarDefault;

        if (isLabKnownDefault && labText !== defaultText) {
          nextState.laboratory = { text: defaultText };
          changed = true;
        }

        if (isCompKnownDefault && compText !== defaultText) {
          nextState.computer_classes = { text: defaultText };
          changed = true;
        }
        if (isSeminarKnownDefault && seminarText !== seminarDefaultText) {
          nextState.seminar = { text: seminarDefaultText };
          changed = true;
        }

        return changed ? nextState : state;
      });

      this.previousLabReportDefault = defaultText;
      this.previousSeminarDefault = seminarDefaultText;
    }, { allowSignalWrites: true });
  }

  protected readonly generatedText = computed(() => {
    const lines: string[] = [];
    const template = this.templates.rulePointFourTemplate();

    if (this.isExamSubject()) {
      lines.push(template.examSession);
    }

    for (const type of this.selectedTypes()) {
      const paragraph = this.buildParagraphForType(type.id);
      if (paragraph) {
        lines.push(paragraph);
      }
    }

    lines.push(template.randomEvents);

    return lines.join('\n');
  });

  protected getCount(typeId: ClassTypeId): number {
    if (typeId !== 'lecture' && typeId !== 'classes' && typeId !== 'project') {
      return 0;
    }

    return this.paramsState()[typeId].count;
  }

  protected getWeeks(typeId: ClassTypeId): number[] {
    if (typeId !== 'lecture' && typeId !== 'classes' && typeId !== 'project') {
      return [];
    }

    return this.paramsState()[typeId].weeks;
  }

  protected updateCount(typeId: ClassTypeId, value: string): void {
    if (typeId !== 'lecture' && typeId !== 'classes' && typeId !== 'project') {
      return;
    }

    const parsed = Number.parseInt(value, 10);
    const nextCount = Number.isNaN(parsed) ? 0 : Math.max(parsed, 0);
    const previous = this.paramsState()[typeId];

    this.patchCountSchedule(typeId, {
      count: nextCount,
      weeks: this.resizeWeeks(previous.weeks, nextCount),
    });
  }

  protected updateWeek(typeId: ClassTypeId, index: number, value: string): void {
    if (typeId !== 'lecture' && typeId !== 'classes' && typeId !== 'project') {
      return;
    }

    const normalizedWeek = this.normalizeWeek(value);
    const current = this.paramsState()[typeId];
    const nextWeeks = [...current.weeks];
    nextWeeks[index] = normalizedWeek;

    this.patchCountSchedule(typeId, { weeks: nextWeeks });
  }

  protected getSubmissionText(typeId: ClassTypeId): string {
    if (typeId !== 'laboratory' && typeId !== 'computer_classes' && typeId !== 'seminar') {
      return '';
    }

    return this.paramsState()[typeId].text;
  }

  protected updateSubmissionText(typeId: ClassTypeId, text: string): void {
    if (typeId !== 'laboratory' && typeId !== 'computer_classes' && typeId !== 'seminar') {
      return;
    }

    this.paramsState.update((state) => ({
      ...state,
      [typeId]: {
        text,
      },
    }));
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }

  private buildParagraphForType(typeId: ClassTypeId): string {
    const template = this.templates.rulePointFourTemplate();
    switch (typeId) {
      case 'lecture':
        return this.buildColloquiumParagraph(template.typeLecture, this.paramsState().lecture);
      case 'classes':
        return this.buildColloquiumParagraph(template.typeClasses, this.paramsState().classes);
      case 'project':
        return this.buildProjectParagraph(this.paramsState().project);
      case 'laboratory':
        return replaceTokens(template.laboratory, {
          text: this.ensureTrailingPeriod(this.paramsState().laboratory.text.trim()),
        });
      case 'computer_classes':
        return replaceTokens(template.computerClasses, {
          text: this.ensureTrailingPeriod(this.paramsState().computer_classes.text.trim()),
        });
      case 'seminar':
        return this.ensureTrailingPeriod(this.paramsState().seminar.text.trim());
      default:
        return '';
    }
  }

  private buildColloquiumParagraph(label: string, params: CountScheduleParams): string {
    const template = this.templates.rulePointFourTemplate();
    if (params.count === 0) {
      return replaceTokens(template.colloquiumNone, { label });
    }

    const terms = params.weeks
      .map((week, index) => `${template.singularColloquium} ${index + 1} - ${template.weekPlural} ${week}`)
      .join(', ');

    const countText = this.formatCount(
      params.count,
      template.singularColloquium,
      template.paucalColloquium,
      template.pluralColloquium,
    );

    return replaceTokens(template.colloquium, {
      label,
      countText,
      terms,
    });
  }

  private buildProjectParagraph(params: CountScheduleParams): string {
    const template = this.templates.rulePointFourTemplate();
    if (params.count === 0) {
      return template.projectNone;
    }

    const terms = params.weeks
      .map((week, index) => `${template.singularStage} ${index + 1} - ${template.weekPlural} ${week}`)
      .join(', ');

    const countText = this.formatCount(
      params.count,
      template.singularStage,
      template.paucalStage,
      template.pluralStage,
    );

    return replaceTokens(template.project, {
      countText,
      terms,
    });
  }

  private patchCountSchedule(
    typeId: 'lecture' | 'classes' | 'project',
    patch: Partial<CountScheduleParams>,
  ): void {
    this.paramsState.update((state) => ({
      ...state,
      [typeId]: {
        ...state[typeId],
        ...patch,
      },
    }));
  }

  private createCountScheduleParams(count: number): CountScheduleParams {
    return {
      count,
      weeks: this.defaultWeeks(count),
    };
  }

  private defaultLectureColloquiumCount(): number {
    return this.isExamSubject() ? 0 : 2;
  }

  private defaultWeeks(count: number): number[] {
    if (count <= 0) {
      return [];
    }

    if (count === 1) {
      return [8];
    }

    if (count === 2) {
      return [7, 14];
    }

    const step = 14 / (count - 1);
    return Array.from({ length: count }, (_, index) => 1 + Math.round(index * step));
  }

  private resizeWeeks(previousWeeks: number[], nextCount: number): number[] {
    if (nextCount <= 0) {
      return [];
    }

    const nextWeeks = previousWeeks.slice(0, nextCount);

    for (let index = nextWeeks.length; index < nextCount; index += 1) {
      nextWeeks.push(this.defaultWeeks(nextCount)[index]);
    }

    return nextWeeks;
  }

  private normalizeWeek(value: string): number {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return 1;
    }

    return Math.min(15, Math.max(1, parsed));
  }

  private sameWeeks(a: number[], b: number[]): boolean {
    if (a.length !== b.length) {
      return false;
    }

    return a.every((value, index) => value === b[index]);
  }

  private ensureTrailingPeriod(text: string): string {
    if (!text) {
      return '';
    }

    return text.endsWith('.') ? text : `${text}.`;
  }

  private formatCount(count: number, singular: string, paucal: string, plural: string): string {
    const ones = count % 10;
    const tens = Math.floor((count % 100) / 10);

    if (count === 1) {
      return `${count} ${singular}`;
    }

    if (ones >= 2 && ones <= 4 && tens !== 1) {
      return `${count} ${paucal}`;
    }

    return `${count} ${plural}`;
  }
}

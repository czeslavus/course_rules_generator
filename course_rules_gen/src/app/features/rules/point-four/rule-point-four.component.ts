import { CommonModule } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
}

@Component({
  selector: 'app-rule-point-four',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-four.component.html',
})
export class RulePointFourComponent {
  private static readonly LAB_REPORT_DEFAULT_TEXT =
    'sprawozdanie z ćwiczenia laboratoryjnego należy złożyć w ciągu tygodnia od jego wykonania';
  private static readonly EXAM_SESSION_TEXT =
    'Terminy egzaminów z przedmiotu określa harmonogram sesji egzaminacyjnej.';
  private static readonly RANDOM_EVENTS_TEXT =
    'W przypadku zdarzeń losowych uniemożliwiających przeprowadzenie zaliczeń w terminach wskazanych w regulaminie prowadzący wyznaczy nowy termin z co najmniej tygodniowym wyprzedzeniem i poinformuje o nim studentów korzystając z platformy Leon.';

  readonly selectedTypes = input.required<ClassTypeOption[]>();
  readonly isExamSubject = input(false);

  private readonly paramsState = signal<PointFourParamsState>({
    lecture: this.createCountScheduleParams(this.defaultLectureColloquiumCount()),
    classes: this.createCountScheduleParams(2),
    project: this.createCountScheduleParams(0),
    laboratory: { text: RulePointFourComponent.LAB_REPORT_DEFAULT_TEXT },
    computer_classes: { text: RulePointFourComponent.LAB_REPORT_DEFAULT_TEXT },
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
  }

  protected readonly generatedText = computed(() => {
    const paragraphs: string[] = [];

    if (this.isExamSubject()) {
      paragraphs.push(RulePointFourComponent.EXAM_SESSION_TEXT);
    }

    for (const type of this.selectedTypes()) {
      const paragraph = this.buildParagraphForType(type.id);
      if (paragraph) {
        paragraphs.push(paragraph);
      }
    }

    paragraphs.push(RulePointFourComponent.RANDOM_EVENTS_TEXT);

    return paragraphs.join('\n\n');
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
    if (typeId !== 'laboratory' && typeId !== 'computer_classes') {
      return '';
    }

    return this.paramsState()[typeId].text;
  }

  protected updateSubmissionText(typeId: ClassTypeId, text: string): void {
    if (typeId !== 'laboratory' && typeId !== 'computer_classes') {
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
    switch (typeId) {
      case 'lecture':
        return this.buildColloquiumParagraph('Wykład', this.paramsState().lecture);
      case 'classes':
        return this.buildColloquiumParagraph('Ćwiczenia', this.paramsState().classes);
      case 'project':
        return this.buildProjectParagraph(this.paramsState().project);
      case 'laboratory':
        return `Laboratorium: ${this.ensureTrailingPeriod(this.paramsState().laboratory.text.trim())}`;
      case 'computer_classes':
        return `Ćwiczenia komputerowe: ${this.ensureTrailingPeriod(this.paramsState().computer_classes.text.trim())}`;
      case 'seminar':
        return 'Seminarium: harmonogram weryfikacji osiągnięcia efektów uczenia się ustala prowadzący zajęcia.';
      default:
        return '';
    }
  }

  private buildColloquiumParagraph(label: string, params: CountScheduleParams): string {
    if (params.count === 0) {
      return `${label}: nie przewiduje się kolokwiów.`;
    }

    const terms = params.weeks
      .map((week, index) => `kolokwium ${index + 1} - tydzień ${week}`)
      .join(', ');

    return `${label}: zaplanowano ${this.formatCount(params.count, 'kolokwium', 'kolokwia', 'kolokwiów')}. Terminy (tydzień zajęć): ${terms}.`;
  }

  private buildProjectParagraph(params: CountScheduleParams): string {
    if (params.count === 0) {
      return 'Projekt: nie przewiduje się etapów pośrednich.';
    }

    const terms = params.weeks.map((week, index) => `etap ${index + 1} - tydzień ${week}`).join(', ');

    return `Projekt: zaplanowano ${this.formatCount(params.count, 'etap', 'etapy', 'etapów')}. Terminy etapów (tydzień zajęć): ${terms}.`;
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

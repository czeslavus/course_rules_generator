import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

export interface RulePointOneTemplate {
  main: string;
  programmeDefault: string;
  programmeCommon: string;
  commonProgrammeValue: string;
  prerequisitesProvided: string;
  prerequisitesNone: string;
}

const DEFAULT_RULE_POINT_ONE_TEMPLATE: RulePointOneTemplate = {
  main: 'Przedmiot [[subjectType]] dla studentów studiów [[degreeLevel]]-go stopnia [[programmePart]]. [[prerequisitesLine]]',
  programmeDefault: 'na kierunku [[programme]]',
  programmeCommon:
    'części wspólnej kierunków Mechatronika i Automatyka Robotyka i Informatyka Przemysłowa',
  commonProgrammeValue: 'Część wspólna kierunku Mechatronika / ARiIP',
  prerequisitesProvided: 'Wymagania wstępne: [[prerequisites]].',
  prerequisitesNone: 'Brak wymagań wstępnych.',
};

@Injectable({ providedIn: 'root' })
export class RuleTemplatesService {
  private readonly rulePointOneTemplateState = signal<RulePointOneTemplate>(
    DEFAULT_RULE_POINT_ONE_TEMPLATE,
  );

  readonly rulePointOneTemplate = this.rulePointOneTemplateState.asReadonly();

  constructor(private readonly http: HttpClient) {}

  async load(): Promise<void> {
    try {
      const loadedTemplate = await firstValueFrom(
        this.http.get<RulePointOneTemplate>('/templates/rule-point-one.json'),
      );

      this.rulePointOneTemplateState.set({
        ...DEFAULT_RULE_POINT_ONE_TEMPLATE,
        ...loadedTemplate,
      });
    } catch (error) {
      console.error('Nie udało się wczytać szablonu reguły punktu 1, używam domyślnego.', error);
    }
  }
}

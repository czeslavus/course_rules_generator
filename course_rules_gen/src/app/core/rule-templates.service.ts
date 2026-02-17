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

export interface RulePointTwoTemplate {
  makeupRulesDefault: string;
  lecture: string;
  base: string;
  locativeClasses: string;
  locativeLaboratory: string;
  locativeProject: string;
  locativeComputerClasses: string;
  locativeSeminar: string;
  locativeLecture: string;
  absences1: string;
  absences2To4: string;
  absencesMany: string;
}

export interface RulePointThreeTemplate {
  lectureCredit: string;
  lectureExam: string;
  project: string;
  laboratory: string;
  computerClasses: string;
  seminar: string;
  classes: string;
  typeLecture: string;
  typeClasses: string;
  typeLaboratory: string;
  typeProject: string;
  typeComputerClasses: string;
  typeSeminar: string;
  helperMaterials: string;
}

export interface RulePointFourTemplate {
  labReportDefault: string;
  examSession: string;
  randomEvents: string;
  colloquiumNone: string;
  colloquium: string;
  projectNone: string;
  project: string;
  laboratory: string;
  computerClasses: string;
  seminar: string;
  weekPlural: string;
  typeLecture: string;
  typeClasses: string;
  typeProject: string;
  singularColloquium: string;
  paucalColloquium: string;
  pluralColloquium: string;
  singularStage: string;
  paucalStage: string;
  pluralStage: string;
}

export interface RulePointFiveTemplate {
  examDefault: string;
  nonExamDefault: string;
}

export interface RulePointSixTemplate {
  defaultText: string;
}

export interface RulePointSevenTemplate {
  defaultTemplate: string;
}

export interface RulePointEightTemplate {
  examDefault: string;
  nonExamDefault: string;
}

export interface RulePointNineTemplate {
  text: string;
}

export interface RulePointTenTemplate {
  text: string;
}

const DEFAULT_RULE_POINT_ONE_TEMPLATE: RulePointOneTemplate = {
  main: '',
  programmeDefault: '',
  programmeCommon: '',
  commonProgrammeValue: '',
  prerequisitesProvided: '',
  prerequisitesNone: '',
};

const DEFAULT_RULE_POINT_TWO_TEMPLATE: RulePointTwoTemplate = {
  makeupRulesDefault: '',
  lecture: '',
  base: '',
  locativeClasses: '',
  locativeLaboratory: '',
  locativeProject: '',
  locativeComputerClasses: '',
  locativeSeminar: '',
  locativeLecture: '',
  absences1: '',
  absences2To4: '',
  absencesMany: '',
};

const DEFAULT_RULE_POINT_THREE_TEMPLATE: RulePointThreeTemplate = {
  lectureCredit: '',
  lectureExam: '',
  project: '',
  laboratory: '',
  computerClasses: '',
  seminar: '',
  classes: '',
  typeLecture: '',
  typeClasses: '',
  typeLaboratory: '',
  typeProject: '',
  typeComputerClasses: '',
  typeSeminar: '',
  helperMaterials: '',
};

const DEFAULT_RULE_POINT_FOUR_TEMPLATE: RulePointFourTemplate = {
  labReportDefault: '',
  examSession: '',
  randomEvents: '',
  colloquiumNone: '',
  colloquium: '',
  projectNone: '',
  project: '',
  laboratory: '',
  computerClasses: '',
  seminar: '',
  weekPlural: '',
  typeLecture: '',
  typeClasses: '',
  typeProject: '',
  singularColloquium: '',
  paucalColloquium: '',
  pluralColloquium: '',
  singularStage: '',
  paucalStage: '',
  pluralStage: '',
};

const DEFAULT_RULE_POINT_FIVE_TEMPLATE: RulePointFiveTemplate = {
  examDefault: '',
  nonExamDefault: '',
};

const DEFAULT_RULE_POINT_SIX_TEMPLATE: RulePointSixTemplate = {
  defaultText: '',
};

const DEFAULT_RULE_POINT_SEVEN_TEMPLATE: RulePointSevenTemplate = {
  defaultTemplate: '',
};

const DEFAULT_RULE_POINT_EIGHT_TEMPLATE: RulePointEightTemplate = {
  examDefault: '',
  nonExamDefault: '',
};

const DEFAULT_RULE_POINT_NINE_TEMPLATE: RulePointNineTemplate = {
  text: '',
};

const DEFAULT_RULE_POINT_TEN_TEMPLATE: RulePointTenTemplate = {
  text: '',
};

export function replaceTokens(template: string, values: Record<string, string>): string {
  return template.replace(
    /\[\[([a-zA-Z0-9_]+)\]\]/g,
    (_fullMatch, token: string) => values[token] ?? '',
  );
}

@Injectable({ providedIn: 'root' })
export class RuleTemplatesService {
  private readonly rulePointOneTemplateState = signal<RulePointOneTemplate>(
    DEFAULT_RULE_POINT_ONE_TEMPLATE,
  );
  private readonly rulePointTwoTemplateState = signal<RulePointTwoTemplate>(
    DEFAULT_RULE_POINT_TWO_TEMPLATE,
  );
  private readonly rulePointThreeTemplateState = signal<RulePointThreeTemplate>(
    DEFAULT_RULE_POINT_THREE_TEMPLATE,
  );
  private readonly rulePointFourTemplateState = signal<RulePointFourTemplate>(
    DEFAULT_RULE_POINT_FOUR_TEMPLATE,
  );
  private readonly rulePointFiveTemplateState = signal<RulePointFiveTemplate>(
    DEFAULT_RULE_POINT_FIVE_TEMPLATE,
  );
  private readonly rulePointSixTemplateState = signal<RulePointSixTemplate>(
    DEFAULT_RULE_POINT_SIX_TEMPLATE,
  );
  private readonly rulePointSevenTemplateState = signal<RulePointSevenTemplate>(
    DEFAULT_RULE_POINT_SEVEN_TEMPLATE,
  );
  private readonly rulePointEightTemplateState = signal<RulePointEightTemplate>(
    DEFAULT_RULE_POINT_EIGHT_TEMPLATE,
  );
  private readonly rulePointNineTemplateState = signal<RulePointNineTemplate>(
    DEFAULT_RULE_POINT_NINE_TEMPLATE,
  );
  private readonly rulePointTenTemplateState = signal<RulePointTenTemplate>(
    DEFAULT_RULE_POINT_TEN_TEMPLATE,
  );

  readonly rulePointOneTemplate = this.rulePointOneTemplateState.asReadonly();
  readonly rulePointTwoTemplate = this.rulePointTwoTemplateState.asReadonly();
  readonly rulePointThreeTemplate = this.rulePointThreeTemplateState.asReadonly();
  readonly rulePointFourTemplate = this.rulePointFourTemplateState.asReadonly();
  readonly rulePointFiveTemplate = this.rulePointFiveTemplateState.asReadonly();
  readonly rulePointSixTemplate = this.rulePointSixTemplateState.asReadonly();
  readonly rulePointSevenTemplate = this.rulePointSevenTemplateState.asReadonly();
  readonly rulePointEightTemplate = this.rulePointEightTemplateState.asReadonly();
  readonly rulePointNineTemplate = this.rulePointNineTemplateState.asReadonly();
  readonly rulePointTenTemplate = this.rulePointTenTemplateState.asReadonly();

  constructor(private readonly http: HttpClient) { }

  async load(lang: string = 'pl'): Promise<void> {
    try {
      const suffix = lang === 'en' ? '.en.json' : '.json';
      const [
        p1,
        p2,
        p3,
        p4,
        p5,
        p6,
        p7,
        p8,
        p9,
        p10,
      ] = await Promise.all([
        this.fetchTemplate<RulePointOneTemplate>(`rule-point-one${suffix}`),
        this.fetchTemplate<RulePointTwoTemplate>(`rule-point-two${suffix}`),
        this.fetchTemplate<RulePointThreeTemplate>(`rule-point-three${suffix}`),
        this.fetchTemplate<RulePointFourTemplate>(`rule-point-four${suffix}`),
        this.fetchTemplate<RulePointFiveTemplate>(`rule-point-five${suffix}`),
        this.fetchTemplate<RulePointSixTemplate>(`rule-point-six${suffix}`),
        this.fetchTemplate<RulePointSevenTemplate>(`rule-point-seven${suffix}`),
        this.fetchTemplate<RulePointEightTemplate>(`rule-point-eight${suffix}`),
        this.fetchTemplate<RulePointNineTemplate>(`rule-point-nine${suffix}`),
        this.fetchTemplate<RulePointTenTemplate>(`rule-point-ten${suffix}`),
      ]);

      if (p1) this.rulePointOneTemplateState.set({ ...DEFAULT_RULE_POINT_ONE_TEMPLATE, ...p1 });
      if (p2) this.rulePointTwoTemplateState.set({ ...DEFAULT_RULE_POINT_TWO_TEMPLATE, ...p2 });
      if (p3) this.rulePointThreeTemplateState.set({ ...DEFAULT_RULE_POINT_THREE_TEMPLATE, ...p3 });
      if (p4) this.rulePointFourTemplateState.set({ ...DEFAULT_RULE_POINT_FOUR_TEMPLATE, ...p4 });
      if (p5) this.rulePointFiveTemplateState.set({ ...DEFAULT_RULE_POINT_FIVE_TEMPLATE, ...p5 });
      if (p6) this.rulePointSixTemplateState.set({ ...DEFAULT_RULE_POINT_SIX_TEMPLATE, ...p6 });
      if (p7) this.rulePointSevenTemplateState.set({ ...DEFAULT_RULE_POINT_SEVEN_TEMPLATE, ...p7 });
      if (p8) this.rulePointEightTemplateState.set({ ...DEFAULT_RULE_POINT_EIGHT_TEMPLATE, ...p8 });
      if (p9) this.rulePointNineTemplateState.set({ ...DEFAULT_RULE_POINT_NINE_TEMPLATE, ...p9 });
      if (p10) this.rulePointTenTemplateState.set({ ...DEFAULT_RULE_POINT_TEN_TEMPLATE, ...p10 });

    } catch (error) {
      console.error('Błąd podczas ładowania szablonów reguł.', error);
    }
  }

  setLanguage(lang: string): void {
    void this.load(lang);
  }

  private async fetchTemplate<T>(filename: string): Promise<T | null> {
    try {
      return await firstValueFrom(this.http.get<T>(`/templates/${filename}`));
    } catch {
      // Ignore individual failures, return null to use default
      return null;
    }
  }
}

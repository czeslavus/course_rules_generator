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
  main: 'Przedmiot [[subjectType]] dla studentów studiów [[degreeLevel]]-go stopnia [[programmePart]]. [[prerequisitesLine]]',
  programmeDefault: 'na kierunku [[programme]]',
  programmeCommon:
    'części wspólnej kierunków Mechatronika i Automatyka Robotyka i Informatyka Przemysłowa',
  commonProgrammeValue: 'Część wspólna kierunku Mechatronika / ARiIP',
  prerequisitesProvided: 'Wymagania wstępne: [[prerequisites]].',
  prerequisitesNone: 'Brak wymagań wstępnych.',
};

const DEFAULT_RULE_POINT_TWO_TEMPLATE: RulePointTwoTemplate = {
  makeupRulesDefault:
    'Odrobienie zajęć z dnia usprawiedliwionej nieobecności możliwe jest z inną grupą realizującą przedmiot w terminie ustalonym z prowadzącym zajęcia lub koordynatorem przedmiotu.',
  lecture: 'Uczestnictwo w wykładach jest nieobowiązkowe.',
  base: 'Obecność na [[locative]] jest obowiązkowa. Dopuszcza się maksymalnie [[absences]]. Usprawiedliwienie nieobecności powinno nastąpić najpóźniej w ciągu tygodnia od zakończenia nieobecności. Odpowiedni dokument należy okazać lub przesłać e-mailem prowadzącemu zajęcia lub koordynatorowi przedmiotu.',
  locativeClasses: 'ćwiczeniach',
  locativeLaboratory: 'laboratorium',
  locativeProject: 'projekcie',
  locativeComputerClasses: 'ćwiczeniach komputerowych',
  locativeSeminar: 'seminarium',
  locativeLecture: 'wykładach',
  absences1: '1 nieusprawiedliwioną nieobecność',
  absences2To4: '[[count]] nieusprawiedliwione nieobecności',
  absencesMany: '[[count]] nieusprawiedliwionych nieobecności',
};

const DEFAULT_RULE_POINT_THREE_TEMPLATE: RulePointThreeTemplate = {
  lectureCredit:
    'Zaliczenie wykładu na podstawie kolokwium, z którego można otrzymać XX punktów. Do zaliczenia przedmiotu konieczne jest zdobycie min. 50% punktów.',
  lectureExam: 'Zaliczenie wykładu na podstawie egzaminu pisemnego składającego się z XX zadań.',
  project:
    'Zaliczenie zajęć projektowych na podstawie ocen z XX wykonywanych w trakcie semestru projektów.',
  laboratory:
    'Zaliczenie laboratorium na podstawie punktów zdobywanych za kolejne ćwiczenia (wymagane zdobycie min. 50% punktów).',
  computerClasses:
    'Zaliczenie ćwiczeń komputerowych na podstawie kolokwium, z którego można otrzymać XX punktów. Do zaliczenia przedmiotu konieczne jest zdobycie min. 50% punktów.',
  seminar:
    'Zaliczenie na podstawie prezentacji tematu pracy dyplomowej (33% oceny), prezentacji wybranego pytania dyplomowego (33% oceny) oraz opracowania wybranego pytania dyplomowego (34% oceny).',
  classes:
    'Zaliczenie ćwiczeń na podstawie dwóch kolokwiów, wymagane jest uzyskanie co najmniej 50% z każdego kolokwium.',
  typeLecture: 'Wykład',
  typeClasses: 'Ćwiczenia',
  typeLaboratory: 'Laboratorium',
  typeProject: 'Projekt',
  typeComputerClasses: 'Ćwiczenia komputerowe',
  typeSeminar: 'Seminarium',
  helperMaterials: ' Dopuszczone materiały i urządzenia pomocnicze: [[materials]].',
};

const DEFAULT_RULE_POINT_FOUR_TEMPLATE: RulePointFourTemplate = {
  labReportDefault:
    'sprawozdanie z ćwiczenia laboratoryjnego należy złożyć w ciągu tygodnia od jego wykonania',
  examSession: 'Terminy egzaminów z przedmiotu określa harmonogram sesji egzaminacyjnej.',
  randomEvents:
    'W przypadku zdarzeń losowych uniemożliwiających przeprowadzenie zaliczeń w terminach wskazanych w regulaminie prowadzący wyznaczy nowy termin z co najmniej tygodniowym wyprzedzeniem i poinformuje o nim studentów korzystając z platformy Leon.',
  colloquiumNone: '[[label]]: nie przewiduje się kolokwiów.',
  colloquium:
    '[[label]]: zaplanowano [[countText]]. Terminy (tydzień zajęć): [[terms]].',
  projectNone: 'Projekt: nie przewiduje się etapów pośrednich.',
  project:
    'Projekt: zaplanowano [[countText]]. Terminy etapów (tydzień zajęć): [[terms]].',
  laboratory: 'Laboratorium: [[text]]',
  computerClasses: 'Ćwiczenia komputerowe: [[text]]',
  seminar:
    'Seminarium: harmonogram weryfikacji osiągnięcia efektów uczenia się ustala prowadzący zajęcia.',
  weekPlural: 'tydzień', // Note: simplistic, context-dependent in Polish, but good enough for "tydzień X"
  typeLecture: 'Wykład',
  typeClasses: 'Ćwiczenia',
  typeProject: 'Projekt',
  singularColloquium: 'kolokwium',
  paucalColloquium: 'kolokwia',
  pluralColloquium: 'kolokwiów',
  singularStage: 'etap',
  paucalStage: 'etapy',
  pluralStage: 'etapów',
};

const DEFAULT_RULE_POINT_FIVE_TEMPLATE: RulePointFiveTemplate = {
  examDefault: 'Dodatkowy "zerowy" termin egzaminu odbędie się na ostatnim wykładzie',
  nonExamDefault: 'Dodatkowe terminy poza wskazanymi w pkt 4 nie są przewidziane',
};

const DEFAULT_RULE_POINT_SIX_TEMPLATE: RulePointSixTemplate = {
  defaultText: `Ocena końcowa wystawiana jest na podstawie sumy punktów z kolokwium i zadań według zależności:
% zdobytych punktów         Ocena
< 50% - 60% >                          3,0
( 60% - 70% >                          3,5
( 70% - 80% >                          4,0
( 80% - 90% >                          4,5
( 90% - 100% >                        5,0`,
};

const DEFAULT_RULE_POINT_SEVEN_TEMPLATE: RulePointSevenTemplate = {
  defaultTemplate:
    'Oceny cząstkowe z przedmiotu publikowane są w systemie [[SYSTEM]] w przeciągu tygodnia od zakończenia ocenianej aktywności. Wynik końcowy przedmiotu jest publikowany w systeme USOS w terminie 7 dni od ostatniego sprawdzianu, nie później jednak niż do ostatniego dnia  sesji.',
};

const DEFAULT_RULE_POINT_EIGHT_TEMPLATE: RulePointEightTemplate = {
  examDefault:
    'Termin egzaminu poprawkowego określa harmonogram wrześniowej sesji egzaminacyjnej',
  nonExamDefault: 'W przedmiocie nie przewiduje się dodatkowych terminów poprawkowych',
};

const DEFAULT_RULE_POINT_NINE_TEMPLATE: RulePointNineTemplate = {
  text: 'W przypadku otrzymania oceny negatywnej z przedmiotu, jego zaliczenie możliwe jest w kolejnej jego edycji, zgodnie z decyzją Dziekana Wydziału',
};

const DEFAULT_RULE_POINT_TEN_TEMPLATE: RulePointTenTemplate = {
  text: 'Osoby z niepełnosprawnościami proszone są o zgłaszanie potrzeby wsparcia prowadzącemu zajęcia lub koordynatorowi przedmiotu',
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

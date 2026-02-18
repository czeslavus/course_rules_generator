import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { LanguageService } from '../../core/language.service';
import { TranslateModule } from '@ngx-translate/core';
import { RulePointOneComponent } from '../rules/point-one/rule-point-one.component';
import {
  ClassTypeId,
  ClassTypeOption,
  RulePointTwoComponent,
} from '../rules/point-two/rule-point-two.component';
import { RulePointNineComponent } from '../rules/point-nine/rule-point-nine.component';
import { RulePointThreeComponent } from '../rules/point-three/rule-point-three.component';
import { RulePointFourComponent } from '../rules/point-four/rule-point-four.component';
import { RulePointFiveComponent } from '../rules/point-five/rule-point-five.component';
import { RulePointSixComponent } from '../rules/point-six/rule-point-six.component';
import { RulePointSevenComponent } from '../rules/point-seven/rule-point-seven.component';
import { RulePointEightComponent } from '../rules/point-eight/rule-point-eight.component';
import { RulePointTenComponent } from '../rules/point-ten/rule-point-ten.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RulePointOneComponent,
    RulePointTwoComponent,
    RulePointThreeComponent,
    RulePointFourComponent,
    RulePointFiveComponent,
    RulePointSixComponent,
    RulePointSevenComponent,
    RulePointEightComponent,
    RulePointNineComponent,
    RulePointTenComponent,
    TranslateModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly languageService = inject(LanguageService);

  protected readonly classTypeOptions: ClassTypeOption[] = [
    { id: 'lecture', label: 'DASHBOARD.CLASS_TYPES.LECTURE' },
    { id: 'classes', label: 'DASHBOARD.CLASS_TYPES.CLASSES' },
    { id: 'laboratory', label: 'DASHBOARD.CLASS_TYPES.LABORATORY' },
    { id: 'project', label: 'DASHBOARD.CLASS_TYPES.PROJECT' },
    { id: 'computer_classes', label: 'DASHBOARD.CLASS_TYPES.COMPUTER_CLASSES' },
    { id: 'seminar', label: 'DASHBOARD.CLASS_TYPES.SEMINAR' },
  ];

  private readonly selectedTypeIds = signal<ClassTypeId[]>(['lecture']);
  private readonly examSubjectState = signal(false);

  protected readonly selectedClassTypes = computed(() => {
    const selectedIds = this.selectedTypeIds();
    return this.classTypeOptions.filter((option) => selectedIds.includes(option.id));
  });

  protected readonly isExamSubject = computed(() => this.examSubjectState());

  protected toggleClassType(typeId: ClassTypeId, checked: boolean): void {
    this.selectedTypeIds.update((ids) => {
      if (checked) {
        return ids.includes(typeId) ? ids : [...ids, typeId];
      }

      return ids.filter((id) => id !== typeId);
    });
  }

  protected isClassTypeSelected(typeId: ClassTypeId): boolean {
    return this.selectedTypeIds().includes(typeId);
  }

  protected toggleExamSubject(checked: boolean): void {
    this.examSubjectState.set(checked);
  }
}

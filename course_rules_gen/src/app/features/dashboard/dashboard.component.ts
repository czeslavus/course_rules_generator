import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { RulePointOneComponent } from '../rules/point-one/rule-point-one.component';
import {
  ClassTypeId,
  ClassTypeOption,
  RulePointTwoComponent,
} from '../rules/point-two/rule-point-two.component';
import { RulePointNineComponent } from '../rules/point-nine/rule-point-nine.component';
import { RulePointThreeComponent } from '../rules/point-three/rule-point-three.component';
import { RulePointTenComponent } from '../rules/point-ten/rule-point-ten.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RulePointOneComponent,
    RulePointTwoComponent,
    RulePointThreeComponent,
    RulePointNineComponent,
    RulePointTenComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);

  protected readonly classTypeOptions: ClassTypeOption[] = [
    { id: 'lecture', label: 'wykład' },
    { id: 'classes', label: 'ćwiczenia' },
    { id: 'laboratory', label: 'laboratorium' },
    { id: 'project', label: 'projekt' },
    { id: 'computer_classes', label: 'ćwiczenia komputerowe' },
    { id: 'seminar', label: 'seminarium' },
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

  protected logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}

import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { RulePointOneComponent } from '../rules/point-one/rule-point-one.component';

@Component({
  selector: 'app-dashboard',
  imports: [RulePointOneComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);

  protected logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }
}

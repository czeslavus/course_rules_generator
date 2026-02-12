import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rule-point-ten',
  imports: [FormsModule],
  templateUrl: './rule-point-ten.component.html',
})
export class RulePointTenComponent {
  private readonly textState = signal(
    'Osoby z niepełnosprawnościami proszone są o zgłaszanie potrzeby wsparcia prowadzącemu zajęcia lub koordynatorowi przedmiotu',
  );

  protected readonly text = computed(() => this.textState());

  protected updateText(value: string): void {
    this.textState.set(value);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.text());
  }
}

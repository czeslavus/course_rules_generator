import { CommonModule } from '@angular/common';
import { Component, computed, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type PublicationSystem = 'USOS' | 'LeON';

@Component({
  selector: 'app-rule-point-seven',
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-point-seven.component.html',
})
export class RulePointSevenComponent {
  private static readonly DEFAULT_TEMPLATE =
    'Oceny cząstkowe z przedmiotu publikowane są w systemie [[SYSTEM]] w przeciągu tygodnia od zakończenia ocenianej aktywności. Wynik końcowy przedmiotu jest publikowany w systeme USOS w terminie 7 dni od ostatniego sprawdzianu, nie później jednak niż do ostatniego dnia  sesji.';

  protected readonly systemState = signal<PublicationSystem>('USOS');
  protected readonly textState = signal<string>(this.defaultText(this.systemState()));

  constructor() {
    effect(() => {
      const system = this.systemState();
      const nextDefault = this.defaultText(system);
      const previousDefault = this.defaultText(system === 'USOS' ? 'LeON' : 'USOS');
      const current = this.textState();
      const isKnownDefault =
        current === this.defaultText('USOS') || current === this.defaultText('LeON');

      if (current !== nextDefault && (current === previousDefault || isKnownDefault)) {
        this.textState.set(nextDefault);
      }
    });
  }

  protected readonly generatedText = computed(() => this.textState().trim());

  protected updateSystem(system: PublicationSystem): void {
    this.systemState.set(system);
  }

  protected updateText(text: string): void {
    this.textState.set(text);
  }

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.generatedText());
  }

  private defaultText(system: PublicationSystem): string {
    return RulePointSevenComponent.DEFAULT_TEMPLATE.replace('[[SYSTEM]]', system);
  }
}

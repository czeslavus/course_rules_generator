import { Component } from '@angular/core';

@Component({
  selector: 'app-rule-point-nine',
  templateUrl: './rule-point-nine.component.html',
})
export class RulePointNineComponent {
  protected readonly text =
    'W przypadku otrzymania oceny negatywnej z przedmiotu, jego zaliczenie możliwe jest w kolejnej jego edycji, zgodnie z decyzją Dziekana Wydziału';

  protected copyGeneratedText(): void {
    void navigator.clipboard.writeText(this.text);
  }
}

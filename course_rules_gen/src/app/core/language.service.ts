import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RuleTemplatesService } from './rule-templates.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private readonly translate = inject(TranslateService);
    private readonly rulesTemplates = inject(RuleTemplatesService);

    readonly currentLang = signal<string>('pl');

    constructor() {
        this.translate.addLangs(['pl', 'en']);
        this.translate.setDefaultLang('pl');
        this.use('pl');
    }

    use(lang: string): void {
        if (['pl', 'en'].includes(lang)) {
            this.currentLang.set(lang);
            this.translate.use(lang).subscribe({
                next: () => console.log(`Language switched to ${lang}`),
                error: (err) => console.error(`Failed to load ${lang} translations`, err)
            });
            this.rulesTemplates.setLanguage(lang);
        }
    }
}

import { Injectable, signal, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { RuleTemplatesService } from './rule-templates.service';

@Injectable({
    providedIn: 'root',
})
export class LanguageService {
    private readonly translate = inject(TranslateService);
    private readonly title = inject(Title);
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
                next: () => {
                    console.log(`Language switched to ${lang}`);
                    this.updatePageTitle();
                },
                error: (err) => console.error(`Failed to load ${lang} translations`, err)
            });
            this.rulesTemplates.setLanguage(lang);
        }
    }

    private updatePageTitle(): void {
        const pageTitle = this.translate.instant('APP.TITLE');
        this.title.setTitle(pageTitle !== 'APP.TITLE' ? pageTitle : 'Generator regulaminów');
    }
}

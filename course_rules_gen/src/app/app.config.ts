import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom,
} from '@angular/core';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/jwt.interceptor';
import { mockAuthInterceptor } from './core/mock-auth.interceptor';
import { RuleTemplatesService } from './core/rule-templates.service';
import { LanguageService } from './core/language.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([mockAuthInterceptor, jwtInterceptor])),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'pl',
      })
    ),
    provideTranslateHttpLoader({
      useHttpBackend: true,
      prefix: 'i18n/',
      suffix: '.json',
    }),
    provideAppInitializer(() => {
      const langService = inject(LanguageService);
      // LanguageService constructor already sets default, but injecting it ensures it starts.
      return;
    }),
    provideAppInitializer(() => inject(RuleTemplatesService).load()),
  ],
};

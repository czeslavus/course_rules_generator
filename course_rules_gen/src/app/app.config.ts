import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/jwt.interceptor';
import { mockAuthInterceptor } from './core/mock-auth.interceptor';
import { RuleTemplatesService } from './core/rule-templates.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([mockAuthInterceptor, jwtInterceptor])),
    provideAppInitializer(() => inject(RuleTemplatesService).load()),
  ],
};

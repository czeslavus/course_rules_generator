import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of, throwError } from 'rxjs';

const MOCK_USERNAME = 'mchtr';
const MOCK_PASSWORD = 'genrules1';
const MOCK_TOKEN = 'mock-jwt-token-for-local-dev';

export const mockAuthInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.url === '/api/auth/login' && request.method === 'POST') {
    const { username, password } = request.body as { username?: string; password?: string };

    if (username === MOCK_USERNAME && password === MOCK_PASSWORD) {
      return of(
        new HttpResponse({
          status: 200,
          body: {
            token: MOCK_TOKEN,
            username,
          },
        }),
      ).pipe(delay(250));
    }

    return throwError(() => ({
      status: 401,
      error: { message: 'Nieprawidłowa nazwa użytkownika lub hasło.' },
    }));
  }

  return next(request);
};

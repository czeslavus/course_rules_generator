import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
  username: string;
}

interface AuthState {
  token: string | null;
  username: string | null;
}

const AUTH_STORAGE_KEY = 'course-rules-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly state = signal<AuthState>(this.getInitialState());

  readonly token = computed(() => this.state().token);
  readonly username = computed(() => this.state().username);
  readonly isAuthenticated = computed(() => !!this.state().token);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { username, password }).pipe(
      tap((response) => {
        const nextState: AuthState = { token: response.token, username: response.username };
        this.state.set(nextState);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextState));
      }),
    );
  }

  logout(): void {
    this.state.set({ token: null, username: null });
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private getInitialState(): AuthState {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!stored) {
      return { token: null, username: null };
    }

    try {
      const parsed = JSON.parse(stored) as AuthState;
      return {
        token: parsed.token ?? null,
        username: parsed.username ?? null,
      };
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return { token: null, username: null };
    }
  }
}

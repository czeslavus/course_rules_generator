# course_rules_generator
Program do generowania regulaminów na wydziale Mechatroniki.

## Publikacja testowa w GitHub Pages
Repozytorium ma skonfigurowany workflow GitHub Actions do automatycznego wdrożenia aplikacji Angular do GitHub Pages (`.github/workflows/deploy-pages.yml`).

Docelowy adres aplikacji:

`https://<OWNER>.github.io/course_rules_generator/`

Gdzie `<OWNER>` to nazwa konta lub organizacji właściciela repozytorium na GitHub.

## Gdy zamiast aplikacji wyświetla się `README.md`
To oznacza, że GitHub Pages publikuje zawartość gałęzi (`Deploy from a branch`) zamiast artefaktu z GitHub Actions.

Aby to naprawić:
1. Wejdź w **Settings → Pages**.
2. W sekcji **Build and deployment** ustaw **Source: GitHub Actions**.
3. Wejdź do **Actions → Deploy Angular app to GitHub Pages** i kliknij **Run workflow**.
4. Wybierz branch (`main`, `master` albo `work`) i uruchom workflow.

Po zielonym deployu odśwież stronę `https://<OWNER>.github.io/course_rules_generator/` (najlepiej `Ctrl+F5`).

## Błąd `Get Pages site failed. Not Found` w workflow
Jeśli w kroku `Configure Pages` pojawia się błąd `Get Pages site failed. Not Found`, oznacza to najczęściej, że GitHub Pages nie było jeszcze włączone dla repozytorium.

Workflow ma teraz ustawione automatyczne włączenie Pages (`enablement: true`), ale jeśli błąd pojawił się wcześniej, uruchom workflow ponownie:
1. **Actions → Deploy Angular app to GitHub Pages**
2. **Run workflow**
3. Wybierz branch (`main`, `master` albo `work`) i uruchom

Jeśli nadal nie działa, sprawdź w **Settings → Pages**, czy źródło to **GitHub Actions**.

# course_rules_generator
Program do generowania regulaminów na wydziale Mechatroniki.

## Publikacja testowa w GitHub Pages
Repozytorium ma skonfigurowany workflow GitHub Actions do automatycznego wdrożenia aplikacji Angular do GitHub Pages (`.github/workflows/deploy-pages.yml`).

Po wypchnięciu zmian do gałęzi `main`, `master` lub `work` aplikacja będzie publikowana pod adresem:

`https://<OWNER>.github.io/course_rules_generator/`

gdzie `<OWNER>` to nazwa konta lub organizacji właściciela repozytorium na GitHub.

> Uwaga: w tym środowisku nie ma skonfigurowanego zdalnego repozytorium (`git remote`), więc nie mogę fizycznie wypchnąć zmian na GitHub z poziomu kontenera. Konfiguracja wdrożenia jest jednak gotowa.

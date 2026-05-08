# Development

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| HTML5 | — | Page markup |
| CSS3 | — | Styling |
| JavaScript (ES2020+) | — | Interactivity |
| [Bootstrap](https://getbootstrap.com/) | 5.3.8 | UI framework (CDN) |
| [Google Fonts — Outfit](https://fonts.google.com/specimen/Outfit) | — | Typography (CDN) |
| [html-validate](https://html-validate.org/) | latest | HTML linting |
| [Stylelint](https://stylelint.io/) | latest | CSS linting |
| GitHub Actions | — | CI/CD |
| GitHub Pages | — | Hosting |

---

## Running Locally

No build step is needed. Open either HTML file directly in a browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve with any static file server, e.g. Python
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## Validation

HTML and CSS are validated using Node.js tools. Install them without saving to `package.json`:

```bash
npm install --no-save html-validate stylelint stylelint-config-standard
```

Run validators:

```bash
# Validate all HTML files
npx html-validate "**/*.html"

# Validate all CSS files
npx stylelint "**/*.css"
```

Configuration files:
- **`.htmlvalidate.json`** — rules for html-validate
- **`.stylelintrc.json`** — extends `stylelint-config-standard`

---

## CI/CD (GitHub Actions)

The workflow file `.github/workflows/validate.yml` runs on every push to `main` that touches HTML, CSS, JS, or image files.

### Jobs

| Job | Trigger | Description |
|---|---|---|
| `detect-changes` | Always | Identifies which file types changed using `dorny/paths-filter` |
| `validate-html` | HTML files changed | Runs html-validate on all `*.html` files |
| `validate-css` | CSS files changed | Runs Stylelint on all `*.css` files |
| `deploy` | Site files changed + validators passed | Deploys the site to GitHub Pages |

### Deployment

The `deploy` job runs only when:
- At least one site file (HTML, CSS, JS, or image) changed, **and**
- All applicable validators passed (HTML validator if HTML changed, CSS validator if CSS changed).

The entire repository root is uploaded as the Pages artifact, so all files are served as-is.

### Concurrency

The workflow uses a `pages-<ref>` concurrency group with `cancel-in-progress: true`, so a new push cancels any in-progress deployment for the same branch.

---

## Contributing

1. Edit HTML, CSS, or JS files directly — no transpilation needed.
2. Validate your changes locally before pushing (see [Validation](#validation) above).
3. Open a pull request targeting `main`; the CI workflow will run automatically.
4. Merging to `main` triggers an automatic deployment to GitHub Pages.

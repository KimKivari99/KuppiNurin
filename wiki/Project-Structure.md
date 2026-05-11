# Project Structure

KuppiNurin is a plain static website — no build step or package manager is required to run it.

```
KuppiNurin/
├── index.html          # Home page
├── index_style.css     # Styles for the home page
├── menu.html           # Menu page
├── menu_style.css      # Styles for the menu page
├── app.js              # Shared JavaScript for all pages
├── images/             # Product and hero images
├── .htmlvalidate.json  # HTML validation config (html-validate)
├── .stylelintrc.json   # CSS linting config (Stylelint)
└── .github/
    └── workflows/
        └── validate.yml  # CI/CD: validate HTML/CSS and deploy to GitHub Pages
```

## File Descriptions

### `index.html`
The home page. Contains:
- Sticky top navigation bar
- Hero banner with the café name and tagline
- Opening hours and business description
- Rotating carousel showcasing the café's three core offerings (quality coffee, fresh pastries, catering)
- Menu preview carousel with deep-links to individual products on `menu.html`
- Catering (pitopalvelu) section with example party menu and booking info
- Footer

### `menu.html`
The full menu page. Contains:
- Sticky top navigation bar (shared structure with `index.html`)
- Hero banner with the "Menu" title
- Tabbed product grid (Bootstrap tabs) with four categories:
  - **Kahvit** — Coffees
  - **Leivonnaiset** — Pastries
  - **Erikoisjuomat** — Special drinks
  - **Suolaiset** — Savory items
- Footer

### `app.js`
Single shared script loaded by both pages. Responsibilities:
- Hide/show the sticky navbar based on scroll direction
- Restore the navbar on mouse hover
- Prevent `href="#"` placeholder links from jumping the page to the top
- Mark the current page's nav link as active
- Keyboard-accessible tab navigation (arrow keys, Home, End) on the menu page
- Deep-link support via the `?product=` URL query parameter (open and scroll to a specific product)
- Toggle product description overlays by click or keyboard

### `index_style.css` / `menu_style.css`
Page-specific stylesheets. Both import the Google Fonts *Outfit* typeface and extend the Bootstrap 5 base theme with custom layout, colours, and component overrides.

### `images/`
All product photos referenced in `menu.html` and `index.html`. File names follow the pattern `menu_<product>.jpg`.

### `.htmlvalidate.json`
Configuration for the [html-validate](https://html-validate.org/) tool, which checks HTML files against the rules defined here.

### `.stylelintrc.json`
Configuration for [Stylelint](https://stylelint.io/), extending `stylelint-config-standard`.

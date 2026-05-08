# Pages and Features

## Pages

### Home (`index.html`)

The landing page presents the café and its key services.

| Section | Description |
|---|---|
| Hero | Full-width banner with café name and tagline |
| Opening hours | Business hours and short intro |
| About carousel | Three slides describing coffee quality, pastries, and catering |
| Menu preview | Carousel with quick-links to four product categories on the menu page |
| Catering | Tabbed card with example party menu and booking details |
| Footer | Navigation links and copyright notice |

### Menu (`menu.html`)

Displays the full product catalog in a tabbed layout.

| Tab | Finnish label | Contents |
|---|---|---|
| Coffees | Kahvit | 8 espresso-based and brewed coffees |
| Pastries | Leivonnaiset | 8 sweet baked goods |
| Special drinks | Erikoisjuomat | 8 specialty hot and cold drinks |
| Savory | Suolaiset | 8 savory sandwiches and pastries |

Each product card shows a photo, name, price, and a short description that appears on hover or focus.

---

## JavaScript Features (`app.js`)

### Sticky Navbar Behavior

The top navigation bar hides automatically when the user scrolls **down** and reappears when they scroll **up** or hover over the bar. This keeps content in view while still allowing quick access to navigation.

### Active Navigation Link

On page load, the script compares `window.location.pathname` against each nav link's `href` and adds the `active` class and `aria-current="page"` attribute to the matching link. Nav items that use `href="#"` (i.e., placeholder links on their own page) are resolved by matching the link label to a known page alias.

### Keyboard-Accessible Tabs (Menu Page)

The Bootstrap tab row on the menu page supports full keyboard navigation:

| Key | Action |
|---|---|
| `ArrowRight` | Move focus to next tab and activate it |
| `ArrowLeft` | Move focus to previous tab and activate it |
| `Home` | Jump to the first tab |
| `End` | Jump to the last tab |
| `Enter` / `Space` | Activate the focused tab |

### Product Deep-Linking (`?product=`)

Any page can link directly to a specific product on the menu using the `?product=` query parameter. For example:

```
menu.html?product=chai%20latte
```

On load, the script:
1. Reads the `product` value from the URL.
2. Normalizes the value (lowercase, strips accents and non-alphanumeric characters) and finds the matching product card.
3. Activates the correct category tab.
4. Scrolls to the product card with an offset for the sticky navbar.
5. Briefly highlights the card, then collapses it after ~2.2 seconds.
6. Removes the query string from the URL so a page refresh does not re-apply the state.

The normalization step ensures flexible matching: `"Chai Latte"`, `"chai-latte"`, and `"CHAI  LATTE"` all resolve to the same product.

### Product Card Description Toggle

Each product card on the menu page has a description overlay. Clicking or pressing `Enter`/`Space` on a product title opens its description; clicking another title closes the previous one and opens the new one. Only one card can be expanded at a time.

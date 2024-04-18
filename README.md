# medium-duckdb-ex1

An example of using DuckDB in the browser.

## Step 1 - Create a Vite React Project with Material UI

```bash
npm create vite@latest medium-duckdb-ex1 -- --template react-ts
cd medium-duckdb-ex1
git init
npm install
# DuckDB, the wasm shell, and the typescript flavour of Apache Arrow.
npm install --save @jetblack/duckdb-react @apache-arrow/ts @duckdb/duckdb-wasm-shell
# Material UI and supporting libraries.
npm install --save @mui/material @emotion/react @emotion/styled @mui/icons-material @mui/x-date-pickers react-hook-form react-hook-form-mui @jetblack/material-data-table @fontsource/material-icons @fontsource/roboto
# The Opendatasoft library
npm install --save @opendatasoft/api-client
```

Add prettier config to `package.json`:

```json
{
  // ...
  "prettier": {
    "tabWidth": 2,
    "semi": false,
    "singleQuote": true,
    "trailingComma": "none",
    "printWidth": 80,
    "arrowParens": "avoid",
    "bracketsSpacing": true,
    "bracketSameLine": false
  }
}
```

Change `main.tsx` to:

```ts
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import '@fontsource/material-icons'

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(<App />)
```

Change `index.css` to:

```css
.material-icons {
  font-family: 'Material Icons';
  font-weight: normal;
  font-style: normal;
  font-size: 24px;  /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: 'liga';
}
```

Change `App.tsx` to:

```ts
export default function App() {
  return <div>App</div>
}
```

Remove the unreferenced file `app.css`.

```bash
npm install @opendatasoft/api-client
```

##
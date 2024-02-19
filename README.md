# medium-duckdb-ex1

An example of using DuckDB in the browser.

```bash
npm create vite@latest medium-duckdb-ex1 -- --template react-ts
cd medium-duckdb-ex1
git init
npm install
npm install --save @jetblack/duckdb-react
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
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

Remove the unreferenced file `index.css`

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

https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/table/?disjunctive.cou_name_en&sort=name
https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000


WITH x AS (
  SELECT
    RANK() OVER (PARTITION BY country ORDER BY population DESC) as rank,
    country,
    name,
    population
  FROM
    city
  GROUP BY
    country,
    name,
    population
)
SELECT
  *
FROM
  x
WHERE
  rank <= 3
AND
  population > 1000000
ORDER BY
  country,
  name,
  population DESC

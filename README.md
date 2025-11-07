# Companies Directory – Frontend (React + Vite + TS)

Modern, responsive UI to browse companies with filters (name, location, industry), sorting (name), and pagination. Uses a mock API (static JSON + simulated latency/errors).

## Run Locally

```bash
# Dependencies
npm install

# Start dev server
npm run dev
# Open: http://localhost:5173
```

## Tech
- React 18 + TypeScript + Vite
- Tailwind CSS (custom brand palette)
- Context API for state (filters, sorting, pagination)
- Mock fetch from `public/companies.json`

## Project Structure
```
src/
  components/      # UI components (filters, list, table/cards, pagination)
  context/         # Directory state (filters/sort/pagination)
  services/        # mockApi (latency + error simulation)
  types.ts

```

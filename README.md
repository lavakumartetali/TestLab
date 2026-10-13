# TestLab Automation Playground

A React + Vite browser automation playground with an Express REST API for practicing API tests. The API uses seeded in-memory data; no database is required.

## Run locally

```sh
npm install
npm run dev
```

Vite serves the frontend at `http://localhost:5173` and proxies `/api` requests to the Express server at `http://localhost:3001`. Open the frontend URL; the app starts on the login page.

**Demo login**

- Email: `demo@testlab.dev`
- Password: `Test123!`

## API workbench

After login, open **API workbench** from the sidebar. The workbench sends requests to the running Express API and displays HTTP status, response time, response size, response headers, and response body. It includes ready-made requests for success, validation errors, delayed responses, and simulated server failures.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Service health and uptime |
| `GET` | `/api/users?page=1&limit=5&search=qa&sort=name&order=asc` | Search, sort, and paginate users |
| `POST` | `/api/users` | Create a user; returns `201` |
| `GET` | `/api/users/:id` | Read a user |
| `PUT` | `/api/users/:id` | Replace a user |
| `PATCH` | `/api/users/:id` | Update selected user fields |
| `DELETE` | `/api/users/:id` | Delete a user; returns `204` |
| `POST` | `/api/auth/login` | Demo credential validation and sample token |
| Any | `/api/test/echo` | Echo method, query, headers, and JSON body |
| `GET` | `/api/test/headers` | Inspect request headers |
| Any | `/api/test/delay/:milliseconds` | Delayed response (0–10,000 ms) |
| Any | `/api/test/status/:code` | Intentional 4xx/5xx response |
| Any | `/api/test/error` | Intentional `500` response |
| `GET` | `/api/test/download/sample.csv` | Download CSV fixture |
| `GET` | `/api/test/download/sample.json` | Download JSON fixture |

Run the production frontend and API together with `npm run build`, then `npm start`. The production server serves the built React app and the API from port 3001.

## Deployment

**Recommended: deploy the full app as a Render Web Service.** Create a Web Service from this repository with the repository root as the root directory, then configure:

- Build command: `npm install && npm run build`
- Start command: `npm start`
- Health check path: `/api/health`

Render provides the `PORT` environment variable; the server uses it automatically. Express serves both the built React frontend and API from the same service, so no separate frontend/API URLs or CORS setup are needed.

Vercel is also suitable for the frontend if you later want to split the deployment. Select the **Vite** Framework Preset (not Express), set the build command to `npm run build` and output directory to `dist`, then host the API separately and configure `VITE_API_BASE_URL` and `CORS_ORIGINS` for the two service origins.

**Important:** the API's mutable demo records live in process memory. They reset on restarts and are not shared reliably between serverless instances. This is suitable for a playground, not durable user data. Vercel's serverless execution is therefore not recommended for hosting this in-memory API; use a persistent Node web service such as Render, or add a database before using serverless hosting.

## Other browser test scenarios

- **Dynamic elements:** visibility, enabled/disabled controls, delayed content, a timed spinner/progress bar, changing text, and hover/focus states.
- **Data tables:** local demo search, sorting, pagination, selection, and add/remove records.
- **Dialogs & alerts:** native browser dialogs, custom modal, toast notifications, and a separate popup page.
- **Form widgets:** selects, radio groups, checkboxes, dates, autocomplete, range input, and local file selection.
- **Browser tools:** sandboxed iframe navigation, downloads, hover targets, drag and drop, clipboard interaction, and external links.
- **Automation code:** full-playground starter examples for Selenium with Python and Java, and Playwright with Python, Java, JavaScript, and TypeScript. Each example verifies that the signed-in user is stored in `sessionStorage` under `testlab-user`, then directly tests the API health endpoint, filtered user list, demo API login/token, and echo response. The Selenium Python example also installs `requests` for its direct API calls. Each example includes its test-file path, project folder structure, dependency setup, and run command. Open **Automation code** after signing in and set `TESTLAB_URL` to `http://localhost:5173` or your deployed Render URL before running it.
- **Appearance:** light/dark theme toggle on the login and workspace pages, saved across visits and initially matched to the system preference. Page entrances and dashboard cards animate gently; reduced-motion preferences are respected.

## Notes

- Login to the playground remains a client-side demo; it stores the user in tab-scoped `sessionStorage` and does not create a durable account. The separate `/api/auth/login` endpoint is available for practicing API authentication requests.
- API data is held in memory and table-demo edits use browser storage. API changes reset whenever the API process restarts.
- This intentionally permissive CORS/API setup and demo token are for local testing only, not production authentication.
- File selections stay local to the browser. Example download endpoints return generated sample files.

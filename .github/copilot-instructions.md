## Repo snapshot

This repository contains a Flask backend (Backend/) and a React + Vite frontend (astrolink_frontend/).

- Backend: Flask app entry `Backend/app.py`. Blueprints live in `Backend/routes/` (auth, products, projects, testimonials, uploads). DB access is via `flask_mysqldb` configured in `Backend/extensions.py` and database settings in `Backend/config.py`.
- Frontend: React + Vite at `astrolink_frontend/`. Dev server runs on port 5173 (`npm run dev`).

## High-level architecture

- Single-process Flask backend serving JSON APIs under `/api/*`.
- Blueprints are registered in `app.py` with prefixes:
  - `/api/auth` (auth_bp)
  - `/api/products` (products_bp)
  - `/api/projects` (projects_bp)
  - `/api/testimonials` (testimonials_bp)
  - `/api/uploads` (upload_bp)
- File uploads are stored in `Backend/uploads` and served by `app.py` at `/uploads/<filename>`.
- MySQL is used as the persistent store. `Backend/setup_db.py` contains the DDL for all tables.

## Developer workflows & quick commands

- Backend virtualenv & run (Windows PowerShell):
  - Create venv: `python -m venv venv` (if not present)
  - Activate: `venv\Scripts\Activate` (PowerShell)
  - Install: `pip install -r Backend/requirements.txt`
  - Run app: `py Backend/app.py` (app runs with debug=True)

- Frontend:
  - Install: `cd astrolink_frontend; npm install`
  - Dev server: `npm run dev` (default origin http://localhost:5173)

- DB bootstrap: `py Backend/setup_db.py` (creates DB and all tables).

## Project-specific conventions and patterns

- Routing & strict slashes: `app.url_map.strict_slashes = False` is set in `app.py` so endpoints should accept both trailing and non-trailing slash forms. Blueprints often set `strict_slashes=False` as well.
- DB cursors return dictionaries (see `config.MYSQL_CURSORCLASS = 'DictCursor'`). Expect JSON responses where each row is an object.
- Upload handling: `projects` route accepts multipart form uploads. The backend saves files to `app.config['UPLOAD_FOLDER']` and stores `image_url` like `/uploads/<filename>` in the DB. Frontend should prefix that with the backend origin to render images (e.g., `http://127.0.0.1:5000/uploads/<filename>`).
- CORS: `flask_cors` is configured in `app.py` for `/api/*` and also re-initialized in `extensions.init_extensions` — be careful not to duplicate or reconfigure CORS inconsistently.

## Integration points & external dependencies

- MySQL server expected locally (config shows `MYSQL_HOST=localhost`, user `Patrick`, password `27.drbatman`, DB `astrolinkIT`/`AstrolinkIT` depending on script). Verify credentials and DB name case-sensitivity on your system.
- Flask extensions: `Flask-MySQLdb`, `flask-cors`, `Flask-JWT-Extended` are used.

## Common tasks for AI agents

- When adding endpoints, register new blueprints in `Backend/app.py` and ensure URL prefix uses `/api/<resource>`.
- For uploads:
  - Save files to `current_app.config['UPLOAD_FOLDER']` and store `/uploads/<filename>` in DB.
  - Ensure `app.py` exposes `@app.route('/uploads/<filename>')` using `send_from_directory`.
- When changing DB schema, update `Backend/setup_db.py` and include migration notes in PR description.

## Patterns & examples from the codebase

- Example project insert (routes/projects.py):
  - Accepts JSON or multipart form-data, saves file, avoids filename collisions, stores `image_url`.
- Example DB usage: open cursor via `cur = mysql.connection.cursor()`, execute queries, `mysql.connection.commit()` and `cur.close()`.

## Tests & linters

- No automated test suite detected. Frontend contains ESLint setup and `npm run lint`.

## Safety notes for contributors

- Do not commit credentials. `Backend/config.py` currently contains hard-coded credentials — avoid changing them in public commits. Prefer environment variables in PRs.

## If something is missing

- If local setup fails, check:
  - MySQL server is running and accessible with credentials from `Backend/config.py`.
  - `UPLOAD_FOLDER` exists or `app.py` can create it.

---

If you want, I can merge this into an existing `.github/copilot-instructions.md` or adjust tone/length — tell me any missing pieces or workflows to include.

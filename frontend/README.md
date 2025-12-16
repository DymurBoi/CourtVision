# CourtVision — Deployment & Run Guide

This repository contains the frontend (React) and backend (Spring Boot) for CourtVision.

This README collects deployment steps, configuration values that are present in the source, and safe, copy-paste-ready commands for common tasks. Where the project already contains concrete values, this guide uses them and points out places you should change before production.

NOTE: Do not store production secrets or credentials in source control. The files in this repo show example values; change them before deploying to production.

---

## Table of contents
- Overview
- What we already know from the repo
- Backend (Spring Boot) deployment
- Database setup (MySQL)
- Frontend (React) deployment
- Adding 12 players (SQL and API examples)
- Test accounts (dummy)
- Troubleshooting & verification

---

## Overview

This project has the following pieces:
- Backend: Spring Boot application located in `backend/CourtVision` (Maven project, Java 17)
- Frontend: React app located in `frontend/` (Create React App)
- Database: MySQL/MariaDB (JDBC configured in `application.properties`)

The repo already contains production-like values in a few places; the README below documents them and explains how to change or use them.

---

## What the code already contains (values discovered)

- Backend database URL (from `backend/CourtVision/src/main/resources/application.properties`):

	`spring.datasource.url=jdbc:mysql://13.239.65.62:3306/courtvision`

- Backend DB credentials (present in repo — change these before production):

	`spring.datasource.username=root`

	`spring.datasource.password=root`

- Backend build coordinates (from `pom.xml`):

	- ArtifactId: `CourtVision`
	- Version: `0.0.1-SNAPSHOT`
	- Expected JAR name after `mvn package`: `CourtVision-0.0.1-SNAPSHOT.jar`

- Frontend API base URL (from `frontend/src/utils/axiosConfig.js`):

	`http://13.239.65.62:8080/api`

These values are used in the repo; change them as required for your environment.

---

## Backend Deployment (Spring Boot)

Prerequisites
- Java 17+
- Maven (for building the JAR)
- MySQL or MariaDB server reachable by the backend

Build and run steps (local or server)

1) Build the JAR locally from the backend folder:

```bash
cd backend/CourtVision
mvn clean package -DskipTests
# the built JAR will be in target/CourtVision-0.0.1-SNAPSHOT.jar
```

2) Transfer the JAR to your server (example uses SSH SCP). Replace the IP or hostname if different; the repo uses `13.239.65.62` in configuration examples.

Windows (PowerShell / CMD) example using your PEM/key file (adjust path and user for your server):

```powershell
scp -i "C:\path\to\your-key.pem" target\CourtVision-0.0.1-SNAPSHOT.jar ec2-user@13.239.65.62:/home/ec2-user/
```

3) Start the app on the server (example uses a background run):

```bash
# on the server
nohup java -jar /home/ec2-user/CourtVision-0.0.1-SNAPSHOT.jar > app.log 2>&1 &
tail -f app.log
```

4) Verify the app is reachable (default configured port is `8080`):

Open: `http://13.239.65.62:8080/` or test an API endpoint:

```bash
curl -i http://13.239.65.62:8080/api/players/get/all
```

If your server uses a different host/IP, replace `13.239.65.62` with your host.

Environment and configuration
- The application reads `spring.datasource.*` values from `application.properties` or environment variables. Current file values (in repo) point to `jdbc:mysql://13.239.65.62:3306/courtvision` and use username/password `root`/`root`. Change these to secrets appropriate for your environment.

Recommended production changes
- Do not run with the DB `root` account in production.
- Provide DB credentials via environment variables or an external secrets manager.
- Set `spring.jpa.hibernate.ddl-auto` to `validate` or remove it in production to avoid accidental schema changes.

---

## Database (MySQL) setup

Example steps to create the `courtvision` database and import a dump (adjust as needed):

1) Connect to MySQL on the server running the DB host:

```bash
mysql -u root -p
```

2) Create the database (if it doesn't exist):

```sql
CREATE DATABASE courtvision CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

3) Import a SQL dump (if you have one):

```bash
mysql -u root -p courtvision < /path/to/courtvision_dump.sql
```

4) Confirm connectivity: the backend `application.properties` in the repo currently uses:

```
spring.datasource.url=jdbc:mysql://13.239.65.62:3306/courtvision
spring.datasource.username=root
spring.datasource.password=root
```

Change credentials and host as required.

---

## Frontend (React) deployment

Prerequisites
- Node.js + npm

Local development

```bash
cd frontend
npm install
npm start
# opens at http://localhost:3000
```

Production build

```bash
cd frontend
npm run build
# The build output will be in frontend/build/
```

Serving the production build
- You can serve the static `build/` with any static host (S3 + CloudFront, nginx, etc.) or a simple static server.

Configuration
- The frontend is configured to use the API base URL from `frontend/src/utils/axiosConfig.js`.
	The repo has `baseURL: 'http://13.239.65.62:8080/api'` already set. Change this value if your backend host differs.

---

## Adding 12 players (assign to team_id = 1)

You can add players either by executing SQL directly against the `player` table or by using the backend REST API which performs validation.

Important: ensure `team_id = 1` exists in the `team` table before running the SQL.

Option A — Single SQL INSERT (batch)

Below is a ready-to-run SQL statement. It uses column names that match the schema expected by the project (if your DB uses different column naming, adapt accordingly). This will insert 12 distinct players and set `team_id = 1` for each.

```sql
INSERT INTO player (
		fname,
		lname,
		email,
		password,
		birth_date,
		jersey_num,
		position,
		is_coach,
		is_admin,
		team_id
) VALUES
('John','Doe','john.doe@gmail.com','TestPass123!', '2000-01-01', 1, 'Point Guard', false, false, 1),
('Jane','Smith','jane.smith@gmail.com','TestPass123!', '2000-02-02', 2, 'Shooting Guard', false, false, 1),
('Mike','Johnson','mike.johnson@gmail.com','TestPass123!', '2000-03-03', 3, 'Small Forward', false, false, 1),
('Sarah','Williams','sarah.williams@gmail.com','TestPass123!', '2000-04-04', 4, 'Power Forward', false, false, 1),
('James','Brown','james.brown@gmail.com','TestPass123!', '2000-05-05', 5, 'Center', false, false, 1),
('Emma','Davis','emma.davis@gmail.com','TestPass123!', '2000-06-06', 6, 'Point Guard', false, false, 1),
('Alex','Wilson','alex.wilson@gmail.com','TestPass123!', '2000-07-07', 7, 'Shooting Guard', false, false, 1),
('Chris','Taylor','chris.taylor@gmail.com','TestPass123!', '2000-08-08', 8, 'Small Forward', false, false, 1),
('Lisa','Anderson','lisa.anderson@gmail.com','TestPass123!', '2000-09-09', 9, 'Power Forward', false, false, 1),
('Ryan','Thomas','ryan.thomas@gmail.com','TestPass123!', '2000-10-10', 10, 'Center', false, false, 1),
('Kevin','Martin','kevin.martin@gmail.com','TestPass123!', '2000-11-11', 11, 'Point Guard', false, false, 1),
('Amy','Clark','amy.clark@gmail.com','TestPass123!', '2000-12-12', 12, 'Shooting Guard', false, false, 1);
```

Notes about the SQL approach
- The `password` values above are plain text: if your application expects encoded/hashed passwords (usually the case), inserting cleartext will not allow login. Prefer using the REST API endpoint which applies the same hashing/validation the backend uses.
- Confirm column names in your DB (e.g., `birth_date` vs `birthDate`). Adjust accordingly.

Option B — Use the REST API (recommended)

- Endpoint to create a player (the project exposes `POST /api/players/post` — confirm routing in `PlayerController` if customized).

Example single cURL request (set `teamId` to 1):

```bash
curl -X POST http://13.239.65.62:8080/api/players/post \
	-H "Content-Type: application/json" \
	-d '{
		"fname": "John",
		"lname": "Doe",
		"email": "john.doe@gmail.com",
		"password": "TestPass123!",
		"birthDate": "2000-01-01",
		"jerseyNum": 1,
		"position": "Point Guard",
		"isCoach": false,
		"isAdmin": false,
		"teamId": 1
	}'
```

To create 12 players you can loop this with a small script (curl, Node, or Python). This ensures passwords are processed by the backend and validations run.

---

## Test accounts (dummy) — change passwords before production

These are example accounts you can seed or use during demo. They are simple, replace them in DB or create via the API.

- Admin: `admin@gmail.com`  password: `password123`
- Coach: `coach@gmail.com`  password: `password123`
- Player: `player@gmail.com` password: `password123`

Again: change these passwords and do not use them in production.

---

## Troubleshooting & verification

- If the frontend still makes requests to `localhost:8080`, confirm `frontend/src/utils/axiosConfig.js` and ensure all services use the `api` instance from that file.
- Use the browser DevTools Network tab to inspect request URLs and responses.
- Check backend logs on the server: `tail -f app.log` or `journalctl -u your-service` if running as a systemd service.

---

If you want I can also:
- Produce a small Node script that will POST the 12 players to `/api/players/post` (so passwords are hashed by the backend)
- Sanitize `application.properties` and produce an `.env.example` to keep secrets out of repo
- Create a compact single-page deployment checklist you can print for live demos

Tell me which of the three you want next and I'll implement it.


Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# 🚀 How to Run the Task Manager App — Step by Step

---

## STEP 1 — Install Java 17

### Windows
1. Go to: https://adoptium.net
2. Click **"Latest LTS Release"** → download the `.msi` installer for Windows
3. Run the installer — click Next → Next → Finish
4. Verify it worked — open **Command Prompt** and type:
   ```
   java -version
   ```
   You should see something like: `openjdk version "17.x.x"`

### Mac
1. Go to: https://adoptium.net
2. Download the `.pkg` file for macOS
3. Run it and follow the installer
4. Open **Terminal** and verify:
   ```
   java -version
   ```

---

## STEP 2 — Install Maven

Maven is the build tool for the Java backend.

### Windows
1. Go to: https://maven.apache.org/download.cgi
2. Download the **Binary zip archive** (e.g. `apache-maven-3.9.x-bin.zip`)
3. Unzip it to `C:\Program Files\Maven\`
4. Add Maven to your PATH:
   - Search **"Environment Variables"** in the Start Menu
   - Under **System Variables**, find `Path` → click Edit
   - Click New → add: `C:\Program Files\Maven\apache-maven-3.9.x\bin`
   - Click OK on everything
5. Open a **new** Command Prompt and verify:
   ```
   mvn -version
   ```

### Mac
Open Terminal and run:
```bash
brew install maven
```
(If you don't have Homebrew: https://brew.sh — paste the install command from their homepage first)

Verify:
```
mvn -version
```

---

## STEP 3 — Install Node.js

Node.js is needed to run the React frontend.

### Windows & Mac
1. Go to: https://nodejs.org
2. Download the **LTS** version (the left button)
3. Run the installer — click through all defaults
4. Open a **new** terminal and verify:
   ```
   node -version
   npm -version
   ```
   Both should print version numbers.

---

## STEP 4 — Install PostgreSQL

PostgreSQL is the database.

### Windows
1. Go to: https://www.postgresql.org/download/windows/
2. Click **"Download the installer"** → pick the latest version
3. Run the installer:
   - Leave the default port: **5432**
   - Set a password for the `postgres` user — **use `postgres`** (to match the app config)
   - Click through the rest — leave defaults
4. When it asks to run "Stack Builder" at the end — you can skip it (uncheck and Finish)

### Mac
```bash
brew install postgresql@15
brew services start postgresql@15
```
Then set a password:
```bash
psql postgres
ALTER USER postgres PASSWORD 'postgres';
\q
```

---

## STEP 5 — Create the Database

### Windows
1. Open **pgAdmin** (installed with PostgreSQL — find it in the Start Menu)
2. Connect to your server (use password `postgres`)
3. Right-click **Databases** → **Create** → **Database**
4. Name it: `taskmanager` → click Save

### Mac / Windows (alternative using terminal)
Open a terminal and run:
```bash
psql -U postgres -c "CREATE DATABASE taskmanager;"
```
Enter password `postgres` when prompted.

---

## STEP 6 — Get the Project Files

If you have the files as a zip, unzip them somewhere easy like your Desktop.

Your folder structure should look like:
```
taskmanager/
├── backend/
├── frontend/
├── README.md
└── API_DOCS.md
```

---

## STEP 7 — Configure the Database Connection (if needed)

Open this file in any text editor (Notepad is fine):
```
taskmanager/backend/src/main/resources/application.properties
```

Find these lines:
```
spring.datasource.username=postgres
spring.datasource.password=postgres
```

If you used a **different password** when installing PostgreSQL, change `postgres` to your password and save the file.

---

## STEP 8 — Start the Backend

Open a terminal (Command Prompt on Windows, Terminal on Mac) and run:

```bash
cd path/to/taskmanager/backend
```

For example:
- Windows: `cd C:\Users\YourName\Desktop\taskmanager\backend`
- Mac: `cd ~/Desktop/taskmanager/backend`

Then run:
```bash
mvn spring-boot:run
```

The first time this runs it will **download dependencies** — this may take 2–5 minutes. You'll see a lot of text scrolling.

✅ When you see this line, the backend is ready:
```
Started TaskManagerApplication in X.XXX seconds
```

> ⚠️ Keep this terminal window open! The backend must stay running.

The backend will also **automatically create all the database tables and insert sample data** (via Flyway migrations). You don't need to run any SQL manually.

---

## STEP 9 — Start the Frontend

Open a **second** terminal window (keep the first one running the backend).

Navigate to the frontend folder:
```bash
cd path/to/taskmanager/frontend
```

Install dependencies (only needed the first time):
```bash
npm install
```

Start the app:
```bash
npm run dev
```

✅ When you see this, the frontend is ready:
```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

---

## STEP 10 — Open the App

Open your browser and go to:
```
http://localhost:5173
```

You'll see the login screen. Use these demo credentials:

| Username | Password    |
|----------|-------------|
| admin    | password123 |
| alice    | password123 |
| bob      | password123 |

---

## STEP 11 — Explore the API (Optional)

The backend also has an interactive API explorer (Swagger UI).

Open your browser and go to:
```
http://localhost:8080/swagger-ui.html
```

You can test every API endpoint directly from the browser here.

---

## Stopping the App

- In each terminal window, press **Ctrl + C** to stop the server.

## Restarting Later

Just repeat Steps 8 and 9 — you don't need to reinstall anything.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `java: command not found` | Java not installed or not on PATH — redo Step 1 |
| `mvn: command not found` | Maven not installed or not on PATH — redo Step 2 |
| `npm: command not found` | Node.js not installed — redo Step 3 |
| `Connection refused` on port 5432 | PostgreSQL isn't running — start it from Services (Windows) or `brew services start postgresql@15` (Mac) |
| `password authentication failed` | Wrong DB password in `application.properties` — update Step 7 |
| White screen in browser | Backend might not be running — check terminal 1 |
| Port 8080 already in use | Another app is using the port — restart your computer or change `server.port` in `application.properties` |

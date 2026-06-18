Fix all Git hygiene issues before submission.

Tasks:

1. Create a root-level .gitignore file.

2. Ensure the following are ignored:

```text id="ydf6r7"
node_modules/
.env
.env.local
.env.*
dist/
build/
coverage/
.vscode/
.DS_Store
```

3. Create backend/.env.example

Example:

```env id="jmrr65"
PORT=5000
MONGO_URI=your_mongodb_connection_string
ALLOWED_ORIGINS=http://localhost:5173
```

4. Verify backend/.env is NOT tracked.

5. Verify backend/node_modules is ignored.

6. Verify dashboard/node_modules is ignored.

7. Verify dist/build folders are ignored.

8. Provide:

* Final .gitignore contents
* Final .env.example contents
* Git status verification summary

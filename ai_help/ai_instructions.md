
In all answers
0. Answers should be no more than 200 words, with attached files. If an answer has to be longer, state that you are only answering for the start, and I will need to ask for more later.
1. always generate all files in full. nothing like "# ... (rest of your existing code)". I need to be able to copy everything. Show full paths of files.
2. Never delete existing features if not specifically requested to
3. The answer should be ONLY bullets of what do do, step by step. Each bullet should be: What to do, why, code changes inline, full new file as artifact.
4. Explain why things are done so that I can learn
5. I know python very well but don't know react or django. Explain react and django to greater detail than the rest.
6. Use best practices and document the code such that an AI model like sonnet could use said documentation to better understand what's going on.
7. Use informative naming for everything, based on Clean Code principles.
8. Always avoid code duplication as much as possible without making code overly complex
9. Use the codebase.md file as the initial version, but then refer to specific artifacts as the newer versions. Always use the latest version of any file.
10. Never use nested ternary operators or esoteric programming. Keep everything readable 
11. Always post full file paths. Don't expect me to know where to find them in the file system.
12. Start by stating how much time you estimate what you want me to do would take. Make sure every answer you provide takes no more than 8 minutes. If it does, give me a shorter answer and state what was omitted. If all I asked was clarifications, you don't need to state time estimates again.
13. When giving instructions on how to use web pages, such as GCP or anything else, or where to click in UI-based applications or websites, be specific and don't assume I know anything.
14. After configuration outside of code is changed (such as GCP or github or others), you need to generate a sentence to summarize all the new state of configuration to be pasted in the claude project, so you will know it for all future runs. Only summarize valid states. Don't summarize errors or bugs or status between valid changes.

General information that you need to inject where needed:
1. The repo name is "personal_website"
2. user name: "noamzilo"
3. On github pages, but not in the code, I have secrets configured: PROD_API_URL, STAGING_API_URL. Refer to them as needed, but be careful as they might be wrong.
4. The backend is hosted on Google Cloud Platform and shuold use ONLY the free tier. The  (auto generated) project id there is "academic-veld-436919-g0". The Id I gave it was "personal-website-backend"
5. For the DB, until the app is larger, we will use SQLite on the GCP instance.
6. Locally, the website is on ~/src/personal_website
7. GCP service account key file is /home/noams/src/gcp/academic-veld-436919-g0-b0585aa23f8b.json
8. Following is a valid bucket: "gs://test-bucket-19044/"
9. You can use .md files starting with ai_ to know more about the project that is not in the code, for example gcp state.
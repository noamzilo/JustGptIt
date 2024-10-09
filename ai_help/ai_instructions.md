
In all answers
0. Help me with very small steps to give me a chance to reply. When I say you can move on, give the next steps, otherwise help me debug.
1. always generate all files in full. nothing like "# ... (rest of your existing code)". I need to be able to copy everything. Show full paths of files.
2. Never delete existing features if not specifically requested to. Post files with incremental changes that I can view with git diff.
3. The answer should be ONLY bullets of what do do, step by step. Each bullet should be: What to do, why, code changes inline, full new file as artifact.
4. Explain why things are done so that I can learn
5. I know python very well but don't know react or django or github actions or GCP. Explain these to greater detail than the rest.
6. Use best practices and document the code such that an AI model like sonnet could use said documentation to better understand what's going on.
7. Use informative naming for everything, based on Clean Code principles.
8. Always avoid code duplication as much as possible without making code overly complex
9. Use the codebase.md file as the initial version, but then refer to specific artifacts as the newer versions. Always use the latest version of any file.
10. Never use nested ternary operators or esoteric programming. Keep everything readable 
11. Always post full file paths. Don't expect me to know where to find them in the file system.
12. When giving instructions on how to use web pages, such as GCP or anything else, or where to click in UI-based applications or websites, be specific and don't assume I know anything.
13. In the folder ai_help you will find files that should help you understand state of the project that may not be in the code. For example ai_gcp_state.md, ai_github.md.
14. The backend is hosted on Google Cloud Platform and shuold use ONLY the free tier.

General information that you need to inject where needed 
1. For the DB, until the app is larger, we will use SQLite on the GCP instance.
2. Locally, the website is on ~/src/personal_website
3. Following is a valid bucket: "gs://test-bucket-19044/"

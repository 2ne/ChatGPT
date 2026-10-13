# Repository instructions

This repository is a workspace for multiple independent projects created from James's ideas.

## Working style (important)

This repo is for **fast vibe / agentic coding**, often driven from a phone. James does **not** review code or PRs.

- **Push straight to `main`.** Do not open pull requests. Do not use long-lived feature branches unless a push to main fails and you need a quick fix branch — then land the fix on `main` as soon as it builds.
- **No linting. No tests.** Do not add test suites, do not run lint/test scripts, and do not spend tokens on them.
- **Build is the check.** For the project you changed, run `npm run build` (or the project’s equivalent). If the build fails, fix it before or immediately after pushing.
- After pushing to `main`, if GitHub Pages / deploy build breaks, inspect the failure, fix on `main`, and push again.
- Prefer small, reversible commits. Rolling back a commit is the recovery path — not PR review.

## Structure

- Treat each top-level project folder as a separate product or experiment.
- Do not build an application directly in the repository root.
- Use a concise, lowercase kebab-case folder name for each new project.
- Add a project-level `README.md` covering purpose, status, setup, commands and key decisions.
- Add a nested `AGENTS.md` only when a project needs instructions beyond this file.
- Keep dependencies, configuration and source code inside the relevant project folder.
- Shared packages may be introduced under `packages/` only when at least two projects genuinely use them.

## Implementation

- Prefer React, TypeScript, Tailwind CSS and Ant Design where they suit the idea.
- Match the stack to the project rather than forcing web tooling onto every task.
- Produce a usable first version, not just scaffolding.
- Make reasonable minor decisions autonomously and document consequential assumptions.
- Keep interfaces responsive and accessible.
- Include useful empty, loading, error and success states where applicable.
- Avoid placeholder functionality that appears complete but does nothing.

## Quality

- Ensure the changed project **builds**. Skip lint and tests.
- Keep changes scoped to the requested project.
- Do not modify another project unless the task requires it.
- Do not commit secrets, API keys, credentials, personal data, dependency folders or build output.
- Update project documentation when behaviour or setup changes.

## Git workflow

- Commit on `main` and `git push origin main`.
- Keep commits focused and clearly named.
- Do **not** open pull requests.
- Briefly summarise what shipped and the live/Pages URL when relevant.

# Repository instructions

This repository is a workspace for multiple independent projects created from James's ideas.

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

- Run the relevant type checks, tests, linting and build before considering a project complete.
- Keep changes scoped to the requested project.
- Do not modify another project unless the task requires it.
- Do not commit secrets, API keys, credentials, personal data, dependency folders or build output.
- Update project documentation when behaviour or setup changes.

## Git workflow

- Use a dedicated branch for substantial changes.
- Keep commits focused and clearly named.
- Open a draft pull request for review unless James explicitly asks for a direct change.
- Summarise what changed, how it was checked and any remaining limitations.

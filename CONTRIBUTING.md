# Contributing to Trove

Thanks for your interest in contributing to Trove. Contributions of all kinds are welcome, from bug reports and documentation improvements to code and templates.

## Getting started

You will need Node.js 16 or later, npm, and Git. Clone the repository and install dependencies:

```bash
git clone https://github.com/Akshay1018/trove.git
cd trove
npm install
npm run dev
```

To try the CLI locally, use the project CLI and choose a temporary output directory:

```bash
npx ts-node src/cli.ts create my-local-test
```

## Making a change

Create a focused branch from `main` rather than committing directly to it:

```bash
git checkout -b docs/short-description
```

Keep changes scoped and follow the existing TypeScript, formatting, and template conventions. For template changes, check that generated files use the expected project-name variables and include required environment-variable documentation.

Run relevant checks before opening a pull request:

```bash
npm test
npm run lint
```

For template changes, also run `npm run verify-templates` when applicable.

## Issues and pull requests

Before opening an issue, search existing issues and use the repository's issue templates. Bug reports should include steps to reproduce, expected and actual behavior, and relevant Node.js/npm and operating-system versions. Feature requests should explain the use case and proposed behavior.

Open a pull request from your branch against `main`. Describe what changed and why, link a related issue when available, and mention checks you ran. Before requesting review, confirm that the change is focused, relevant tests and linting pass, and documentation or generated-template content is updated as needed.

Use a clear branch name such as `feat/add-example`, `fix/template-path`, or `docs/update-guide`. Commit messages should be concise and may use the conventional format, for example `docs: clarify local setup` or `fix: correct template path`.

## Help wanted

If you are new to the project, look for issues labeled `good first issue` or `help wanted`. If you need guidance, ask in the issue or discussion, or contact the maintainer at ak715173@gmail.com.

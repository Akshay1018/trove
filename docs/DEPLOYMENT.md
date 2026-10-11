# Deployment Guide

This guide explains how to build a generated Trove project and prepare it for deployment.

## Prerequisites

Before building or deploying a project, ensure that you have:

- Node.js installed.
- npm installed.
- Bash available through Git Bash, WSL, Linux, or macOS.
- The generated project's dependencies and configuration files.

## Build a Project

From the Trove repository, run the build script using Bash and provide the path to the generated project:

```bash
bash scripts/build.sh /path/to/generated-project
```

Replace `/path/to/generated-project` with the actual directory containing the generated project's `package.json`.

The script checks that Node.js, npm, and a build script are available. If dependencies are missing, it installs them using `npm ci` when a `package-lock.json` exists, or `npm install` otherwise. It then runs `npm run build`.

To build a project from its own directory, you can also run the script using its path:

```bash
bash /path/to/trove/scripts/build.sh .
```

## Prepare for Deployment

Run the deployment preparation script:

```bash
bash scripts/deploy.sh /path/to/generated-project
```

The script validates the project configuration and runs the build script. It does not publish the application to a hosting provider. Follow your hosting provider's deployment instructions after the build succeeds.

## Environment Variables and Secrets

- Configure required environment variables in your hosting provider's environment settings.
- Do not commit `.env`, `.env.production`, credentials, API keys, or other secrets to version control.
- Use `.env.example` to document required variable names without including real secret values.
- Check that production configuration is available before starting the application.

## Framework Build and Start Commands

Use the commands defined in the generated project's `package.json`. Common examples include:

- Express: `npm run build`, followed by the configured production start command.
- NestJS: `npm run build`, followed by `npm run start:prod` when that script is provided.

The exact commands depend on the generated project's configuration.

## Deployment Checklist

Before deploying:

1. Install dependencies.
2. Configure production environment variables.
3. Run the build script.
4. Run the project's tests.
5. Confirm the production start command works.
6. Configure the hosting provider, deployment secrets, and health checks as needed.
7. Review logs after deployment.

## Troubleshooting

- **Node.js or npm not found:** Install Node.js and confirm that both `node` and `npm` are available in your terminal.
- **Bash not found:** Run the scripts in Git Bash, WSL, Linux, or macOS.
- **Build script missing:** Ensure the generated project's `package.json` defines a `build` script.
- **Dependency installation fails:** Check the lockfile, package registry access, and dependency versions.
- **Build fails:** Review the error output and the generated project's configuration.
- **Missing environment variables:** Configure the required variables in the hosting platform and retry.

## Scope

These scripts provide build and deployment preparation only. Actual deployment, hosting configuration, database migrations, and rollback procedures depend on the hosting provider and application.

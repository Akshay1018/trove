# Contributing to Trove CLI

First off, thank you for considering contributing to Trove CLI! It's people like you that make Trove CLI such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of different viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include screenshots if possible
- Include your environment details (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- A clear and descriptive title
- A detailed description of the proposed functionality
- Any possible drawbacks
- Why this enhancement would be useful to most users

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the existing style guidelines
6. Issue that pull request!

## Development Process

1. **Setup Development Environment**
   ```bash
   git clone https://github.com/yourusername/trove-cli.git
   cd trove-cli
   npm install
   npm run dev
   ```

2. **Branch Naming Convention**
   - Feature: `feature/your-feature-name`
   - Bug Fix: `fix/issue-description`
   - Documentation: `docs/what-you-documented`

3. **Commit Message Guidelines**
   ```
   type(scope): description
   
   [optional body]
   
   [optional footer]
   ```
   Types:
   - feat: A new feature
   - fix: A bug fix
   - docs: Documentation only changes
   - style: Changes that don't affect the meaning of the code
   - refactor: Code change that neither fixes a bug nor adds a feature
   - test: Adding missing tests or correcting existing tests
   - chore: Changes to the build process or auxiliary tools

4. **Testing**
   - Write tests for new features
   - Update tests for bug fixes
   - Run tests before submitting PR:
     ```bash
     npm test
     npm run test:coverage
     ```

## Template Development Guidelines

When contributing new templates or modifying existing ones:

1. **Framework Templates**
   - Follow framework's best practices
   - Include essential dependencies only
   - Provide clear documentation
   - Include basic examples

2. **Database Templates**
   - Include proper connection handling
   - Add migration support
   - Implement basic CRUD operations
   - Follow security best practices

3. **CI/CD Templates**
   - Support multiple environments
   - Include caching strategies
   - Configure proper test runners
   - Add security scanning when possible

## Style Guide

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use async/await over promises
- Implement proper error handling

## Documentation

- Update README.md if needed
- Add JSDoc comments for new functions
- Update API documentation
- Include examples for new features

## Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Documentation review
4. Testing verification
5. Final approval and merge

## Getting Help

If you need help, you can:
- Open a GitHub issue
- Email us at ak715173@gmail.com

Thank you for contributing to Trove CLI! 🚀
## Deployment Scripts

Trove provides scripts to build a generated project and prepare it for deployment.

### Build a Generated Project

Run the build script with Bash and provide the path to the generated project:

```bash
bash scripts/build.sh /path/to/generated-project
```

The script checks the project's build configuration, installs dependencies if needed, and runs `npm run build`.

### Prepare for Deployment

Run:

```bash
bash scripts/deploy.sh /path/to/generated-project
```

This validates the project configuration and builds the project. It does not deploy the application to a hosting provider. Complete deployment using your hosting provider's instructions.

### Requirements and Security

- Node.js, npm, and Bash are required.
- Use Git Bash, WSL, Linux, or macOS to run the scripts.
- Configure production environment variables through your hosting provider.
- Never commit secrets, API keys, or production environment files.
- Review [the Deployment Guide](docs/DEPLOYMENT.md) for prerequisites, troubleshooting, and the deployment checklist.

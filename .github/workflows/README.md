# GitHub Actions CI/CD

This directory contains GitHub Actions workflows for continuous integration and deployment.

## CI Workflow

The `ci.yml` workflow runs automated checks on every push and pull request to ensure code quality.

### Triggers

- **Push**: Runs on pushes to `main` and `develop` branches
- **Pull Request**: Runs on pull requests targeting `main` and `develop` branches

### Jobs

#### Code Quality Checks

This job performs the following checks in order:

1. **Type Check** (`npm run type-check`)
   - Validates TypeScript types without emitting files
   - Ensures type safety across the codebase

2. **Linter** (`npm run lint`)
   - Runs ESLint on all `.ts` and `.tsx` files in the `src` directory
   - Enforces code style and catches potential errors

3. **Format Check** (`npm run format:check`)
   - Validates code formatting with Prettier
   - Ensures consistent code style across the project

4. **Unit Tests** (`npm run test`)
   - Runs all Jest test suites
   - Validates component functionality and business logic

5. **Coverage Report** (`npm run test:coverage`)
   - Generates test coverage reports
   - Optionally uploads coverage to Codecov (requires `CODECOV_TOKEN` secret)

### Configuration

- **Node Version**: 20.x
- **OS**: Ubuntu Latest
- **Package Manager**: npm (with caching enabled)

### Running Checks Locally

Before pushing your code, you can run all checks locally:

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Format checking
npm run format:check

# Running tests
npm run test

# Running tests with coverage
npm run test:coverage
```

### Fixing Issues

If any check fails, you can fix them locally:

```bash
# Fix linting issues
npm run lint:fix

# Fix formatting issues
npm run format

# Run tests in watch mode
npm run test:watch
```

## Best Practices

- Ensure all checks pass locally before pushing
- Write tests for new features and bug fixes
- Keep test coverage above 80%
- Follow the established code style
- Use meaningful commit messages

# 06. Git Conventions, PR Templates, and StackBlitz

Repository standards, the pull request template, and the StackBlitz configuration for online previews.

## 1. Commit and Branching Strategy

The repository follows the **Conventional Commits** standard (also required if you enable
`semantic-release`, see [05-cicd-pipeline](./05-cicd-pipeline.md)).

**Allowed Types:**

- `feat`: A new feature (MINOR version bump).
- `fix`: A bug fix (PATCH version bump).
- `docs`: Documentation only changes.
- `style`: Formatting changes that do not affect the meaning of the code.
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `perf`: A code change that improves performance.
- `test`: Adding missing tests or correcting existing tests.
- `chore`: Build process, tooling and release changes.
- `ci`: Changes to the GitHub Actions workflows.

**Examples:**

- `feat(sidebar): add breakpoint input for mobile off-canvas mode`
- `fix(nav): expand ancestors when activeItem changes`
- `feat(drawer)!: rename visible to open`

Work on feature branches (`feat/...`, `fix/...`) and open a pull request to `master`; the
**PR Validation Checks** workflow must pass before merging.

## 2. Pull Request Template (`.github/PULL_REQUEST_TEMPLATE.md`)

```markdown
## Description

<!-- Describe your changes in detail -->

Fixes # (issue number)

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have updated the StackBlitz examples if applicable
```

## 3. StackBlitz Integration

### Root `stackblitz.json`

```json
{
  "installDependencies": true,
  "startCommand": "npm run start",
  "env": {
    "ENABLE_CJS_IMPORTS": true
  }
}
```

The demo resolves `@amro93/ngb-sidebar` from the library source through the `tsconfig.json` path
mapping, so StackBlitz can run `npm start` without building the library first. Bootstrap and Bootstrap
Icons are loaded from `src/styles.scss`, and Bootstrap's JS bundle from `angular.json` `scripts`.

### Links

- Whole repository: `https://stackblitz.com/github/amro93/ngb-sidebar`
- A branch: `https://stackblitz.com/github/amro93/ngb-sidebar/tree/<branch>`

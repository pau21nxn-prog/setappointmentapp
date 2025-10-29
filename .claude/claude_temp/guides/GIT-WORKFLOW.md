# Git Workflow

> **File**: `.claude/guides/GIT-WORKFLOW.md`
> **Last Updated**: October 29, 2025

---

## GitFlow Branching Strategy

```
main (production)
├── develop (staging/integration)
│   ├── feature/booking-form
│   ├── feature/email-integration
│   └── feature/carousel-component
├── hotfix/critical-bug-fix
└── release/v1.0.0
```

---

## Branch Structure

- **`main`**: Production branch (auto-deploys to production)
- **`develop`**: Development branch (auto-deploys to staging)
- **`feature/*`**: Feature branches (e.g., `feature/booking-form`)
- **`hotfix/*`**: Hotfix branches (e.g., `hotfix/email-bug`)
- **`release/*`**: Release branches (e.g., `release/v1.0.0`)

---

## Commit Convention (Conventional Commits)

**Format**:

```
<type>(<scope>): <subject>

<body>

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Adding/updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes

**Examples**:

```bash
feat(booking): add multi-step form validation

Implemented Zod schemas for form validation across all three steps.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Common Workflows

### Starting a new feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/feature-name
# Make changes
git add .
git commit -m "feat(scope): description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin feature/feature-name
# Create PR to develop via GitHub
```

### Fixing a bug

```bash
git checkout develop
git pull origin develop
git checkout -b hotfix/issue-description
# Make fixes
git add .
git commit -m "fix(scope): description

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
git push origin hotfix/issue-description
# Create PR to develop
```

---

## Branch Protection Rules

**Main Branch**:

- Require PR reviews (1 minimum)
- Require status checks (tests, build, lint)
- No force pushes
- No deletions

**Develop Branch**:

- Require status checks
- Automatically delete head branches after merge

---

[Return to Main Index](../CLAUDE.md)

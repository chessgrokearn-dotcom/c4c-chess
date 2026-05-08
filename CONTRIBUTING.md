# Contributing to C4C Chess

Thank you for your interest in contributing to C4C Chess! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and adhere to our code of conduct:
- Be respectful and inclusive
- Provide constructive feedback
- Respect confidentiality
- Report concerns to maintainers

## Getting Started

### 1. Fork and Clone

```bash
# Fork on GitHub (click Fork button)
git clone https://github.com/YOUR_USERNAME/c4c-chess.git
cd c4c-chess
git remote add upstream https://github.com/chessgrokearn-dotcom/c4c-chess.git
```

### 2. Create Feature Branch

```bash
git fetch upstream
git checkout -b feature/your-feature-name upstream/main
```

### 3. Installation

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/env.example apps/web/.env.local
npm run dev:api
npm run dev:web
```

## Development Guidelines

### Code Style

- **Language**: TypeScript (strict mode)
- **Formatting**: ESLint + Prettier
- **Naming**: camelCase for variables, PascalCase for classes/components
- **Comments**: Descriptive JSDoc comments for functions

### Linting and Formatting

```bash
# Check code
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### TypeScript

- Use strict type checking
- Avoid `any` type
- Export explicit interfaces/types
- Use const/let (not var)

### Component Structure (React)

```typescript
// Import order: React, external libs, local imports
import React, { useState } from 'react';
import { ChessBoard } from 'chessboardjs';
import { useSocket } from '@/lib/socket';

// Types first
interface GameProps {
  gameId: string;
}

// Component
export const Game: React.FC<GameProps> = ({ gameId }) => {
  const [state, setState] = useState(null);

  return <div>{/* JSX */}</div>;
};

export default Game;
```

### Backend Structure (Express/Socket.IO)

```typescript
// Express routes
app.post('/api/games', (req, res) => {
  // Handler logic
});

// Socket events
socket.on('makeMove', (data) => {
  // Event handler
});
```

## Commit Message Convention

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (no logic change)
- `refactor`: Code refactor
- `perf`: Performance improvement
- `test`: Test additions/changes
- `chore`: Dependencies, build system

### Examples

```
feat(game): add timer functionality

- Implement 5-minute timer for blitz games
- Add timer UI component
- Handle timeout events

Closes #123
```

```
fix(wallet): MetaMask connection timeout

- Increase connection timeout to 10s
- Add retry logic
- Show user-friendly error message

Fixes #456
```

## Testing

### Write Tests

```bash
# Create test file next to source
# Example: src/components/Game.test.tsx

import { render, screen } from '@testing-library/react';
import { Game } from './Game';

test('renders game board', () => {
  render(<Game gameId="test-123" />);
  expect(screen.getByRole('img')).toBeInTheDocument();
});
```

### Run Tests

```bash
npm test
npm test -- --watch
npm test -- --coverage
```

## Pull Request Process

### 1. Push Your Changes

```bash
git add .
git commit -m "feat(game): add timer functionality"
git push origin feature/your-feature-name
```

### 2. Create Pull Request

1. Go to [Pull Requests](https://github.com/chessgrokearn-dotcom/c4c-chess/pulls)
2. Click "New Pull Request"
3. Select base: `main`, compare: your branch
4. Fill out PR template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123

## Screenshots (if applicable)
![screenshot](url)

## Testing
How did you test this?

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass
```

### 3. Review Process

- Maintainers will review
- Address feedback
- Respond to comments
- Make requested changes

### 4. Merge

Once approved:
- Squash and merge (for work-in-progress)
- Merge commit (for feature branches)
- Rebase and merge (to keep history clean)

## Reporting Issues

### Bug Report

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari
- Node version: 20.x
- npm version: 10.x

## Screenshots
[Attach if applicable]

## Additional Context
Any additional info
```

### Feature Request

```markdown
## Description
Clear description of feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives
Other approaches considered

## Additional Context
Any additional info
```

## Documentation

### Update Docs

1. Modify markdown files in `docs/` or root
2. Follow existing style
3. Add examples where helpful
4. Include code blocks with syntax highlighting

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add table of contents for long docs
- Update README if needed
- Cross-reference related docs

## Branch Naming

Use descriptive names:
- `feature/timer-functionality`
- `fix/wallet-connection`
- `docs/setup-guide`
- `refactor/game-service`
- `perf/database-queries`

## Review Checklist for Reviewers

```markdown
## Code Quality
- [ ] Follows coding standards
- [ ] No unnecessary complexity
- [ ] Proper error handling
- [ ] No console.log spam

## Functionality
- [ ] Solves stated problem
- [ ] No regressions
- [ ] Edge cases handled
- [ ] Works on target platforms

## Testing
- [ ] Tests passing
- [ ] New tests added
- [ ] Test coverage adequate

## Documentation
- [ ] Comments clear
- [ ] README updated
- [ ] API docs updated
- [ ] Examples provided

## Security
- [ ] No secrets in code
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS prevention
```

## Discord/Community

Join our communities:
- **Discord**: [link]
- **Twitter**: [@c4c_chess](https://twitter.com)
- **GitHub Discussions**: [link]

## FAQ

**Q: How long does review take?**
A: Usually 1-3 days, may vary based on complexity.

**Q: Can I work on multiple features?**
A: Yes, create separate branches for each.

**Q: Do I need tests?**
A: Yes, tests are required for most changes.

**Q: Who owns the code?**
A: Contributor retains copyright, code is MIT licensed.

## Resources

- [Git Workflow](https://www.atlassian.com/git/tutorials)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com/)
- [Socket.IO Guide](https://socket.io/docs/)

## Recognition

Contributors are recognized:
- In README (after 3+ merged PRs)
- In release notes
- With GitHub badge/label

## Questions?

- Check documentation
- Search existing issues
- Ask in GitHub Discussions
- Email maintainers (if applicable)

---

**Thank you for contributing to C4C Chess! 🎉**

Last Updated: May 2026

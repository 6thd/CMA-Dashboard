# Contributing to CMA Dashboard

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## ?? Code of Conduct

- Be respectful and professional
- Write clean, maintainable code
- Follow project conventions and standards
- Write meaningful commit messages

## ?? Getting Started

1. **Fork the repository**
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CMA-Dashboard.git
   cd CMA-Dashboard
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/6thd/CMA-Dashboard.git
   ```
4. **Install dependencies** (see README.md)

## ?? Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### 2. Make Your Changes

- Write clean, self-documenting code
- Follow existing code style
- Add comments for complex logic
- Update documentation as needed

### 3. Test Your Changes

**Frontend:**
```bash
cd CMA.Web/ClientApp
npm run lint          # Check for linting errors
npm run type-check    # TypeScript validation
npm run format:check  # Code formatting
npm run build         # Ensure it builds
```

**Backend:**
```bash
dotnet build          # Build the solution
dotnet test           # Run tests
```

### 4. Commit Your Changes

Follow conventional commits format:

```bash
git commit -m "type(scope): description"
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```bash
git commit -m "feat(dashboard): add student analytics chart"
git commit -m "fix(api): resolve language switching bug"
git commit -m "docs(readme): update installation instructions"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference to any related issues
- Screenshots (if UI changes)
- Testing instructions

## ?? Coding Standards

### TypeScript/React

- Use functional components with hooks
- Use TypeScript strict mode
- Avoid `any` types when possible
- Use meaningful variable and function names
- Keep components small and focused
- Use custom hooks for reusable logic
- Follow React best practices

Example:
```typescript
interface UserProfileProps {
  userId: string;
  onUpdate?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Component logic...
  
  return (
    // JSX...
  );
};
```

### C# (.NET)

- Follow Microsoft's C# coding conventions
- Use meaningful names
- Keep methods small and focused
- Use async/await for asynchronous operations
- Add XML documentation comments for public APIs
- Use dependency injection

Example:
```csharp
/// <summary>
/// Retrieves user information by ID
/// </summary>
/// <param name="userId">The user's unique identifier</param>
/// <returns>User object or null if not found</returns>
public async Task<User?> GetUserAsync(string userId)
{
    return await _context.Users
        .FirstOrDefaultAsync(u => u.Id == userId);
}
```

### CSS/Tailwind

- Use Tailwind utility classes
- Follow mobile-first approach
- Keep custom CSS minimal
- Use consistent spacing scale
- Maintain dark mode support (if applicable)

## ?? Pull Request Guidelines

### Before Submitting

- ? Code builds without errors
- ? All tests pass
- ? Linting passes
- ? No console errors or warnings
- ? Documentation updated
- ? Commit messages follow conventions

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

## ?? Reporting Bugs

Create an issue with:
- Clear, descriptive title
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, .NET version)

## ?? Suggesting Features

Create an issue with:
- Clear description of the feature
- Use cases
- Potential implementation approach
- Why it would be valuable

## ?? Code Review Process

1. **Automated checks** must pass (CI/CD)
2. **At least one approval** required
3. **All feedback addressed**
4. **No merge conflicts**
5. **Up to date** with base branch

## ?? Resources

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [ASP.NET Core Documentation](https://docs.microsoft.com/aspnet/core/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## ? Questions?

Feel free to:
- Open a discussion on GitHub
- Ask in pull request comments
- Contact the maintainers

---

Thank you for contributing! ??

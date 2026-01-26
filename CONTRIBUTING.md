# Contributing to Quantum Circuit Builder

Thank you for your interest in contributing to Quantum Circuit Builder! This document provides guidelines and instructions for contributing to the project.

---

## 🤝 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

- ✅ Using welcoming and inclusive language
- ✅ Being respectful of differing viewpoints
- ✅ Gracefully accepting constructive criticism
- ✅ Focusing on what is best for the community
- ❌ Harassment, trolling, or discriminatory language

---

## 🚀 Getting Started

### Prerequisites

- **Git** - Version control
- **Node.js 16+** - Frontend development
- **Python 3.8+** - Backend development
- **Code Editor** - VS Code recommended

### Development Setup

1. **Fork the Repository**
   ```bash
   # Click "Fork" button on GitHub
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/quantum-circuit-builder.git
   cd quantum-circuit-builder
   ```

2. **Set Up Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev  # Runs on localhost:5173
   ```

3. **Set Up Backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload  # Runs on localhost:8000
   ```

4. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

---

## 📋 Contribution Types

### 🐛 Bug Reports

Found a bug? Help us fix it!

**Before Submitting:**
- Check if the bug is already reported in [Issues](https://github.com/yourrepo/issues)
- Verify it's reproducible in the latest version
- Check the browser console for errors

**Bug Report Template:**
```markdown
**Description**
A clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- Version: [e.g., 3.0.0]

**Screenshots**
If applicable

**Additional Context**
Any other information
```

### ✨ Feature Requests

Have an idea? We'd love to hear it!

**Feature Request Template:**
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this needed? Who benefits?

**Proposed Solution**
How would you implement it?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, references
```

### 🔧 Code Contributions

Ready to code? Follow these guidelines:

#### Frontend Contributions

**Component Structure:**
```jsx
// components/MyComponent/MyComponent.jsx
import React, { useState } from 'react';
import './MyComponent.css';

/**
 * Brief component description
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 */
const MyComponent = ({ title }) => {
  const [state, setState] = useState(null);

  return (
    <div className="my-component">
      <h2>{title}</h2>
    </div>
  );
};

export default MyComponent;
```

**Styling Guidelines:**
- Use CSS modules or separate CSS files
- Follow BEM naming convention
- Use CSS variables for colors/spacing
- Ensure responsive design (mobile-first)

**State Management:**
- Use Zustand for global state
- Keep component state local when possible
- Use custom hooks for reusable logic

#### Backend Contributions

**Route Structure:**
```python
# routes/my_route.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas import MySchema

router = APIRouter(prefix="/my-route", tags=["My Feature"])

@router.get("/")
async def get_items(db: Session = Depends(get_db)):
    """
    Get all items.
    
    Returns:
        List[MySchema]: List of items
    """
    items = db.query(MyModel).all()
    return items
```

**Model Structure:**
```python
# models/my_model.py
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base
import uuid
from datetime import datetime

class MyModel(Base):
    __tablename__ = "my_table"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user_id = Column(String, ForeignKey("users.id"))
    user = relationship("User", back_populates="my_items")
```

**API Best Practices:**
- Use Pydantic schemas for validation
- Return proper HTTP status codes
- Include error messages in responses
- Document with docstrings
- Use dependency injection

---

## 🧪 Testing

### Frontend Tests

```bash
cd frontend
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm run test:coverage       # Coverage report
```

**Writing Tests:**
```javascript
// MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders title correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Backend Tests

```bash
cd backend
pytest                      # Run all tests
pytest --cov               # Coverage report
pytest -v                  # Verbose output
```

**Writing Tests:**
```python
# test_my_route.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_items():
    response = client.get("/my-route/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

---

## 📝 Coding Standards

### JavaScript/React

**Style Guide:**
- Use ES6+ features
- Functional components with hooks
- 2 spaces for indentation
- Semicolons required
- Single quotes for strings
- Meaningful variable names

**ESLint Configuration:**
```javascript
// .eslintrc.js
module.exports = {
  extends: ['react-app'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    'react/prop-types': 'warn'
  }
};
```

### Python

**Style Guide:**
- Follow PEP 8
- 4 spaces for indentation
- Type hints for function signatures
- Docstrings for all functions/classes
- Black formatter

**Example:**
```python
from typing import List, Optional

def process_circuit(
    circuit_data: dict,
    optimize: bool = False
) -> Optional[List[str]]:
    """
    Process a quantum circuit.
    
    Args:
        circuit_data: Circuit configuration
        optimize: Whether to optimize the circuit
        
    Returns:
        List of gate operations or None if invalid
    """
    # Implementation
    pass
```

---

## 🔄 Pull Request Process

### Before Submitting

1. ✅ **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. ✅ **Run tests**
   ```bash
   npm test              # Frontend
   pytest                # Backend
   ```

3. ✅ **Check code quality**
   ```bash
   npm run lint          # Frontend
   black . && flake8     # Backend
   ```

4. ✅ **Update documentation**
   - Update README if adding features
   - Add/update code comments
   - Update API documentation

### Commit Messages

Use conventional commit format:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(circuit): add quantum fourier transform gate

Implements QFT gate with configurable qubit range.
Includes tests and documentation.

Closes #123
```

```
fix(auth): resolve JWT token expiration issue

Token expiration was not being checked correctly.
Now properly validates exp claim.
```

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Checklist
- [ ] Tests pass locally
- [ ] Added/updated tests
- [ ] Updated documentation
- [ ] Code follows style guidelines
- [ ] Self-review completed

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

### Review Process

1. **Automated Checks**
   - CI/CD pipeline runs tests
   - Linting and formatting checks
   - Build verification

2. **Code Review**
   - At least one maintainer approval required
   - Address review comments
   - Keep discussions constructive

3. **Merge**
   - Squash and merge (usually)
   - Delete branch after merge

---

## 🏗️ Project Structure

### Frontend Organization

```
frontend/src/
├── components/        # Reusable UI components
│   ├── Common/        # Shared across app
│   ├── CircuitBuilder/# Circuit-specific
│   └── Visualizations/# Charts and graphs
├── pages/             # Route components
├── services/          # API clients
├── store/             # State management
├── hooks/             # Custom React hooks
├── utils/             # Helper functions
└── styles/            # Global styles
```

### Backend Organization

```
backend/app/
├── models/            # Database models
├── routes/            # API endpoints
├── schemas/           # Pydantic schemas
├── services/          # Business logic
├── utils/             # Utilities
└── main.py            # App entry point
```

---

## 🎨 Design Guidelines

### UI/UX Principles

- **Clarity:** Clear labels and intuitive interactions
- **Consistency:** Unified design language
- **Feedback:** Visual feedback for all actions
- **Accessibility:** WCAG 2.1 AA compliance
- **Performance:** Smooth animations, fast load times

### Color Palette

```css
/* Primary Colors */
--primary: #667eea;
--primary-dark: #5568d3;
--primary-light: #7c8df5;

/* Status Colors */
--success: #48bb78;
--warning: #f6ad55;
--error: #f56565;
--info: #4299e1;

/* Neutrals */
--gray-900: #1a202c;
--gray-700: #4a5568;
--gray-500: #a0aec0;
--gray-300: #cbd5e0;
--gray-100: #f7fafc;
```

### Typography

```css
/* Font Families */
--font-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto;
--font-mono: "Monaco", "Courier New", monospace;

/* Font Sizes */
--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
```

---

## 📚 Resources

### Learning Resources

- **Quantum Computing:**
  - [Qiskit Textbook](https://qiskit.org/textbook/)
  - [Nielsen & Chuang Book](https://www.amazon.com/Quantum-Computation-Information-10th-Anniversary/dp/1107002176)
  
- **React:**
  - [React Documentation](https://react.dev/)
  - [React Patterns](https://reactpatterns.com/)
  
- **FastAPI:**
  - [FastAPI Documentation](https://fastapi.tiangolo.com/)
  - [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)

### Development Tools

- **VS Code Extensions:**
  - ESLint
  - Prettier
  - Python
  - GitLens
  - Thunder Client (API testing)

- **Browser DevTools:**
  - React Developer Tools
  - Redux DevTools (for Zustand)

---

## 💬 Communication

### Where to Ask Questions

- **GitHub Issues:** Bug reports, feature requests
- **GitHub Discussions:** General questions, ideas
- **Email:** contact@quantumcircuitbuilder.com

### Getting Help

1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Create a new issue (if needed)

---

## 🏆 Recognition

Contributors are recognized in several ways:

- Listed in [CONTRIBUTORS.md](CONTRIBUTORS.md)
- Mentioned in release notes
- GitHub contributor badge
- Invitation to collaborator team (for significant contributions)

---

## 📄 License

By contributing to Quantum Circuit Builder, you agree that your contributions will be licensed under the MIT License.

---

## 🙏 Thank You!

Every contribution, no matter how small, helps make Quantum Circuit Builder better. We appreciate your time and effort!

**Happy Coding!** 🚀

---

**Last Updated:** January 26, 2026  
**Maintained by:** Quantum Circuit Builder Team

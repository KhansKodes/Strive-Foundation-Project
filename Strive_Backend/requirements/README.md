# Requirements Directory

This directory contains organized requirement files for the Strive Foundation Django Backend project.

## Files Overview

### `base.txt`
Contains core dependencies required for the application to run in any environment:
- Django framework and REST framework
- Database drivers (PostgreSQL)
- Authentication (JWT)
- Image processing (Pillow)
- CORS handling
- Environment configuration

### `development.txt`
Includes all base requirements plus development-specific tools:
- Django Jazzmin admin theme
- Code formatting and linting tools (Black, Flake8, isort)
- Testing frameworks (pytest)
- Development utilities (debug toolbar, django-extensions)
- Documentation tools (Sphinx)

### `production.txt`
Includes all base requirements plus production-specific packages:
- WSGI server (Gunicorn)
- Static file serving (WhiteNoise)
- Security enhancements
- Monitoring and logging (Sentry)
- Cloud storage support (django-storages, boto3)

### `testing.txt`
Includes all base requirements plus testing-specific tools:
- Testing frameworks (pytest with plugins)
- Test data factories (factory-boy, faker)
- Coverage reporting
- Performance testing (Locust)
- HTTP mocking utilities

## Installation

### For Development
```bash
pip install -r requirements/development.txt
```

### For Production
```bash
pip install -r requirements/production.txt
```

### For Testing Only
```bash
pip install -r requirements/testing.txt
```

### For Base Installation
```bash
pip install -r requirements/base.txt
```

## Package Versions

All packages are pinned to specific versions to ensure consistent deployments across different environments. Update versions carefully and test thoroughly before deploying to production.

## Adding New Dependencies

1. Add the package to the appropriate requirements file
2. Pin to a specific version
3. Update this README if necessary
4. Test in all relevant environments
5. Update the main `requirements.txt` file if needed for backward compatibility

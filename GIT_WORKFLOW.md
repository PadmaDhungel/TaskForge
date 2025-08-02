# Git Branching & Workflow Guide for TaskForge

## Branches Overview

- `main`  
  - Production-ready code only.  
  - Protected branch; no direct commits.  
  - Merges only from `release` or `hotfix` branches.

- `develop`  
  - Integration branch for ongoing development.  
  - Features and bugfixes merge here first.

- Feature branches (`feature/xyz`)  
  - For new features or enhancements.  
  - Branch off `develop`.  
  - Merge back into `develop`.

- Bugfix branches (`bugfix/xyz`)  
  - For fixing bugs before release.  
  - Branch off `develop`.  
  - Merge back into `develop`.

- Release branches (`release/vX.Y`)  
  - Created from `develop` when preparing a release.  
  - For final testing, version bumps, and fixes.  
  - Merge into `main` and `develop`.

- Hotfix branches (`hotfix/vX.Y.Z`)  
  - For urgent fixes on production.  
  - Branch off `main`.  
  - Merge back into `main` and `develop`.

---

## Workflow

1. **Start a feature**  
   - Create a feature branch from `develop`:  
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b feature/awesome-feature
     ```

2. **Develop & Commit**  
   - Work on your feature, commit often with clear messages.

3. **Push & Open PR**  
   - Push your branch:  
     ```bash
     git push -u origin feature/awesome-feature
     ```  
   - Open a Pull Request (PR) targeting `develop`.

4. **Code Review & Merge**  
   - After review and CI passes, merge PR into `develop`.

5. **Prepare a Release**  
   - When ready, create a release branch from `develop`:  
     ```bash
     git checkout develop
     git pull origin develop
     git checkout -b release/v1.0
     ```  
   - Test and fix bugs here.

6. **Release & Tag**  
   - Merge release branch into `main` and `develop`:  
     ```bash
     git checkout main
     git merge release/v1.0
     git tag v1.0
     git push origin main --tags

     git checkout develop
     git merge release/v1.0
     git push origin develop
     ```  
   - Delete release branch.

7. **Hotfixes (if needed)**  
   - Create hotfix branch from `main`:  
     ```bash
     git checkout main
     git pull origin main
     git checkout -b hotfix/v1.0.1
     ```  
   - Fix issue, then merge back to `main` and `develop`.

---

## Branch Naming Conventions

| Branch Type | Prefix          | Example                    |
|-------------|-----------------|----------------------------|
| Feature     | `feature/`      | `feature/auth-system`       |
| Bugfix      | `bugfix/`       | `bugfix/login-error`        |
| Release     | `release/`      | `release/v1.0`              |
| Hotfix      | `hotfix/`       | `hotfix/v1.0.1`             |

---

## Commit Message Tips

- Use **imperative mood** ("Add", "Fix", "Update")  
- Reference issues or tasks if applicable (e.g., `Fix #42`)  
- Be concise but descriptive  

Example:  

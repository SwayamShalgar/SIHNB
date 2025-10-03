# 📦 Git Commands Guide - Certify Project

## 🔄 Pull Latest Changes

### Basic Pull (Recommended)

```bash
cd /Users/surajbayas/Developer/certifyo/SIHNB
git pull origin main
```

### Pull with Rebase (If you have local commits)

```bash
git pull --rebase origin main
```

### Force Pull (Discard local changes)

```bash
git fetch origin
git reset --hard origin/main
```

---

## 📥 Common Git Workflows

### 1. Check Current Status

```bash
git status
```

### 2. See What Changed

```bash
git diff
```

### 3. View Commit History

```bash
git log --oneline -10
```

### 4. Check Which Branch You're On

```bash
git branch
```

---

## 💾 Save Your Changes Before Pulling

### Option A: Commit Your Changes

```bash
# See what changed
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Now pull
git pull origin main
```

### Option B: Stash Your Changes (Temporary Save)

```bash
# Save your changes temporarily
git stash

# Pull latest code
git pull origin main

# Restore your changes
git stash pop
```

---

## 🔧 If Pull Has Conflicts

### Step 1: See the Conflicts

```bash
git status
```

### Step 2: Open Conflicted Files

Files will have markers like:

```
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> origin/main
```

### Step 3: Resolve and Commit

```bash
# After fixing conflicts manually
git add .
git commit -m "Resolved merge conflicts"
```

---

## 🚀 Push Your Changes

### After Making Changes

```bash
# Check what you changed
git status

# Add files
git add .

# Commit
git commit -m "Description of changes"

# Push to GitHub
git push origin main
```

---

## 🔍 Useful Git Commands

### See Remote URL

```bash
git remote -v
```

### Update Remote URL (if needed)

```bash
git remote set-url origin <new-url>
```

### Discard Local Changes to a File

```bash
git checkout -- <filename>
```

### Discard All Local Changes

```bash
git reset --hard HEAD
```

### See Difference Between Local and Remote

```bash
git fetch
git diff main origin/main
```

---

## 📋 Your Project Specific Commands

### Full Update Workflow

```bash
# 1. Go to project
cd /Users/surajbayas/Developer/certifyo/SIHNB

# 2. Check status
git status

# 3. Stash any local changes
git stash

# 4. Pull latest
git pull origin main

# 5. Restore your changes (if stashed)
git stash pop

# 6. Verify everything
git status
```

---

## 🎯 Quick Reference

| Command                 | What it Does                |
| ----------------------- | --------------------------- |
| `git pull origin main`  | Get latest code from GitHub |
| `git status`            | See what changed locally    |
| `git diff`              | See detailed changes        |
| `git add .`             | Stage all changes           |
| `git commit -m "msg"`   | Save changes with message   |
| `git push origin main`  | Upload to GitHub            |
| `git stash`             | Temporarily save changes    |
| `git stash pop`         | Restore stashed changes     |
| `git log`               | See commit history          |
| `git reset --hard HEAD` | Discard all local changes   |

---

## ⚠️ Important Notes

### Before Pulling

1. ✅ Save any important work
2. ✅ Commit OR stash your changes
3. ✅ Check you're on the right branch (`git branch`)

### After Pulling

1. ✅ Check if any files changed (`git status`)
2. ✅ Read CHANGELOG or commit messages
3. ✅ Test the application
4. ✅ Update dependencies if needed (`npm install`)

---

## 🔄 Sync Workflow (Step by Step)

### When Your Friend Makes Changes

```bash
# Step 1: Navigate to project
cd /Users/surajbayas/Developer/certifyo/SIHNB

# Step 2: Save your work
git add .
git commit -m "My current work"

# Step 3: Get latest changes
git pull origin main

# Step 4: If successful, test the app
npm install  # If package.json changed
```

### When You Make Changes

```bash
# Step 1: Make your changes to files

# Step 2: Stage changes
git add .

# Step 3: Commit changes
git commit -m "Descriptive message about what you changed"

# Step 4: Pull latest first (best practice)
git pull origin main

# Step 5: Push your changes
git push origin main
```

---

## 💡 Pro Tips

### Always Pull Before Push

```bash
git pull origin main
git push origin main
```

### See What Will Be Pulled

```bash
git fetch
git log HEAD..origin/main --oneline
```

### Create a Backup Branch (Before Major Changes)

```bash
git branch backup-$(date +%Y%m%d)
```

### View File History

```bash
git log --follow <filename>
```

---

## 🆘 Emergency Commands

### Undo Last Commit (Keep Changes)

```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)

```bash
git reset --hard HEAD~1
```

### Restore Deleted File

```bash
git checkout HEAD -- <filename>
```

### Clean Untracked Files

```bash
git clean -fd
```

---

## 📝 Commit Message Best Practices

### Good Examples

```bash
git commit -m "Fix: Pinata upload not working in certificate issuance"
git commit -m "Add: Profile button to all dashboards"
git commit -m "Update: Navbar styling for better spacing"
git commit -m "Refactor: Certificate routes for better error handling"
```

### Format

```
Type: Short description

Types:
- Fix: Bug fixes
- Add: New features
- Update: Changes to existing features
- Refactor: Code improvements
- Docs: Documentation changes
```

---

## 🔐 Setup Git (First Time Only)

### Configure Your Identity

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Verify Configuration

```bash
git config --list
```

---

## 📚 Additional Resources

### Check Git Documentation

```bash
git help
git help pull
git help commit
```

### Your Repository Info

- **Repository**: SwayamShalgar/SIHNB
- **Branch**: main
- **Remote**: origin

---

**Last Updated**: October 4, 2025  
**Quick Command**: `git pull origin main`

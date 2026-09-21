# Git & GitHub Workflow Reference

The branch → PR → review → merge → promote → tag workflow for this repo, as rehearsed in Milestone 7 (PRs #2 and #3, tag `v0.1.0`). Every command below was run for real during M7.

Inside Claude Code, prefix each shell command with `!` (for example `! git status`). In a normal terminal, leave the `!` off. A command typed without the prefix is sent to Claude as chat and does not run.

## How this repo is set up

- **Branches:** `feature/*` → `dev` → `main`. Work is done on a feature branch, merged into `dev` by PR, then promoted from `dev` to `main` by a second PR.
- **`dev` and `main` are protected.** Direct pushes are blocked for everyone, admin included. Every change lands through a PR.
- **Required checks on both:** `web-ci`, `mobile-ci`, `flags-server-ci`. A PR can't merge until all three pass. (Vercel's checks also appear, but they aren't required.)
- **0 required approvals.** GitHub doesn't let you approve your own PR, so a review is left as **Comment**, not **Approve**.
- **Merge type:** always **Create a merge commit**, so the history keeps the "Merge pull request #N" commits.
- **Tags** go on `main`, after a promotion.
- **`flags-server/flags.json` is a special case.** Local experiments (such as `betaBadge: true`) must never be committed. Stage files by name, never with `git add -A` or `git add .`.

## Before you run anything

Every git command depends on where you are. Check first:

```
pwd
git branch --show-current
git status
```

- `pwd` must show `/Users/robertcontursi/Documents/git/react-rn-practice`, the repo root. Your directory carries over between commands, so a stray `cd` sticks. Relative paths like `web/src/...` fail with `pathspec did not match any files` anywhere else.
- `git branch --show-current` prints the branch you're on.

## The workflow

### 1. Start from an up-to-date `dev`

```
git checkout dev
git pull
git checkout -b feature/<name>
```

`git pull` updates the branch you're standing on, so switch to `dev` first. The last command creates the new branch and switches to it.

### 2. Make changes, then build locally

```
cd web && npm run build && cd ..
```

`&&` runs the next command only if the previous one succeeded. If the build fails, the trailing `cd ..` is skipped and you're left inside `web/`, so run `cd ..` yourself. The build is `tsc -b && vite build`, the same check CI runs. `noUnusedLocals` is on, so an unused import fails it.

### 3. Stage by name, then commit

```
git add <file1> <file2> ...
git status --short
git commit -m "Say why, not just what"
```

In `git status --short`, the first column is staged and the second is unstaged. `M ` or `A ` means staged. ` M` (leading space) means modified but not staged. Confirm that `flags-server/flags.json` shows ` M`, not `M `. If any path in `git add` doesn't exist, git aborts the whole command and stages nothing.

### 4. Push the branch

```
git push -u origin feature/<name>
```

`-u` sets upstream tracking, so later pushes on this branch are just `git push`. GitHub prints a "Create a pull request" link. That link defaults to `main` as the base, so don't use it without changing the base to `dev`.

### 5. Open a PR into `dev`

```
gh pr create --base dev --head feature/<name> --title "Title" --body "What and why."
```

It prints the PR URL. The number at the end is the PR number. The browser route works too: on the PR form, set **base: `dev`**.

### 6. Watch CI

```
gh pr checks <number>
```

Wait until `web-ci`, `mobile-ci`, and `flags-server-ci` all show `pass`. Each may appear twice, once for the `push` event and once for the `pull_request` event. Both should pass. `pending` means wait and run it again.

### 7. Review

In the browser, on the PR's **Files changed** tab:

1. Hover over a line and click the blue **+**.
2. Write the comment and click **Start a review**. The comment is now marked **Pending**.
3. Click **Submit review** at the top right (it opens a **Finish your review** window), choose **Comment**, and click **Submit review**.

### 8. Address the feedback

Fix the file, then:

```
cd web && npm run build && cd ..
git add <fixed file>
git commit -m "Address review feedback: <what>"
git push
```

A plain `git push` updates the open PR, and CI re-runs. Then reply to your review comment and click **Resolve conversation**.

### 9. Merge into `dev`

Check that the PR's base is `dev` and all checks are green. Click **Merge pull request**, choose **Create a merge commit**, and confirm. Verify from the terminal:

```
gh pr view <number> --json state,mergedAt
```

`state` should be `MERGED`.

### 10. Sync your local `dev`

```
git checkout dev
git pull
git log --oneline -3
```

The pull fast-forwards `dev` to GitHub's copy. `git fetch` alone would only download the new commits and leave your local branch untouched. Your local branch is behind until you pull.

### 11. Promote `dev` → `main`

```
gh pr create --base main --head dev --title "Promote dev to main (<what>)" --body "Promotes <what> from dev to main."
gh pr checks <number>
```

When the checks pass, merge in the browser with **Create a merge commit**. **Do not delete `dev` or `main` afterward.** They are long-lived branches.

The merge triggers `deploy-prod.yml` on `main`. Check it:

```
gh run list --workflow deploy-prod.yml --limit 1
```

It should read `completed success` after about 20 seconds. The Vercel production deployment finishes a little later. Then open the production site and check the change.

### 12. Tag the release on `main`

```
git checkout main
git pull
git log --oneline -1
git tag -a v<x.y.z> -m "Release message"
git push origin v<x.y.z>
git tag -n
```

Always `git pull` after switching to `main`. The message "up to date with origin/main" only compares against your last fetch, so it can be stale. The `git log` line should show the promotion's merge commit. A normal `git push` doesn't send tags, so the second push is required. `-a` makes an annotated tag, which stores a message, author, and date.

### 13. Clean up

```
git checkout dev
git pull
git branch -d feature/<name>
git fetch --prune
git branch -r
```

Run the delete from `dev` after pulling, so Git can see the branch is merged. `git fetch --prune` drops remote branches that no longer exist on GitHub. If `origin/feature/<name>` still appears in `git branch -r`, delete it with `git push origin --delete feature/<name>`, or use **Delete branch** on the merged PR page.

## Problems you may hit

| Message or symptom | Cause | Fix |
| --- | --- | --- |
| `pathspec '...' did not match any files` | You're not in the repo root | `pwd`, then `cd /Users/robertcontursi/Documents/git/react-rn-practice` |
| A command "does nothing" | It was typed without the `!` prefix, so it went to chat | Re-send it as `! <command>` |
| `Your local changes to the following files would be overwritten by checkout` | Uncommitted edits, and the target branch has a different version of that file | `git stash`, switch branches, then `git stash pop` later (or `git stash drop` to discard). `git stash list` shows what's stashed. |
| `Your branch is behind 'origin/...' by N commits, and can be fast-forwarded` | Local branch is out of date | `git pull` |
| `Your branch is up to date with 'origin/main'` but GitHub has newer commits | The comparison uses your last fetch | `git pull` |
| `Declared but its value is never read` (TypeScript) | An import with nothing using it. `noUnusedLocals` is on, and it would fail CI. | Use it (for example add the `<Route>`) or remove the import |
| Push to `dev` or `main` rejected | Branch protection | Open a PR instead |
| PR shows `main` as base | GitHub's default | Change base to `dev`, or pass `--base dev` |
| `gh pr create` says a PR already exists | You already opened one for that branch | `gh pr list`, and use the existing one |
| Two entries per CI job in `gh pr checks` | `push` and `pull_request` events both ran | Normal. Both should pass. |

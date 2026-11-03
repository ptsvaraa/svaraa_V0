#!/bin/sh
# Husky pre-push: only branches named `main` or `type/FE-XX-short-name` may be pushed.
#   types: feat, fix, chore, refactor, test, docs
#   e.g.   feat/FE-02-sign-in
# Git sends one line per ref on stdin: <local ref> <local sha> <remote ref> <remote sha>.

PATTERN='^(feat|fix|chore|refactor|test|docs)/FE-[0-9]+-[a-z0-9]+(-[a-z0-9]+)*$'
ZERO=0000000000000000000000000000000000000000
status=0

while read -r _local_ref local_sha remote_ref _remote_sha; do
  case "$remote_ref" in
    refs/heads/*) ;;
    *) continue ;; # tags and other refs are not branches
  esac
  branch=${remote_ref#refs/heads/}
  [ "$local_sha" = "$ZERO" ] && continue # deleting a branch is always allowed
  [ "$branch" = "main" ] && continue
  if ! printf '%s' "$branch" | grep -Eq "$PATTERN"; then
    echo "Push rejected: branch '$branch' is not named type/FE-XX-short-name." >&2
    echo "  types: feat, fix, chore, refactor, test, docs   example: feat/FE-02-sign-in" >&2
    echo "  rename it with: git branch -m <new-name>" >&2
    status=1
  fi
done

exit $status

/**
 * Commit messages: type(FE-XX): message
 *   types:  feat, fix, chore, refactor, test, docs
 *   ticket: FE-XX is required, e.g. feat(FE-02): add phone sign-in
 * Checked by the Husky commit-msg hook. See CONTRIBUTING.md.
 */
const TYPES = ['feat', 'fix', 'chore', 'refactor', 'test', 'docs'];

/** @type {import('@commitlint/types').UserConfig} */
module.exports = {
  plugins: [
    {
      rules: {
        'ticket-scope': (parsed) => {
          const ok = /^FE-\d+$/.test(parsed.scope ?? '');
          return [ok, 'the scope must be a ticket ID such as FE-02, e.g. "feat(FE-02): add phone sign-in"'];
        },
      },
    },
  ],
  rules: {
    'type-empty': [2, 'never'],
    'type-enum': [2, 'always', TYPES],
    'scope-empty': [2, 'never'],
    'ticket-scope': [2, 'always'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};

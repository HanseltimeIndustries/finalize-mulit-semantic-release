import { parseDecoratedLogs } from './parseDecoratedLogs'

const TEST_LOG_FILE = `0acaa719614d92c18a8adb4a56719ab99b9522fd  (HEAD, tag: test-tag, tag: @hanseltime/example-app@1.2.0-prerelease-branch.2, origin/prerelease-branch, prerelease-branch)
40cd02e90871431f557f2c4a0663f0a52e595629 
a7793fece3832889363d0b1f4f390154312fcab8  (tag: @hanseltime/example-app@1.2.0-prerelease-branch.1)
5e755e5754cee8df0930b8fd241724b802f3f748 
256d4aedcc5b63dcc691f9b306c9920290124d64  (origin/develop, no-git-commit, develop)
0ea288fa3cf535b06b0789e473f10c4c29408cee 
85a8857622b39bf5db32c2a9c1d7668cbd4588c5  (rc)
04f76074eff669edd4174b6188db1a4c1af1d8cb 
fd3d990c3309e1df7ec6a84147be3ee7b8c3eb0f  (tag: another-test-tag, tag: @hanseltime/example-app@1.2.0-develop.2)
`

const EXPECTED_PARSED = [
  {
    sha: '0acaa719614d92c18a8adb4a56719ab99b9522fd',
    tags: ['test-tag', '@hanseltime/example-app@1.2.0-prerelease-branch.2'],
    extraDecorators: ['HEAD', 'origin/prerelease-branch', 'prerelease-branch'],
  },
  {
    sha: '40cd02e90871431f557f2c4a0663f0a52e595629',
    tags: [],
    extraDecorators: [],
  },
  {
    sha: 'a7793fece3832889363d0b1f4f390154312fcab8',
    tags: ['@hanseltime/example-app@1.2.0-prerelease-branch.1'],
    extraDecorators: [],
  },
  {
    sha: '5e755e5754cee8df0930b8fd241724b802f3f748',
    tags: [],
    extraDecorators: [],
  },
  {
    sha: '256d4aedcc5b63dcc691f9b306c9920290124d64',
    tags: [],
    extraDecorators: ['origin/develop', 'no-git-commit', 'develop'],
  },
  {
    sha: '0ea288fa3cf535b06b0789e473f10c4c29408cee',
    tags: [],
    extraDecorators: [],
  },
  {
    sha: '85a8857622b39bf5db32c2a9c1d7668cbd4588c5',
    tags: [],
    extraDecorators: ['rc'],
  },
  {
    sha: '04f76074eff669edd4174b6188db1a4c1af1d8cb',
    tags: [],
    extraDecorators: [],
  },
  {
    sha: 'fd3d990c3309e1df7ec6a84147be3ee7b8c3eb0f',
    tags: ['another-test-tag', '@hanseltime/example-app@1.2.0-develop.2'],
    extraDecorators: [],
  },
]

describe('parseDecoratedLogs', () => {
  it('parses all lines including non-decorated ones', () => {
    expect(
      parseDecoratedLogs(TEST_LOG_FILE, {
        onlyDecorated: false,
        toLowerCase: false,
      }),
    ).toEqual(EXPECTED_PARSED)
  })
  it('parses only the lins that are decorated', () => {
    const f = EXPECTED_PARSED.filter((p) => p.tags.length > 0 || p.extraDecorators.length > 0)
    expect(
      parseDecoratedLogs(TEST_LOG_FILE, {
        onlyDecorated: true,
        toLowerCase: false,
      }),
    ).toEqual(f)
  })
})

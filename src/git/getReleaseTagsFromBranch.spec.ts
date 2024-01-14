import { getReleaseTagsFromBranch } from './getReleaseTagsFromBranch'
import { DecoratedLog } from './parseDecoratedLogs'

describe('getReleaseTagsFromBranch', () => {
  const prereleaseBranch = 'my-prerelease'
  const packageA = 'packageA'
  const packageB = 'package-something'
  const scopedPackage = '@myscope/scope-package'
  const TEST_LOG_SET: DecoratedLog[] = [
    // Only applies to stable versions
    {
      sha: '1',
      extraDecorators: [],
      tags: [`${packageA}@1.2.4`, `${packageB}@1.3.2`],
    },
    {
      sha: '3',
      extraDecorators: [],
      tags: [`${packageA}@1.2.7`, `${scopedPackage}@2.0.1`],
    },
    // Should be higher in the list
    {
      sha: '2',
      extraDecorators: [],
      tags: [`${packageA}@1.2.5`, `${packageB}@1.7.1`],
    },
    // prerelease branch and non-prerelease mixed
    {
      sha: '4',
      extraDecorators: [],
      tags: [`${packageA}@1.2.8-${prereleaseBranch}.44`, `${packageA}@1.2.8`],
    },
    // Prerelease
    {
      sha: '5',
      extraDecorators: [],
      tags: [`${packageA}@1.2.8-${prereleaseBranch}.45`, `${packageB}@1.2.8-${prereleaseBranch}.1`],
    },
    // Prerelease
    {
      sha: '6',
      extraDecorators: [],
      tags: [
        `${packageB}@1.2.9-${prereleaseBranch}.1`,
        `${scopedPackage}@2.3.1-${prereleaseBranch}.2`,
      ],
    },
  ]
  it('returns ordered prerelease tags', () => {
    expect(
      getReleaseTagsFromBranch(TEST_LOG_SET, {
        branch: prereleaseBranch,
      }),
    ).toEqual({
      [packageA]: [
        {
          sha: '5',
          version: `1.2.8-${prereleaseBranch}.45`,
        },
        {
          sha: '4',
          version: `1.2.8-${prereleaseBranch}.44`,
        },
      ],
      [packageB]: [
        {
          sha: '6',
          version: `1.2.9-${prereleaseBranch}.1`,
        },
        {
          sha: '5',
          version: `1.2.8-${prereleaseBranch}.1`,
        },
      ],
      [scopedPackage]: [
        {
          sha: '6',
          version: `2.3.1-${prereleaseBranch}.2`,
        },
      ],
    })
  })
  it('returns ordered stable tags', () => {
    expect(
      getReleaseTagsFromBranch(TEST_LOG_SET, {
        branch: 'someMain',
        isStable: true,
      }),
    ).toEqual({
      //   tags: [`${packageA}@1.2.4`, `${packageB}@1.3.2`],
      // },
      // // Should be higher in the list
      // {
      //   sha: '2',
      //   extraDecorators: [],
      //   tags: [`${packageA}@1.2.5`, `${packageB}@1.7.1`],
      // },
      // {
      //   sha: '3',
      //   extraDecorators: [],
      //   tags: [`${packageA}@1.2.7`, `${scopedPackage}@2.0.1`],
      // },
      // // prerelease branch and non-prerelease mixed
      // {
      //   sha: '4',
      //   extraDecorators: [],
      //   tags: [`${packageA}@1.2.8-${prereleaseBranch}.44`, `${packageA}@1.2.8`],
      // },
      [packageA]: [
        {
          sha: '4',
          version: '1.2.8',
        },
        {
          sha: '3',
          version: '1.2.7',
        },
        {
          sha: '2',
          version: '1.2.5',
        },
        {
          sha: '1',
          version: '1.2.4',
        },
      ],
      [packageB]: [
        {
          sha: '2',
          version: '1.7.1',
        },
        {
          sha: '1',
          version: '1.3.2',
        },
      ],
      [scopedPackage]: [
        {
          sha: '3',
          version: '2.0.1',
        },
      ],
    })
  })
})

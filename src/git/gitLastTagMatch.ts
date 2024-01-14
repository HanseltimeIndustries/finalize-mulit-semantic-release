import { mustSucceedSpawnSync } from '../utils'

interface GetLastTagMatchOptions {
  tagGlob: string
}

export function gitLastTagMatch(options: GetLastTagMatchOptions) {
  const ret = mustSucceedSpawnSync(
    'git',
    ['describe', '--long', '--tags', '--match', options.tagGlob],
    {
      stdio: 'pipe',
    },
  )
  const rawOutput = ret.stdout?.toString()?.trim()

  const describeFormat = /(?<tag>.*)-\d+-.*$/g
  const match = describeFormat.exec(rawOutput)
  if (match && match.groups && match.groups.tag) {
    return match.groups.tag
  }

  throw new Error(`Could not find tag from current HEAD that matched ${options.tagGlob}`)
}

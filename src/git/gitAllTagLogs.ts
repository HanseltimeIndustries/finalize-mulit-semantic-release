import { mustSucceedSpawnSync } from '../utils'

interface GitallTagLogsOptions {
  // Inclusive tag to get tags on
  toTag?: string
}

export function gitAllTagLogs(options: GitallTagLogsOptions): string {
  if (options.toTag) {
    const ret = mustSucceedSpawnSync(
      'git',
      ['--no-pager', 'log', '--tags', '--pretty="%H %d"', `${options.toTag}^..HEAD`],
      {
        stdio: 'pipe',
      },
    )
    return ret.stdout?.toString()?.trim()
  }

  // Use no-walk to only get all tags of the repo
  const ret = mustSucceedSpawnSync(
    'git',
    ['--no-pager', 'log', '--tags', '--pretty="%H %d"', '--no-walk'],
    {
      stdio: 'pipe',
    },
  )
  return ret.stdout?.toString()?.trim()
}

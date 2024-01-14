import { mustSucceedSpawnSync } from '../utils'

/**
 * Returns the message at a given offset from HEAD, excluding merge commits
 * @returns
 */
export function gitMessageOffset(offset: number): string | undefined {
  const ret = mustSucceedSpawnSync(
    'git',
    ['--no-pager', 'log', '--format=%s', '-n', '1', '--no-merges', `--skip=${offset}`],
    {
      stdio: 'pipe',
    },
  )

  return ret.stdout?.toString()?.trim()
}

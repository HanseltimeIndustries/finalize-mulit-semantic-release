import { mustSucceedSpawnSync } from '../utils'

/**
 * Returns the current message of the repository
 * @returns
 */
export function gitCurrentMessage(noMerges: boolean): string | undefined {
  const extra = noMerges ? ['--no-merges'] : []
  const ret = mustSucceedSpawnSync(
    'git',
    ['--no-pager', 'log', '--format=%s', '-n', '1', ...extra],
    {
      stdio: 'pipe',
    },
  )

  return ret.stdout?.toString()?.trim()
}

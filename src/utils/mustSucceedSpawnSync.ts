import { spawnSync, SpawnSyncOptions, SpawnSyncReturns } from 'child_process'

/**
 * Ensures that a spawnSync call was successful by normal shell running metrics
 * @param cmd
 * @param args
 * @param options
 * @returns
 */
export function mustSucceedSpawnSync(
  cmd: string,
  args: string[],
  options?: SpawnSyncOptions,
): SpawnSyncReturns<string | Buffer> {
  const ret = spawnSync(cmd, args ?? [], options)
  if (ret.error) {
    throw ret.error
  }
  if (ret.status !== 0) {
    if (!ret.status) {
      throw new Error(`"${cmd} ${args.join(' ')}" failed due to interrupt`)
    }
    throw new Error(`"${cmd} ${args.join(' ')}" failed with code: ${ret.status}`)
  }
  return ret
}

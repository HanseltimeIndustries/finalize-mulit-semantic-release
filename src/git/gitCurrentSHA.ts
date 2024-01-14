import { mustSucceedSpawnSync } from '../utils'

export function gitCurrentSHA() {
  const branchRet = mustSucceedSpawnSync('git', ['rev-parse', 'HEAD'])
  return branchRet.stdout.toString().trim()
}

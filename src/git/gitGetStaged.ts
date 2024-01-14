import { mustSucceedSpawnSync } from '../utils'

export function gitGetStaged() {
  const branchRet = mustSucceedSpawnSync('git', ['diff', '--cached', '--name-only'])
  return branchRet.stdout
    .toString()
    .trim()
    .split('\n')
    .filter((file) => !!file)
}

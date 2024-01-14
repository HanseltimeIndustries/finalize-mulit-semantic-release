/* eslint-disable no-console */
import { mustSucceedSpawnSync } from '../utils'

export function gitCurrentBranch() {
  const branchRet = mustSucceedSpawnSync('git', ['branch', '--show-current'])
  let branch = branchRet.stdout.toString().trim()
  if (!branch) {
    if (!process.env.BRANCH_NAME) {
      throw new Error('On detached branch with no BRANCH_NAME environment variable.  Cannot push.')
    }
    console.log(`On Detached branch, so using ${process.env.BRANCH_NAME} as target`)
    branch = process.env.BRANCH_NAME
  }
  return branch
}

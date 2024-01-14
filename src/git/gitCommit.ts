import { mustSucceedSpawnSync } from '../utils'

interface GitCommitOptions {
  message: string
}

export function gitCommit(options: GitCommitOptions) {
  mustSucceedSpawnSync('git', ['commit', '-m', options.message], {
    stdio: 'inherit',
  })
}

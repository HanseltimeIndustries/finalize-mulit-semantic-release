import { mustSucceedSpawnSync } from '../utils'

export interface PushOptions {
  // If a gitToken is provided, we will use this to authorize the push
  gitToken?: string
  // The branch or tag to push
  refspec: string
  addTags: boolean
}

/**
 * Abstracts away git pushing and accounting for git token pushes
 * (necessary from non-globally authed environments like Jenkins runners)
 * @param branch
 * @param gitToken
 */
export function gitPush(options: PushOptions) {
  const originRet = mustSucceedSpawnSync('git', ['remote', 'get-url', '--push', 'origin'])
  const originUrl = originRet.stdout.toString().trim()
  if (!originUrl) {
    throw new Error('Could not find the origin url')
  }
  let authedOrigin = originUrl
  const { gitToken } = options
  if (gitToken) {
    authedOrigin = `${originUrl.replace('https://', `https://${gitToken}@`)}`
  }

  const tagArgs = options.addTags ? ['--tags'] : []
  mustSucceedSpawnSync('git', ['push', authedOrigin, ...tagArgs, options.refspec], {
    stdio: 'inherit',
  })
}

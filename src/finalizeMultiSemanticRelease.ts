import {
  gitCurrentBranch,
  gitLastTagMatch,
  parseDecoratedLogs,
  gitAllTagLogs,
  getReleaseTagsFromBranch,
  gitPush,
  gitAdd,
  gitTag,
  gitCommit,
  gitGetStaged,
  gitCurrentSHA,
} from './git'
import { getWorkspaces } from './filesystem'
import { existsSync } from 'fs'
import { updateReleaseFile } from './filesystem/updateReleaseFile'

const FULL_RELEASE_PREFIX = 'full-release-'

export interface FinalizeMultiSemanticReleaseOptions {
  // The path (relative to the working directory) of the monorepo root
  root: string
  // This needs to be the name of the stable branch.  All other branches are considered prefixed
  // TODO: we would add mappings for branches that have different names
  stableBranch: string
  // The git token for pushing.  If not specified, uses the currently configured git cli
  gitToken?: string
  // If set, this will skip pushing the changes made to local
  noPush?: boolean
  // If set, this will skip committing and pushing
  noCommit?: boolean
}

const FINALIZE_MESSAGE_BASE = 'docs(full-release):'

export async function finalizeMultiSemanticRelease(options: FinalizeMultiSemanticReleaseOptions) {
  if (!existsSync(options.root)) {
    throw new Error(`Cannot find the monorepo root at ${options.root}`)
  }

  const branch = gitCurrentBranch()
  const currentSHA = gitCurrentSHA()

  const finalTagBase = `${FULL_RELEASE_PREFIX}${branch}`
  const thisFinalizeTag = `${FULL_RELEASE_PREFIX}${branch}${currentSHA}`
  const tagGlob = `${finalTagBase}*`
  let lastTag: string | undefined
  try {
    lastTag = gitLastTagMatch({
      tagGlob,
    })
  } catch (err) {
    console.log(
      `Could not find previous finalize tag ${tagGlob}.  Assuming this is the first finalize release for branch and using all tags.`,
    )
  }

  const isStableBranch = branch === options.stableBranch

  const decoratedLog = parseDecoratedLogs(
    gitAllTagLogs({
      toTag: lastTag,
    }),
    {
      onlyDecorated: true,
      toLowerCase: true,
    },
  )
  const releaseTagMap = getReleaseTagsFromBranch(decoratedLog, {
    branch,
    isStable: isStableBranch,
  })
  console.log(`ReleaseTagMap is ${JSON.stringify(releaseTagMap)}`)

  const wInfos = await getWorkspaces(options.root)

  console.log(`Important!  Only releasing listed workspaces in the package root: ${options.root}`)
  const versionedFiles = [] as {
    version: string
    versionFilePath: string
  }[]
  wInfos.forEach((wInfo) => {
    if (releaseTagMap[wInfo.pkgName]) {
      // TODO: update the correct folder
      console.log(
        `Would be updating the release record for: ${wInfo.pkgName} to ${
          releaseTagMap[wInfo.pkgName][0].version
        }`,
      )
      const version = releaseTagMap[wInfo.pkgName][0].version
      versionedFiles.push({
        version,
        versionFilePath: updateReleaseFile(wInfo, branch, version),
      })
    }
  })

  if (versionedFiles.length === 0) {
    console.log('No deploys detected for workspaces.  No need to commit')
  }

  gitAdd({
    paths: versionedFiles.map((vf) => vf.versionFilePath),
  })

  // Ensure that we queued something (no empty commits)
  if (gitGetStaged().length > 0) {
    const message = `${FINALIZE_MESSAGE_BASE} ${currentSHA}\n\n${versionedFiles
      .map((vf) => vf.version)
      .join('\n')}`
    if (!options.noCommit) {
      gitCommit({
        message,
      })
      gitTag({
        tag: thisFinalizeTag,
        message,
      })
      if (!options.noPush) {
        gitPush({
          addTags: true,
          refspec: branch,
          gitToken: options.gitToken,
        })
      } else {
        console.log(`NoPush: Added commit and tag "${thisFinalizeTag}"`)
      }
    } else {
      console.log(`NoCommit: Would have set commit:\n${message}`)
    }
  } else {
    // This accounts for the scenario where somehow the release file was up-to-date
    console.log('No deploys detected for workspaces.  No need to commit')
  }
}

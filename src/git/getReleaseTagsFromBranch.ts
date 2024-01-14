import { DecoratedLog } from './parseDecoratedLogs'
import { gt } from 'semver'

interface GetReleaseTagsForBranchOptions {
  branch: string
  // If stable, this means we are looking for non-prereleased tags
  isStable?: boolean
}

interface ReleaseTagsMap {
  // List of version tags (sorted highest to lowest)
  [packageName: string]: {
    // The sha of the commit
    sha: string
    version: string
  }[]
}

/**
 * Given a set of DecoratedLogs, we get the Release Tags for the given branch and return
 * them as a map of ordered tags for each package
 *
 * @param decoratedLogs
 * @param options
 * @returns
 */
export function getReleaseTagsFromBranch(
  decoratedLogs: DecoratedLog[],
  options: GetReleaseTagsForBranchOptions,
): ReleaseTagsMap {
  const postFix = options.isStable ? '' : `-${options.branch}\\.\\d+`
  const regex = new RegExp(`^(?<pkg>.+)@(?<version>\\d+\\.\\d+\\.\\d+${postFix})$`)
  const unsortedMap = decoratedLogs.reduce((map, dLog) => {
    dLog.tags.forEach((tag) => {
      const versionMatch = regex.exec(tag.trim())
      if (versionMatch) {
        const { pkg, version } = versionMatch.groups! as {
          pkg: string
          version: string
        }
        const payload = {
          sha: dLog.sha,
          version,
        }
        if (!map[pkg]) {
          map[pkg] = [payload]
        } else {
          map[pkg].push(payload)
        }
      }
    })
    return map
  }, {} as ReleaseTagsMap)

  // inline edit the map
  Object.keys(unsortedMap).forEach((pkgKey) => {
    // Note - we flip sort for the correct ordering
    unsortedMap[pkgKey] = unsortedMap[pkgKey].sort((a, b) => (gt(a.version, b.version) ? -1 : 1))
  })

  return unsortedMap
}

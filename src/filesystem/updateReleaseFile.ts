import { dirname, join } from "path"
import { WorkSpaceInfo } from "./getWorkspaces"
import { existsSync, mkdirSync, writeFileSync } from "fs"

export function updateReleaseFile(wInfo: WorkSpaceInfo, branch: string, version: string): string {
    const dir = dirname(wInfo.url)
    const releasesDir = join(dir, '.releases')
    if (!existsSync(releasesDir)) {
      mkdirSync(releasesDir)
    }
  
    const versionPath = join(releasesDir, `${branch}.yml`)
    writeFileSync(
      versionPath,
      `# Stable release file for ${branch} that can be used for gitops\n` +
        '# and indicates what successful set of multiple releases was performed on the branch.\n' +
        '# DO NOT EDIT this by hand.  This should be a script call after successful release.\n' +
        `version: ${version}\n`,
    )
  
    return versionPath
  }
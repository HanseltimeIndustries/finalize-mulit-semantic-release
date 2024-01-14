import { join, resolve } from 'path'
import { glob } from 'glob'
import { readFileSync } from 'fs'
import { getPackageJson } from './getPackageJson'
import type { JSONSchemaForNPMPackageJsonFiles2 as Body } from '@schemastore/package'

export interface WorkSpaceInfo {
  // Absolute url to the workspace package.json
  url: string
  // The pkg Name
  pkgName: string
  // If the package is package.json private
  private: boolean
}

/**
 * Returns the workspaces associated with the root project in this monorepo
 *
 * @param {string} packageJsonDir the path to the directory with the package.json that we want to look at
 * @returns {Promise<{url: string, pkgName: string, private: boolean}[]>} Returns an array of absolute urls to
 *    the packagejson for a given pkgName.
 */
export async function getWorkspaces(packageJsonDir: string): Promise<WorkSpaceInfo[]> {
  const workspaceInfo: {
    url: string
    pkgName: string
    private: boolean
  }[] = []
  const rootPackageJson = getPackageJson(packageJsonDir)
  if (!rootPackageJson) {
    throw new Error(`Cannot find package JSON at ${packageJsonDir}`)
  }
  if (!rootPackageJson || !rootPackageJson.workspaces) {
    return []
  }

  if (!Array.isArray(rootPackageJson.workspaces)) {
    throw new Error(
      `Array of paths is only supported for workspaces.  Got: ${JSON.stringify(rootPackageJson.workspaces)}`,
    )
  }

  if (rootPackageJson.workspaces.length < 1) {
    return []
  }

  for (const workspace of rootPackageJson.workspaces as string[]) {
    const files = await glob(`${workspace}/package.json`, {
      cwd: packageJsonDir,
    })
    files.forEach((file) => {
      const json = JSON.parse(readFileSync(join(packageJsonDir, file)).toString()) as Body
      workspaceInfo.push({
        url: resolve(packageJsonDir, file),
        pkgName: json.name ?? '',
        private: !!json.private,
      })
    })
  }
  return workspaceInfo
}

module.exports = {
  getWorkspaces,
}

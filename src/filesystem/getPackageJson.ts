import { readFileSync } from 'fs'
import { join } from 'path'
import type { JSONSchemaForNPMPackageJsonFiles2 as Body } from '@schemastore/package'

export function getPackageJson(dir: string): Body {
  return JSON.parse(readFileSync(join(dir, 'package.json')).toString()) as Body
}

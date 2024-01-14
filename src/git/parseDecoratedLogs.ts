export interface DecoratedLog {
  sha: string
  tags: string[]
  // TODO: this could be parsed further but we have no need for it
  extraDecorators: string[]
}

interface Options {
  // If true, it does not return any non-decorated logs that may have been found between commits
  onlyDecorated: boolean
  // Returns all tags to lowercase
  toLowerCase: boolean
}

/**
 * Function that expects a file of lines where there is <hash> (branch & tag info)
 *
 * Created by gitAllTagLogs
 *
 * Example:
 * 0acaa719614d92c18a8adb4a56719ab99b9522fd  (HEAD -> alpha, tag: test-tag, tag: @hanseltime/app@1.2.0, origin/alpha)
 * 40cd02e90871431f557f2c4a0663f0a52e595629
 * a7793fece3832889363d0b1f4f390154312fcab8  (tag: @hanseltime/app@1.2.0-alpha.1)
 * 5e755e5754cee8df0930b8fd241724b802f3f748
 * 85a7efa3478b7d0ec5333a9f149b09f07881db1d
 * aa47f4df0f6bf6c59caf019be5d6d55a76324da0
 * 256d4aedcc5b63dcc691f9b306c9920290124d64  (origin/main, main)
 * 0ea288fa3cf535b06b0789e473f10c4c29408cee
 *
 */
export function parseDecoratedLogs(logs: string, options: Options): DecoratedLog[] {
  const { onlyDecorated, toLowerCase } = options
  const logLines: DecoratedLog[] = []
  // Inline processing to avoid extra memory footprint
  let i = 0
  while (i < logs.length) {
    let j = logs.indexOf('\n', i)
    if (j === -1) j = logs.length
    const line = logs.substring(i, j).trim()

    const lineRegex = /(?<hash>[a-zA-Z0-9]+)\s*(\((?<decorators>.*)\))?/
    const match = lineRegex.exec(line)
    if (match && match.groups) {
      if (!match.groups.decorators) {
        if (!onlyDecorated) {
          logLines.push({
            sha: match.groups.hash!,
            tags: [],
            extraDecorators: [],
          })
        }
      } else {
        const tagMatchRegex = /^tag:\s*(?<tag>[^\s]+)/
        const decorInfo = match.groups.decorators!.split(',').reduce(
          (info, token) => {
            const tagMatch = tagMatchRegex.exec(token.trim())
            if (tagMatch) {
              info.tags.push(convertCase(tagMatch.groups!.tag, { toLowerCase }))
            } else {
              info.extraDecorators.push(convertCase(token.trim(), { toLowerCase }))
            }
            return info
          },
          {
            tags: [] as string[],
            extraDecorators: [] as string[],
          },
        )
        logLines.push({
          ...decorInfo,
          sha: match.groups.hash!,
        })
      }
    }
    i = j + 1
  }
  return logLines
}

function convertCase(
  str: string,
  options: {
    toLowerCase: boolean
  },
) {
  if (options.toLowerCase) {
    return str.toLowerCase()
  }
  return str
}

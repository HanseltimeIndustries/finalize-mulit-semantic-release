#!/usr/bin/env node
import { program } from 'commander'
import { finalizeMultiSemanticRelease } from '../finalizeMultiSemanticRelease'

interface CLIOptions {
  root: string
  stableBranch: string
  noCommit: boolean
  noPush: boolean
}

program
  .description(
    `Given the current commit, this will look for all commits from the last successful commit of this
  script up to this commit.  It will then aggregate a list of all multi-semantic-release tags for the particular branch
  prerelease or stable branch and then update each package repo's .releases/<branch>.yml with the latest version of the
  tags for that package release.  It will then commit a tagged commit to mark the next "up to" point for this script.
  
  Since this script pushes to your repo, you can provide a GIT_TOKEN environment variable to override the user authorization
  for the push.  Otherwise, the currently configured git user will be used.
  `,
  )
  .requiredOption('--root <path>', 'The path that is the npm monorepo root')
  .requiredOption(
    '-s, --stableBranch <branch>',
    'The name of the branch that is not prerelease (assumes all prereleases are tagged with their names per semantic-release)',
  )
  .option('--noCommit', 'Will not commit or tag anything')
  .option('--noPush', 'Will not push to the remote but will apply the commit or tag')

program.parse()
const options = program.opts<CLIOptions>()

// Run the actual program
void finalizeMultiSemanticRelease({
  root: options.root,
  stableBranch: options.stableBranch,
  gitToken: process.env.GIT_TOKEN,
  noCommit: options.noCommit,
  noPush: options.noPush,
})

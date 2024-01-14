# monorepo-semantic-release-finalizer

This package is meant to be run with a particular monorepo configuration of semantic-relesae.  The primary problem that
this solves for is that git commit histories can get very verbose if we do a "git" commit per package via semantic-release.
Additionally, if you would like to run a git-flow pattern for repositories that have a high number of contributors, you
will run into the pain of trying to merge back a hotfix and seeing your package.json not particulary be indicative of your
"currently" deployed version.

# The Pattern:

At it's most basic, you can use this repo with the following CI/CD rules:

1. Your CI/CD job only ever runs one job for a branch at a time
   1. You cannot run a commit that is not the HEAD at the time of invoking
2. Your semantic-release jobs do not commit (only apply tags)
   1. This does mean that you are no longer version controlling your changelogs, etc. but you can deploy them to
      other persistence stores like github deployments.
3. You run this script and only apply changes that cannot affect semantic-release re-running
   1. You only run this script after all semantic-releases have succeeded
4. 

# How it works:

In principle, this script will run on a commit and look back for the last instance of it's own tag that it adds when successful.  If it finds
the tag, it will look at all tags between the two commits, or all tags from the beginning of the repo.

Once it has all tags, the script will determine the latest tag for each package on the commits since the last finalize commit from this script.
`<pacakge>@<version>[-<prerelease branch name>.<number>]`

For each package that has a tag applied (by semantic-release actually doing a deployment), the script will update the `.releases/<branch>.yml`
in the package root.  This is meant to keep a record of every branch's "current" successful deploy.  This way, things like gitOps tools can 
reliably look at `.releases/<branch,yaml>` and no merges from one branch to another can accidentally alter a deployment in some interim.

The idea of this whole script then, is to book end a release of a monorepo.  It ascribes to the idea that if 5 packages were meant to release
on a commit and only 3 did, then that release should not deploy itself until the other 2 packages are fixed.  Since this script will only run when semantic-release for every package can succeed, you can use these tags or the commits themselves to orchestrate the final deployment of things.

*Note* this pattern is primarily used for targetting application deploys from a monorepo, since publishing a package from the semantic-release
flow is relatively low impact (since that's opt-in).

# Using the pattern:

With the pattern established, you can now call the script in your CI/CD pipeline in conjuction with multi-semantic-release (or a similar script that obeys the same tags).

```shell
# Release all packages (won't rerelease if a tag already worked on the commit)
yarn multi-semantic-release

# Only runs on successful full deploy of all packages
yarn finalize-multi-semantic-release --root "." --stableBranch "main"
```

## Eventing on a release

You can choose to detect the commit that you have just created with this command or to run on the tag.  You will want to get all the files
that changed in the last diff and then decide how to "finally deploy" each one.
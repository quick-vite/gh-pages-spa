<!-- markdownlint-disable MD033 -->

# Contribution guide

[github-contribution-guide]: https://github.com/roots/guidelines/blob/master/CONTRIBUTING.md
[github-flow]: http://scottchacon.com/2011/08/31/github-flow.html

_This guide is based on [GitHub's example contribution guide][github-contribution-guide]
and [Scott Chacon's GitHub flow article][github-flow].  

Please take a moment to review this document in order to make the contribution process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of the developers managing and developing this open  source project.
In return, they should reciprocate that respect in addressing your issue or assessing patches and features.

## Using the issue tracker  
  
The issue tracker is the preferred channel for [bug reports](#bug-reports), [features requests](#feature-requests) and [submitting pull requests](#open-a-pull-request-at-any-time), but please respect the following restrictions:  
  
* Please **do not** derail or troll issues.
* Keep the discussion on topic and respect the opinions of others.

## Bug reports  
  
A bug is a _demonstrable problem_ that is caused by the code in the repository.
Good bug reports are extremely helpful - thank you!

Guidelines for bug reports:

1. **Use the GitHub issue search**  
   Check if the issue has already been reported.
2. **Check if the issue has been fixed**  
   Try to reproduce it using the latest `main` branch in the repository.
3. **Isolate the problem**  
   Make sure that the code in the repository is _definitely_ responsible for the issue.

A good bug report shouldn't leave others needing to chase you up for more
information. Please try to be as detailed as possible in your report.

## Feature requests  
  
Feature requests are welcome. But take a moment to find out whether your idea fits with the scope and aims of the project.  
It's up to **you** to make a strong case to convince the developers of the merits of this feature.  
Please provide as much detail and context as possible.

**Please ask first** before embarking on any significant code change (e.g. implementing features, refactoring code), otherwise you risk spending a lot of time working on something that the developers might not want to merge into the project.

### Anything in the `main` branch is deployable  
  
Make sure your code is deploy ready.
Everything is thoroughly tested by unit-tests and code inspection.
However, if you're not sure you can and should deploy an alpha version and manually test before merging.

### Create descriptive branches off of `main`  
  
<details>
   <summary>(Optional) Fork</summary>
   <br/>

[Fork](http://help.github.com/fork-a-repo/) the repo, clone your fork, and configure the remotes:

```bash
# Clone your fork of the repo into the current directory
git clone https://github.com/<your-username>/<repo-name>
# Navigate to the newly cloned directory
cd <repo-name>
# Assign the original repo to a remote called "upstream"
git remote add upstream https://github.com/<upsteam-owner>/<repo-name>
```

**If you cloned a while ago,** get the latest changes from upstream:

```bash
git checkout main
git pull upstream main
```

</details>
  
Create a new topic branch (off the `main` branch) to contain your feature, change, or fix:

```bash
git checkout -b <issue-number>-<friendly-description>
```

_It's probably easiest to use the title of the issue as the `<friendly description>`._

_**Or** (if you're not forked)_ you can use the GitHub UI:

<details>
   <summary>Using the GitHub UI</summary>

![Create a branch form an issue](./images/github-create-branch.png)  
![Create a branch form an issue wizard](./images/github-create-branch-wizard.png)  

</details>  

### Push to named branches constantly  
  
Commit your changes in logical chunks, make your change's intent clear in the message.  

Please adhere to these [git commit message guidelines](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) or your code is unlikely be merged into the main project.  
Use [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/);  

Push often, make sure other contributors can see your progress.

Regularly rebase the upstream `main` branch into your topic branch, preferably before pushing:

   ```bash
   git pull --rebase upstream main
   ```

Use Git's [interactive rebase](https://help.github.com/articles/interactive-rebase) feature to tidy up your commits before making them public.

### Open a pull request at any time  

[dod]: /.github/pull_request_template.md#definition-of-done
  
Good pull requests - patches, improvements, new features - are a fantastic help.  
They should remain focused in scope and avoid containing unrelated commits.

Your changes do not have to be ready to open a pull request.  
However if you don't intend it to be merged, please state so in your PR.  
If you do intend it to be merged, please use the auto-merge functionality.  
Please don't squash, we care about the merge history.  

[Open a Pull Request](https://help.github.com/articles/using-pull-requests/) with a clear title and description.
The target branch should be the `main` branch unless you're instructed to use a different branch by a maintainer.  
When finalizing a PR for merging all items of the [DOD][dod] have to be checked, this [DOD][dod] will be included in the PR by default.  
You're not allowed to remove items. However, feel free to add any checks if applicable.

#### Final pull request  
  
When finalizing your change please make sure you:

* State it's meant for merging
* Turn on auto merge
* Check all the items in the [DOD][dod] that's included in the PR template.

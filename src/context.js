'use strict';

/**
 * Module dependencies.
 */

const { getOctokit } = require('@actions/github');
const core = require('@actions/core');

/**
 * Constants.
 */

const expectedEventFullNames = ['pull_request.open', 'pull_request.synchronize', 'push'];

/**
 * Get pull-request associated to the event.
 */

const getPullRequest = async ({ event, octokit, repository }) => {
  // Case in which the event is associated with a pull-request.
  if (event.payload.pull_request) {
    return event.payload.pull_request;
  }

  // Check if there's a pull-request associated with the branch.
  const pullRequests = await octokit.paginate(octokit.rest.repos.listPullRequestsAssociatedWithCommit, {
    ...repository,
    commit_sha: process.env.GITHUB_SHA
  });

  const pullRequest = pullRequests.find(({ head }) => head.ref === process.env.GITHUB_REF_NAME);

  if (!pullRequest) {
    core.info(`Ignored event because there is no pull-request associated with ref ${process.env.GITHUB_REF_NAME}`);

    return null;
  }

  return pullRequest;
};

/**
 * Creates context to be used by all checkers.
 */

const createContext = async () => {
  const event = require(process.env.GITHUB_EVENT_PATH);
  const eventFullName = `${process.env.GITHUB_EVENT_NAME}${event.action ? `.${event.action}` : ''}`;

  if (!expectedEventFullNames.includes(eventFullName)) {
    core.info(`Ignored event because action ${eventFullName} is not one of: ${expectedEventFullNames.join(', ')}`);

    return null;
  }

  const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

  const context = {
    event: {
      fullName: eventFullName,
      name: eventFullName.split('.')[0],
      payload: event
    },
    inputs: {
      autoLabelling: core.getInput('auto-labelling') === 'true',
      checkBranchName: core.getInput('check-branch-name') === 'true',
      checkCommits: core.getInput('check-commits') === 'true'
    },
    octokit: getOctokit(core.getInput('repo-token')),
    repository: { owner, repo }
  };

  context.pullRequest = await getPullRequest(context);

  return context.pullRequest ? context : null;
};

/**
 * Exports.
 */

module.exports = createContext;

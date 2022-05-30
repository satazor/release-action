'use strict';

/**
 * Module dependencies.
 */

const Auto = require('@auto-it/core').default;
const core = require('@actions/core');

// const createContext = require('./context');

/**
 * Main action function.
 */

const run = async () => {
  process.env.GH_TOKEN = core.getInput('repo-token');

  const auto = new Auto({
    plugins: [`${__dirname}/../dist/auto-plugins/inject-config-plugin`],
    verbose: true
  });

  await auto.loadConfig();
  await auto.shipit();
};

run();

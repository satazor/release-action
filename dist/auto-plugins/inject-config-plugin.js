'use strict';

class InjectConfigPlugin {
  name = 'release-action/inject-config';

  apply(auto) {
    auto.hooks.modifyConfig.tap(this.name, config => ({
      ...config,
      email: 'hello@uphold.com',
      labels: [
        {
          name: 'release:major :arrow_up::hash::hash:',
          releaseType: 'major'
        },
        {
          name: 'release:minor :hash::arrow_up::hash:',
          releaseType: 'minor'
        },
        {
          name: 'release:patch :hash::hash::arrow_up:',
          releaseType: 'patch'
        },
        {
          name: 'release:skip :hash::hash::hash:',
          releaseType: 'skip'
        },
        {
          changelogTitle: '🐛 Bug Fix',
          name: 'type:bugfix :beetle:'
        },
        {
          changelogTitle: '👌 Enhancement',
          name: 'type:enhancement :ok_hand:'
        },
        {
          changelogTitle: '🚀 Feature',
          name: 'type:feature :rocket:'
        },
        {
          changelogTitle: '🥷 Hot Fix',
          name: 'type:hotfix :ninja:'
        },
        {
          changelogTitle: '🔨 Support',
          name: 'type:support :hammer:'
        }
      ],
      name: 'Uphold',
      noDefaultLabels: true
    }));
  }
}

module.exports = InjectConfigPlugin;

'use strict';

const npm = require('npm');
const semver = require('semver');

const silent = true;

const registry = {
  init () {
    return new Promise((resolve, reject) => {
      npm.load({ loglevel: 'silent', progress: false }, (error) => {
        if (error) {
          reject(error);
        }

        // silencio, por favor
        if (npm && npm.registry && npm.registry.log && npm.registry.log.level) {
          npm.registry.log.level = 'silent';
        }

        resolve();
      });
    });
  },

  info (moduleName) {
    return new Promise((resolve, reject) => {
      npm.commands.info([moduleName], silent, (error, data) => {
        if (error || !data) {
          reject(error || new Error('No data received.'));
        }

        // data is/should be a hash with property names as version number
        for (let version in data) {
          if (!data.hasOwnProperty(version) || !semver.valid(version)) {
            // look for the next valid property
            continue;
          }

          resolve(data[version]);
          return;
        }

        reject(new Error('Invalid data received.'));
      });
    });
  }
};

async function traverse (module, tree) {
  let info,
    deps,
    meta;

  if (module.version) {
    info = module;
  }
  else {
    let name = module.name + '@' + (module.mask || module.version || 'lastest');
    info = await registry.info(name);
  }

  deps = Object.keys(info.dependencies || []);
  meta = {
    semver: module.mask || info.version,
    version: info.version,
    parent: module.parent || null
  };

  if (!tree[module.name]) {
    tree[module.name] = [meta];
  }
  else {
    tree[module.name].push(meta);
  }

  return await Promise.all(deps.map(async (dep) => {
    let mask = info.dependencies[dep];
    await traverse({ name: dep, mask: mask, parent: module.name || null }, tree);
  }));
}

module.exports = {
  async fetch (pkg) {
    let tree = {},
      sorted;

    await registry.init();

    if (typeof pkg === 'string') {
      pkg = await registry.info(pkg);
    }

    await Promise.resolve(traverse(pkg, tree));

    sorted = Object.keys(tree)
      .sort()
      .reduce((result, key) => (result[key] = tree[key], result), {});

    return sorted;
  }
};

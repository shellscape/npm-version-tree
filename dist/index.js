'use strict';

let traverse = (() => {
  var _ref = _asyncToGenerator(function* (module, tree) {
    let info, deps, meta;

    if (module.version) {
      info = module;
    } else {
      let name = module.name + '@' + (module.mask || module.version || 'lastest');
      info = yield registry.info(name);
    }

    deps = Object.keys(info.dependencies || []);
    meta = {
      semver: module.mask || info.version,
      version: info.version,
      parent: module.parent
    };

    if (!tree[module.name]) {
      tree[module.name] = [meta];
    } else {
      tree[module.name].push(meta);
    }

    return yield Promise.all(deps.map((() => {
      var _ref2 = _asyncToGenerator(function* (dep) {
        let mask = info.dependencies[dep];
        yield traverse({ name: dep, mask: mask, parent: module.name }, tree);
      });

      return function (_x3) {
        return _ref2.apply(this, arguments);
      };
    })()));
  });

  return function traverse(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const npm = require('npm');
const semver = require('semver');

const silent = true;

const registry = {
  init() {
    return new Promise((resolve, reject) => {
      npm.load({ loglevel: 'silent', progress: false }, error => {
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

  info(moduleName) {
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

module.exports = {
  fetch(pkg) {
    return _asyncToGenerator(function* () {
      let tree = {},
          sorted;

      yield registry.init();

      if (typeof pkg === 'string') {
        pkg = yield registry.fetch(pkg);
      }

      yield Promise.resolve(traverse(pkg, tree));

      sorted = Object.keys(tree).sort().reduce(function (result, key) {
        return result[key] = tree[key], result;
      }, {});

      return sorted;
    })();
  }
};
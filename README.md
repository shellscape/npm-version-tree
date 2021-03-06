# npm-version-tree [![Build Status](https://travis-ci.org/shellscape/npm-version-tree.svg?branch=master)](https://travis-ci.org/shellscape/npm-version-tree)

Fetch a dependency version tree for a package

## &nbsp;
<p align="center">
  <b>:rocket: &nbsp; Are you ready to tackle ES6 and hone your JavaScript Skills?</b> &nbsp; :rocket:<br/>
  Check out these outstanding <a href="https://es6.io/friend/POWELL">ES6 courses</a> by <a href="https://github.com/wesbos">@wesbos</a>
</p>

---

\* *nvm-version-tree requires Babel, or Node v7+ and [Harmonica](https://github.com/shellscape/harmonica), or Node v7.6+*

## Install

```
$ npm install npm-version-tree
```

## Usage

### Package Name

```js
const vertree = require('npm-version-tree');

(async () => {
  let tree = await vertree.fetch('winston');
})();

// tree => {
//   async: [ { semver: '~1.0.0', version: '1.0.0', parent: 'winston' } ],
//   colors: [ { semver: '1.0.x', version: '1.0.0', parent: 'winston' } ],
//   cycle: [ { semver: '1.0.x', version: '1.0.0', parent: 'winston' } ],
//   eyes: [ { semver: '0.1.x', version: '0.1.1', parent: 'winston' } ],
//   isstream: [ { semver: '0.1.x', version: '0.1.0', parent: 'winston' } ],
//   'stack-trace': [ { semver: '0.0.x', version: '0.0.1', parent: 'winston' } ],
//   winston: [ { semver: '2.3.1', version: '2.3.1', parent: null } ]
// }

```

### Package Object

```js
const vertree = require('npm-version-tree');
const pkg = require('./package.json');

vertree.fetch(pkg).then((result) => {
  // ...
});

```

### fetch(*what*)

#### what

A `String` representing a package name, or `Object` representing a package. If
a package `Object` is passed, the package must have a `version` property.

## License

MIT © [Andrew Powell](http://shellscape.org)

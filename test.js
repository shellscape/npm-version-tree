/* eslint no-console: "off" */
'use strict';

const expect = require('chai').expect;
const vertree = require('./index');

const expected = {
  async: [ { semver: '~1.0.0', version: '1.0.0', parent: 'winston' } ],
  colors: [ { semver: '1.0.x', version: '1.0.0', parent: 'winston' } ],
  cycle: [ { semver: '1.0.x', version: '1.0.0', parent: 'winston' } ],
  eyes: [ { semver: '0.1.x', version: '0.1.1', parent: 'winston' } ],
  isstream: [ { semver: '0.1.x', version: '0.1.0', parent: 'winston' } ],
  'stack-trace': [ { semver: '0.0.x', version: '0.0.1', parent: 'winston' } ],
  winston: [ { semver: '2.3.0', version: '2.3.0', parent: null } ]
};

describe('npm-version-tree', () => {

  it('should fetch a version tree', async () => {
    let tree = await vertree.fetch('winston');

    expect(tree).to.deep.equal(expected);
  });
});

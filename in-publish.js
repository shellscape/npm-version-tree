'use strict';

// temp solution until https://github.com/iarna/in-publish/issues/8 gets fixed.

function inCommand (cmd) {
  let npm_config_argv, V;

  try {
    npm_config_argv = JSON.parse(process.env['npm_config_argv']);
  }
  catch (e) {
    return false;
  }

  if (typeof npm_config_argv !== 'object') {
    process.exit(1);
  }

  if (!npm_config_argv.cooked) {
    process.exit(1);
  }

  if (!npm_config_argv.cooked instanceof Array) {
    process.exit(1);
  }

  while ((V = npm_config_argv.cooked.shift()) !== undefined) {
    if (cmd.test(V)) {
      return true;
    }
  }

  return false;
}

process.exit(inCommand(/^pu(b(l(i(sh?)?)?)?)?$/) ? 0 : 1);

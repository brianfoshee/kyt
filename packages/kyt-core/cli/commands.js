
const program = require('commander');
const shell = require('shelljs');
const devAction = require('./actions/dev');
const lintAction = require('./actions/lint');
const testAction = require('./actions/test');
const buildAction = require('./actions/build');
const protoAction = require('./actions/proto');
const lintStyleAction = require('./actions/lintStyle');
const kytConfigFn = require('./../utils/kytConfig');
const logger = require('kyt-utils/logger');
const { userPackageJSONPath } = require('kyt-utils/paths')();

// Kill the process if the user did not run
// the command from the root of their project.
if (!shell.test('-f', userPackageJSONPath)) {
  logger.error(`kyt works best when you execute commands
    from the root of your project where kyt is installed.`);
  process.exit(1);
}

const loadConfigAndDo = (action, optionalConfig) => {
  const args = program.args.filter(item => typeof item === 'object');
  const flags = program.args.filter(item => typeof item === 'string');
  const config = kytConfigFn(optionalConfig);
  action(config, flags, args[0]);
};

program
  .command('lint')
  .description('lints .js files in the ./src directory.')
  .action(() => loadConfigAndDo(lintAction));

program
  .command('dev')
  .option('-C, --config <path>', 'config path')
  .description('Start an express server for development')
  .action(() => {
    const args = program.args.filter(item => typeof item === 'object');
    const config = args[0].config ? args[0].config : null;
    loadConfigAndDo(devAction, config);
  });

program
  .command('build')
  .option('-C, --config <path>', 'config path')
  .description('Create a production build')
  .action(() => {
    const args = program.args.filter(item => typeof item === 'object');
    const config = args[0].config ? args[0].config : null;
    loadConfigAndDo(buildAction, config);
  });

program
  .command('test')
  .description('Run test files with Jest.')
  .action(() => loadConfigAndDo(testAction));

program
  .command('lint-style')
  .description('')
  .action(() => loadConfigAndDo(lintStyleAction));

program
  .command('proto')
  .description('Start a prorotype dev server.')
  .action(() => loadConfigAndDo(protoAction));

program
  .command('setup')
  .description('deprecated')
  .action(() => {
    logger.error('Setup is now part of kyt-cli. \n npm install -g kyt-cli');
  });

program.parse(process.argv);
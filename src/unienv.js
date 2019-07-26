/* eslint-disable global-require */
import crossEnv from "cross-env"
import yargs from "yargs"

function getParameter() {
  const args = yargs
    .option('context', {
      alias: 'c',
      type: "string"
    })
    .option('verbose', {
      alias: 'v',
      default: false,
      type: "boolean"
    })
    .argv

  return args
}

function executeCommand() {
  const args = getParameter()
  if (args.context) {
    process.env.ENV_CONTEXT = args.context
  }

  if (args.verbose) {
    process.stderr.write("Load .env files...\n")
  }
  // Executed in bin folder, so require top level
  require("..")

  if (args.verbose) {
    process.stderr.write(`Execute "${args._.join(" ")}"...\n`)
  }
  crossEnv(args._)
}

executeCommand()

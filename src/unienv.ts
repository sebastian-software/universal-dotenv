import crossEnv from "cross-env"
import yargs from "yargs"

import { init } from "."

interface Parameter {
  context?: string
  verbose?: boolean
  command: string[]
}

function getParameter(): Parameter {
  const args = yargs
    .option("context", {
      alias: "c",
      type: "string"
    })
    .option("verbose", {
      alias: "v",
      default: false,
      type: "boolean"
    }).argv

  const { context, verbose, _ } = args

  return {
    context,
    verbose,
    command: _
  }
}

function executeCommand(): void {
  const args = getParameter()
  if (args.context) {
    process.env.ENV_CONTEXT = args.context
  }

  if (args.verbose) {
    process.stderr.write("Load .env files...\n")
  }

  init()

  if (args.verbose) {
    process.stderr.write(`Execute "${args.command.join(" ")}"...\n`)
  }

  crossEnv(args.command)
}

executeCommand()

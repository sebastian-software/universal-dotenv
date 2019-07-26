import crossEnv from "cross-env"

import "."

function executeCommand(argv) {
  crossEnv(argv.slice(2))
}

executeCommand(process.argv)

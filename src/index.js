import fs from "fs"
import path from "path"
import appRoot from "app-root-dir"

const dotEnvBase = path.join(appRoot.get(), ".env")

const NODE_ENV = process.env.NODE_ENV
if (!NODE_ENV) {
  throw new Error(
    "The NODE_ENV [development|production] environment variable is required but was not specified."
  )
}

const BUILD_TARGET = process.env.BUILD_TARGET


// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
const dotenvFiles = [
  BUILD_TARGET && `${dotEnvBase}.${BUILD_TARGET}.${NODE_ENV}.local`,
  BUILD_TARGET && `${dotEnvBase}.${BUILD_TARGET}.${NODE_ENV}`,
  `${dotEnvBase}.${NODE_ENV}.local`,
  `${dotEnvBase}.${NODE_ENV}`,
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== "test" && `${dotEnvBase}.${BUILD_TARGET}.local`,
  NODE_ENV !== "test" && `${dotEnvBase}.local`,
  dotEnvBase
].filter(Boolean)

// Load environment variables from .env* files. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set. Variable expansion is supported in .env files.
// https://github.com/motdotla/dotenv
// https://github.com/motdotla/dotenv-expand
dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    require("dotenv-expand")(
      require("dotenv").config({
        path: dotenvFile
      })
    )
  }
})

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const APP_SPECIFIC_ENV = /^APP_/i

export function getClientEnvironment() {
  const raw = {}
  Object.keys(process.env)
    .filter((key) => APP_SPECIFIC_ENV.test(key))
    .forEach((key) => {
      raw[key] = process.env[key]
    })

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key])
      return env
    }, {})
  }

  return { raw, stringified }
}

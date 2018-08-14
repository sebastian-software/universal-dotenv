import fs from "fs"
import path from "path"
import appRoot from "app-root-dir"

const dotEnvBase = path.join(appRoot.get(), ".env")

// Cache Node environment at load time. We have to do it to make
// sure that the serialization, which might happen later, is in sync
// with the parsing of the conditional NODE_ENV files now.
const NODE_ENV = process.env.NODE_ENV

// Either "client" or "server"
const BUILD_TARGET = process.env.BUILD_TARGET

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
// Don't include `.env.local` for `test` environment
// since normally you expect tests to produce the same
// results for everyone
const dotenvFiles = [
  BUILD_TARGET && NODE_ENV && `${dotEnvBase}.${BUILD_TARGET}.${NODE_ENV}.local`,
  BUILD_TARGET && NODE_ENV && `${dotEnvBase}.${BUILD_TARGET}.${NODE_ENV}`,
  BUILD_TARGET && NODE_ENV !== "test" && `${dotEnvBase}.${BUILD_TARGET}.local`,
  BUILD_TARGET && `${dotEnvBase}.${BUILD_TARGET}`,
  NODE_ENV && `${dotEnvBase}.${NODE_ENV}.local`,
  NODE_ENV && `${dotEnvBase}.${NODE_ENV}`,
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

if (process.env.APP_ROOT == null) {
  process.env.APP_ROOT = appRoot.get()
}

if (process.env.APP_SOURCE == null) {
  const sourceFolder = path.join(process.env.APP_ROOT, "src")
  process.env.APP_SOURCE = fs.existsSync(sourceFolder) ? sourceFolder : process.env.APP_ROOT
}

// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const APP_SPECIFIC_ENV = /^APP_/i

export function getEnvironment() {
  const raw = {}
  Object.keys(process.env)
    .filter((key) => APP_SPECIFIC_ENV.test(key))
    .forEach((key) => {
      raw[key] = process.env[key]
    })

  // Add core settings to raw data - which is not prefixed at all
  raw.NODE_ENV = NODE_ENV || "development"

  if (BUILD_TARGET) {
    raw.BUILD_TARGET = BUILD_TARGET
  }

  // Add hint about root and source folders
  raw.APP_ROOT = process.env.APP_ROOT
  raw.APP_SOURCE = process.env.APP_SOURCE

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {}
  const webpack = { "process.env": stringified }
  Object.keys(raw).forEach((key) => {
    stringified[key] = JSON.stringify(raw[key])
  })

  return { raw, stringified, webpack }
}

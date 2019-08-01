/* eslint-disable @typescript-eslint/no-var-requires, global-require */
import fs from "fs"
import path from "path"

import appRoot from "app-root-dir"

const dotEnvBase = path.join(appRoot.get(), ".env")

// Cache Node environment at load time. We have to do it to make
// sure that the serialization, which might happen later, is in sync
// with the parsing of the conditional NODE_ENV files now.
const NODE_ENV = process.env.NODE_ENV

// Can be use for values like e.g. "client" or "server". Or `docker`. Or `staging`.
const ENV_CONTEXT = process.env.ENV_CONTEXT

// https://github.com/bkeepers/dotenv#what-other-env-files-can-i-use
// Don't include `.env.local` for `test` environment
// since normally you expect tests to produce the same
// results for everyone
const dotenvFiles = [
  ENV_CONTEXT && NODE_ENV && `${dotEnvBase}.${ENV_CONTEXT}.${NODE_ENV}.local`,
  ENV_CONTEXT && NODE_ENV && `${dotEnvBase}.${ENV_CONTEXT}.${NODE_ENV}`,
  ENV_CONTEXT && NODE_ENV !== "test" && `${dotEnvBase}.${ENV_CONTEXT}.local`,
  ENV_CONTEXT && `${dotEnvBase}.${ENV_CONTEXT}`,
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
dotenvFiles.forEach((dotenvFile): void => {
  if (fs.existsSync(dotenvFile)) {
    require("dotenv-expand")(
      require("dotenv").config({
        path: dotenvFile
      })
    )
  }
})

if (process.env.APP_ROOT == null) {
  const detectedRoot = appRoot.get()
  try {
    process.env.APP_ROOT = detectedRoot
  } catch (error) {
    throw new Error(
      "Universal-DotEnv requires a writable process.env! " +
      "Please make sure that this code is not transpiled with Webpack."
    )
  }
}

if (process.env.APP_SOURCE == null) {
  const sourceFolder = path.join(process.env.APP_ROOT, "src")
  process.env.APP_SOURCE = fs.existsSync(sourceFolder) ?
    sourceFolder :
    process.env.APP_ROOT
}

// Grab NODE_ENV and APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.
const APP_SPECIFIC_ENV = /^APP_/i

export interface EnvMap {
  [s: string]: string | undefined;
}

export interface Environment {
  raw: EnvMap;
  stringified: EnvMap;
  webpack: {
    "process.env": EnvMap;
  };
}

export function getEnvironment(): Environment {
  const raw: EnvMap = {}
  Object.keys(process.env)
    .filter((key): boolean => APP_SPECIFIC_ENV.test(key))
    .forEach((key): void => {
      raw[key] = process.env[key]
    })

  // Add core settings to raw data - which is not prefixed at all
  raw.NODE_ENV = NODE_ENV || "development"

  if (ENV_CONTEXT) {
    raw.ENV_CONTEXT = ENV_CONTEXT
  }

  // Add hint about root and source folders
  raw.APP_ROOT = process.env.APP_ROOT
  raw.APP_SOURCE = process.env.APP_SOURCE

  // Stringify all values so we can feed into Webpack DefinePlugin
  const stringified: EnvMap = {}
  const webpack = { "process.env": stringified }
  Object.keys(raw).forEach((key): void => {
    stringified[key] = JSON.stringify(raw[key])
  })

  return { raw, stringified, webpack }
}

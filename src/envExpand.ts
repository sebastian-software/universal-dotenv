/* eslint-disable unicorn/no-unsafe-regex */
// It should be fine to have unsafe regex (with maybe exponential time) here as this is
// only triggered once on start and is defined by admin or devops

export type EnvironmentVariables = Record<string, string>

/**
 * Expand environment variables
 * Based upon https://github.com/motdotla/dotenv-expand
 * but does not change process.env itself
 */
export function expandSingleValue(
  envValue: string,
  environment: EnvironmentVariables,
  processEnvironment?: NodeJS.ProcessEnv
): string {
  const matches = envValue.match(/(.?\${?(?:\w+)?}?)/g) || []

  return matches.reduce((prev, match) => {
    const matchParts = /(.?)\${?(\w+)?}?/g.exec(match)
    const prefix = matchParts[1]
    const key = matchParts[2]

    if (key === undefined) {
      // Looks like a matcher but has no key, so no change
      return prev
    }

    let value: string
    let replacePart: string

    if (prefix === "\\") {
      // Dollar sign is prefixed so no expansion
      replacePart = matchParts[0]
      value = replacePart.replace("\\$", "$")
    } else {
      // Found expansion matcher, so expand
      replacePart = matchParts[0].slice(prefix.length)

      // processEnvironment wins over environment
      value = processEnvironment?.[key] ?? environment[key] ?? ""

      // Resolve recursive interpolations
      value = expandSingleValue(value, environment, processEnvironment)
    }

    return prev.replace(replacePart, value)
  }, envValue)
}

/**
 * Expands environment map
 *
 * - ${VARNAME}
 * - $VARNAME
 *
 * @param environment Environment map to expand
 * @param processEnvironment usually process.env to let command line ENV win over .env files
 */
export function expandEnvironment(
  environment: EnvironmentVariables,
  processEnvironment: NodeJS.ProcessEnv = process.env
): EnvironmentVariables {
  return Object.entries(environment).reduce(
    (prev, [envKey, envValue]) => ({
      ...prev,
      [envKey]: expandSingleValue(envValue, environment, processEnvironment)
    }),
    {} as EnvironmentVariables
  )
}

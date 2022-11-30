/* eslint-disable no-template-curly-in-string */
import { expandEnvironment, expandSingleValue } from "./envExpand"

describe("expand variable", () => {
  test("with curly brackets", () => {
    const result = expandSingleValue("test ${EXPAND} value", {
      EXPAND: "expanded"
    })

    expect(result).toMatchInlineSnapshot(`"test expanded value"`)
  })

  test("simple", () => {
    const result = expandSingleValue("test $EXPAND value", {
      EXPAND: "expanded"
    })

    expect(result).toMatchInlineSnapshot(`"test expanded value"`)
  })
})

test("expand undefined variable to empty string", () => {
  const result = expandSingleValue("test $UNDEFINED_KEY value", {})

  expect(result).toMatchInlineSnapshot(`"test  value"`)
})

describe("expand variable recursive", () => {
  test("with curly brackets", () => {
    const result = expandSingleValue("test ${EXPAND2} value", {
      EXPAND: "expanded",
      EXPAND2: "- ${EXPAND} -"
    })

    expect(result).toMatchInlineSnapshot(`"test - expanded - value"`)
  })

  test("simple", () => {
    const result = expandSingleValue("test $EXPAND2 value", {
      EXPAND: "expanded",
      EXPAND2: "- $EXPAND -"
    })

    expect(result).toMatchInlineSnapshot(`"test - expanded - value"`)
  })

  test("multi layer recursive expansion", () => {
    const result = expandSingleValue(
      "scheme://${DOMAIN}/${PATH}",
      {
        DOMAIN: "${SECRET}@example.com",
        SECRET: "${USERNAME}:${PASSWORD}",
        USERNAME: "testuser",
        PATH: "api/test",
        PASSWORD: "not in .env file!"
      },
      {
        PASSWORD: "a1s2d3f4g5"
      }
    )

    expect(result).toMatchInlineSnapshot(
      `"scheme://testuser:a1s2d3f4g5@example.com/api/test"`
    )
  })
})

test("kind of expand string in expand string", () => {
  const result = expandSingleValue("test ${${EXPAND}} value", {
    EXPAND: "expanded"
  })

  expect(result).toMatchInlineSnapshot(`"test \${expanded} value"`)
})

test("expand process environment settings", () => {
  const result = expandSingleValue(
    "test ${EXPAND} value",
    {},
    {
      EXPAND: "expanded"
    }
  )

  expect(result).toMatchInlineSnapshot(`"test expanded value"`)
})

test("prefer process environment settings", () => {
  const result = expandSingleValue(
    "test ${EXPAND} value",
    {
      EXPAND: "wrong expanded"
    },
    {
      EXPAND: "expanded"
    }
  )

  expect(result).toMatchInlineSnapshot(`"test expanded value"`)
})

test("no expansion of inline escaped dollar sign", () => {
  const result = expandSingleValue("test \\${EXPAND} value", {
    EXPAND: "expanded"
  })

  expect(result).toMatchInlineSnapshot(`"test \${EXPAND} value"`)
})

test("mixed inline escaped and normal expansion variables", () => {
  const result = expandSingleValue("test \\${EXPAND} - $EXPAND value", {
    EXPAND: "expanded"
  })

  expect(result).toMatchInlineSnapshot(`"test \${EXPAND} - expanded value"`)
})

test("expand environment map", () => {
  const result = expandEnvironment(
    {
      ENV1: "env1",
      ENV2: "expand env2 with env3: ${ENV3}",
      ENV3: "env3"
    },
    {}
  )

  expect(result).toMatchInlineSnapshot(`
    {
      "ENV1": "env1",
      "ENV2": "expand env2 with env3: env3",
      "ENV3": "env3",
    }
  `)
})

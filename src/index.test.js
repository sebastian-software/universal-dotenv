import { getEnvironment } from "."

test("Sets up process.env", () => {
  expect(process.env.APP_TEST_PATH).toBe("one/two/three.js")
  expect(process.env.TEST_IGNORE).toBe("123")
})

test("Ignores non app-specific settings", () => {
  const { raw, stringified, webpack } = getEnvironment()
  expect(raw).toMatchSnapshot()
  expect(stringified).toMatchSnapshot()
  expect(webpack).toMatchSnapshot()
})

test("Supports manually defined envs", () => {
  process.env.APP_DATA = "yellow"
  const { raw, stringified, webpack } = getEnvironment()
  expect(raw).toMatchSnapshot()
  expect(stringified).toMatchSnapshot()
  expect(webpack).toMatchSnapshot()
  delete process.env.APP_DATA
})

import { getEnvironment } from "."

const snapshotOpts = {
  APP_ROOT: expect.any(String),
  APP_SOURCE: expect.any(String)
}

test("Sets up process.env", () => {
  expect(process.env.APP_TEST_PATH).toBe("one/two/three.js")
  expect(process.env.TEST_IGNORE).toBe("123")
})

test("Ignores non app-specific settings", () => {
  const { raw, stringified, webpack } = getEnvironment()
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
})

test("Supports manually defined envs", () => {
  process.env.APP_DATA = "yellow"
  const { raw, stringified, webpack } = getEnvironment()
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
  delete process.env.APP_DATA
})

test("Exports NODE_ENV", () => {
  const { raw } = getEnvironment()
  expect(raw.NODE_ENV).toBe("test")
})

test("Exports APP_ROOT", () => {
  const { raw } = getEnvironment()
  expect(raw.APP_ROOT).toMatch(/universal-dotenv$/)
})

test("Exports APP_SOURCE", () => {
  const { raw } = getEnvironment()
  expect(raw.APP_SOURCE).toMatch(/universal-dotenv[\\/]src$/)
})

import { getEnvironment, init } from "."

init()

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

test("Supports filtering envs to export", () => {
  process.env.APP_DATA = "yellow"
  process.env.APP_DATA_JUSTME = "blue"
  const { raw, stringified, webpack } = getEnvironment({
    filter: (key) => key === "APP_DATA_JUSTME"
  })
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
  delete process.env.APP_DATA
  delete process.env.APP_DATA_JUSTME
})

test("Supports translation of numbers", () => {
  process.env.APP_VERSION = 1.6
  const { raw, stringified, webpack } = getEnvironment()
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
  delete process.env.APP_VERSION
})

test("Supports translation of booleans", () => {
  process.env.APP_DEBUG = true
  const { raw, stringified, webpack } = getEnvironment()
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
  delete process.env.APP_DEBUG
})

test("Prevents translation of booleans when disabled", () => {
  process.env.APP_DEBUG = true
  const { raw, stringified, webpack } = getEnvironment({ translate: false })
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
  delete process.env.APP_DEBUG
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
  expect(raw.APP_SOURCE).toMatch(/universal-dotenv[/\\]src$/)
})

test("Adds APP_ROOT to process.env", () => {
  expect(process.env.APP_ROOT).toBeDefined()
})

test("Adds APP_SOURCE to process.env", () => {
  expect(process.env.APP_SOURCE).toBeDefined()
})

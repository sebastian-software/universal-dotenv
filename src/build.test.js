/* eslint-disable @typescript-eslint/no-var-requires */
process.env.ENV_CONTEXT = "client"

const snapshotOpts = {
  APP_ROOT: expect.any(String),
  APP_SOURCE: expect.any(String)
}

const savedProcessEnv = { ...process.env }
afterAll(() => {
  process.env = savedProcessEnv
})

/* eslint-disable import/no-commonjs */
// We can't use ESM when relying on the fact the the env from the top is correctly respected.
const api = require("..")

api.init()

test("Serializes ENV_CONTEXT", () => {
  const { raw, stringified, webpack } = api.getEnvironment()
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
})

test("Exports ENV_CONTEXT", () => {
  const { raw } = api.getEnvironment()
  expect(raw.ENV_CONTEXT).toBe("client")
})

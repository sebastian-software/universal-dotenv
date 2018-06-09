process.env.BUILD_TARGET = "client"

const snapshotOpts = {
  APP_ROOT: expect.any(String)
}

/* eslint-disable import/no-commonjs */
// We can't use ESM when relying on the fact the the env from the top is correctly respected.
const api = require(".")

test("Serializes BUILD_TARGET", () => {
  const { raw, stringified, webpack } = api.getEnvironment()
  expect(raw).toMatchSnapshot(snapshotOpts)
  expect(stringified).toMatchSnapshot(snapshotOpts)
  expect(webpack).toBeDefined()
})

test("Exports BUILD_TARGET", () => {
  const { raw } = api.getEnvironment()
  expect(raw.BUILD_TARGET).toBe("client")
})

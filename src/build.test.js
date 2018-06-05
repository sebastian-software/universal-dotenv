process.env.BUILD_TARGET = "client"

/* eslint-disable import/no-commonjs */
// We can't use ESM when relying on the fact the the env from the top is correctly respected.
const api = require(".")

test("Also serializes BUILD_TARGET", () => {
  const { raw, stringified, webpack } = api.getEnvironment()
  expect(raw).toMatchSnapshot()
  expect(stringified).toMatchSnapshot()
  expect(webpack).toMatchSnapshot()
})

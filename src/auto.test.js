import { getEnvironment } from "."

const savedProcessEnv = { ...process.env }
afterAll(() => {
  process.env = savedProcessEnv
})

test("init() is called on getEnvironment()", () => {
  const { raw } = getEnvironment()
  expect(raw.APP_TEST_PATH).toBe("one/two/three.js")
})

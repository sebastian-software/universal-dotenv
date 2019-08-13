import { getEnvironment } from "."

test("init() is called on getEnvironment()", () => {
  const { raw } = getEnvironment()
  expect(raw.APP_TEST_PATH).toBe("one/two/three.js")
})

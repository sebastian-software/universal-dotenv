/* eslint-disable @typescript-eslint/unbound-method */
import path from "path"

import appRoot from "app-root-dir"

import { init } from "."

const realAppRootDir = jest.requireActual<appRoot>("app-root-dir")
jest.mock("app-root-dir")
const appRootGet = appRoot.get as jest.Mock<string>

const hierarchyRootDir = path.join(realAppRootDir.get(), "testcase", "hierarchy")

const savedProcessEnv = { ...process.env }
afterAll(() => {
  process.env = savedProcessEnv
})

beforeEach(() => {
  process.env = {}
})

test("expand variables", () => {
  appRootGet.mockReturnValue(hierarchyRootDir)

  init()

  expect(process.env.ENV).toMatchInlineSnapshot(`".env"`)
  expect(process.env.BASE).toMatchInlineSnapshot(
    `"replace variable based on file '.env'"`
  )
})

test("expand outer variable by inner variables", () => {
  process.env.ENV_CONTEXT = "inner"
  appRootGet.mockReturnValue(hierarchyRootDir)

  init()

  expect(process.env.ENV).toMatchInlineSnapshot(`".env.inner"`)
  expect(process.env.BASE).toMatchInlineSnapshot(
    `"replace variable based on file '.env.inner'"`
  )
})

test("expand inner variable by outer variables", () => {
  process.env.ENV_CONTEXT = "inner"
  appRootGet.mockReturnValue(hierarchyRootDir)

  init()

  expect(process.env.DEEPREPLACER).toMatchInlineSnapshot(`"deep replacer"`)
  expect(process.env.INNEREXPANDED).toMatchInlineSnapshot(
    `"this is expanded by outer var: deep replacer"`
  )
})

test("expand inner variable by local variables", () => {
  process.env.ENV_CONTEXT = "inner"
  appRootGet.mockReturnValue(hierarchyRootDir)

  init()

  expect(process.env.LOCALREPLACER).toMatchInlineSnapshot(`"local replacer"`)
  expect(process.env.LOCALREPLACED).toMatchInlineSnapshot(
    `"this is expanded by .local file: local replacer"`
  )
})

import { readFile, copyFile } from "fs/promises"
import { minijson } from "../dist/lib.js"

export async function minifyFixtures(jsonFiles) {
  const pathInfo = jsonFiles.map((jsonFile) => {
    const fixtureName = jsonFile.slice(0, jsonFile.length - 5)
    const originalFile = `${fixtureName}.json`
    const minifiedFile = `${fixtureName}-minified.json`
    return { originalFile, minifiedFile }
  })
  const originalInfo = await Promise.all(
    pathInfo.map(async ({ originalFile, minifiedFile }) => {
      await copyFile(originalFile, minifiedFile)
      const originalString = await readFile(originalFile, "utf8")
      const originalObject = JSON.parse(originalString)
      return { originalString, originalObject }
    })
  )

  const minifiedFiles = pathInfo.map((pathInfo) => pathInfo.minifiedFile)
  await minijson(minifiedFiles)

  const resultInfo = await Promise.all(
    minifiedFiles.map(async (minifiedFile) => {
      const minifiedString = await readFile(minifiedFile, "utf8")
      const minifiedObject = JSON.parse(minifiedString)
      return { minifiedString, minifiedObject }
    })
  )

  return { pathInfo, originalInfo, resultInfo }
}
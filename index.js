'use strict'
const path = require('path')
const alfy = require('alfy')
const fg = require('fast-glob')

const BASE_DIR = '~/dev'
const BASE_GLOB = ['/Users/eugenel/dev/{personal,work}/**/{package.json,.git}']
const IGNORE_GLOB = ['**/node_modules', '**/test', '**/dist']

async function getProjectDirs() {
  const cachedResults = alfy.cache.get('projectDirs')

  if (cachedResults) {
    return cachedResults
  }

  const fileList = await fg(BASE_GLOB, {
    ignore: IGNORE_GLOB,
    followSymlinkedDirectories: false,
    deep: 3,
    onlyFiles: false,
  })

  const formattedResults = fileList.map(file => ({
    title: path.basename(path.dirname(file)),
    subtitle: path.dirname(file),
    arg: `${path.dirname(file)}`,
  }))

  alfy.cache.set('projectDirs', formattedResults)

  return formattedResults
}

getProjectDirs().then(results => alfy.output(results))

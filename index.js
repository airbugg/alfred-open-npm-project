'use strict'
const path = require('path')
const alfy = require('alfy')
const fg = require('fast-glob')

const BASE_DIR = '~/dev'

async function getProjectDirs() {
  const fileList = await fg(['/Users/eugenel/dev/{personal,work}/**/{package.json,.git}'], {
    ignore: ['**/node_modules', '**/test', '**/dist'],
    followSymlinkedDirectories: false,
    deep: 3,
    onlyFiles: false,
  })

  return fileList.map(file => ({
    title: path.basename(path.dirname(file)),
    subtitle: path.dirname(file),
    arg: `${path.dirname(file)}`,
  }))
}

getProjectDirs().then(results => alfy.output(results))

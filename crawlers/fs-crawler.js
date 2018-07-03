'use strict'
const path = require('path')
const alfy = require('alfy')
const fg = require('fast-glob')
const { from } = require('rxjs')
const { map, tap } = require('rxjs/operators')
const R = require('ramda')

const { withCache } = require('../utils')

const BASE_GLOB = ['/Users/eugenel/dev/**/{package.json,.git}']
const IGNORE_GLOB = ['**/node_modules', '**/test', '**/dist']
const CACHE_ID = 'FS_CRAWLER_CACHE'

const performCrawl = () =>
  fg(BASE_GLOB, {
    followSymlinkedDirectories: false,
    deep: 2,
    ignore: IGNORE_GLOB,
    onlyFiles: false,
  })

const dirCrawler$ = () => from(withCache(CACHE_ID, performCrawl)).pipe(map(formatResults))

const formatResults = results =>
  R.take(
    25,
    results.map(file => ({
      title: path.basename(path.dirname(file)),
      subtitle: path.dirname(file),
      arg: `${path.dirname(file)}`,
    }))
  )

// running as script
if (!module.parent) {
  performCrawl()
}

module.exports = {
  crawl: q => dirCrawler$(q),
}

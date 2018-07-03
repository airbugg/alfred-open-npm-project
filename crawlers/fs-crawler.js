'use strict'
const path = require('path')
const alfy = require('alfy')
const fg = require('fast-glob')
const { from } = require('rxjs')
const { map, tap } = require('rxjs/operators')
const R = require('ramda')

const { withCache } = require('../utils')

const BASE_DIR = '~/dev'
const BASE_GLOB = ['/Users/eugenel/dev/{personal,work}/**/{package.json,.git}']
const IGNORE_GLOB = ['**/node_modules', '**/test', '**/dist']
const CACHE_MAX_AGE = 12 * 60 * 60 * 1000 // 12h in ms
const CACHE_ID = 'FS_CRAWLER_CACHE'

const performCrawl = () =>
  fg(BASE_GLOB, {
    ignore: IGNORE_GLOB,
    followSymlinkedDirectories: false,
    deep: 2,
    onlyFiles: false,
  })

const dirCrawler$ = () =>
  from(withCache(CACHE_ID, performCrawl, __filename)).pipe(map(formatResults))

const formatResults = results =>
  R.take(
    2,
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

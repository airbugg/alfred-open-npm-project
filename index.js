'use strict'
const path = require('path')
const alfy = require('alfy')
const fg = require('fast-glob')
const Rx = require('rxjs')
const R = require('ramda')
const { outputToAlfred, shouldRerun } = require('./utils')

Rx.combineLatest(
  require('./crawlers/fs-crawler').crawl('')
  // require('./crawlers/github-crawler').crawl('')
).subscribe(all =>
  outputToAlfred({ items: R.flatten(all), opts: shouldRerun() ? { rerun: 0.2 } : {} })
)

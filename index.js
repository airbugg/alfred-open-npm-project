'use strict'
const path = require('path')
const alfy = require('alfy')
const fg = require('fast-glob')
const Rx = require('rxjs')
const R = require('ramda')

Rx.combineLatest(
  require('./crawlers/fs-crawler').crawl('')
  // require('./crawlers/github-crawler').crawl('')
).subscribe(all => alfy.output(R.flatten(all)))

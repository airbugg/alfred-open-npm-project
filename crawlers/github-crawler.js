'use strict'
const path = require('path')
const alfy = require('alfy')
const fg = require('fast-glob')
const { from } = require('rxjs')
const { map, tap } = require('rxjs/operators')
const R = require('ramda')
const octokit = require('@octokit/rest')()
const { withCache } = require('../utils')

const CACHE_ID = 'GITHUB_CRAWLER_CACHE'

octokit.authenticate({
  type: 'token',
  token: '0a49016c2965848e34247f8c857855da9f53e497',
})

const constructQuery = ({ query = 'fed-infra', orgs = ['wix-private', 'wix-platform'] } = {}) =>
  `${query}+in:path+${orgs.map(org => `org:${org}`).join('+')}`

const constructEntry = item => {
  return {
    title: item.name,
    autocomplete: item.name,
    subtitle: formatSubtitle(item),
    arg: item.html_url,
    quicklookurl: item.html_url,
    mods: {
      cmd: {
        valid: true,
        subtitle: '⏎ to open search in browser',
      },
    },
  }
}

const formatSubtitle = item => `${item.owner.login} | ⏎ open in browser, hold ⌘ more options`

const searchGithub = query => octokit.search.repos({ q: constructQuery({ query }), per_page: 2 })

const formatResults = R.compose(
  R.map(constructEntry),
  R.prop('items'),
  R.prop('data')
)

const githubCrawler$ = query =>
  from(withCache(CACHE_ID, () => searchGithub(query))).pipe(map(formatResults))

module.exports = {
  crawl: q => githubCrawler$(q),
}

// githubCrawler$('').subscribe(console.log)

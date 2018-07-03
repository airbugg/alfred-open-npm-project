const alfy = require('alfy')
const execa = require('execa')

module.exports.withCache = (id, promiseFn, filename) => {
  const cachedResult = alfy.cache.get(id)

  return new Promise(resolve => {
    if (cachedResult) {
      return resolve(cachedResult)
    }

    execa('node', [filename], { env: { ALFRED_BG_UPDATE_PROCESS: true, detached: true } })

    return promiseFn().then(result => {
      alfy.cache.set(id, process.env.ALFRED_BG_UPDATE_PROCESS ? 'fuuuuuuuuuu' : result)
      resolve(result)
    })
  })
}

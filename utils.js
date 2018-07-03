const alfy = require('alfy')

const shouldRerun = (module.exports.shouldRerun = () => !process.env.ALFRED_RERUN)

const pleaseWaitResult = () => ({
  items: [
    {
      title: 'Please wait',
      subtitle: 'Scanning...',
    },
  ],
})

module.exports.withCache = (id, promiseFn) => {
  const cachedResult = alfy.cache.get(id)

  return new Promise(resolve => {
    if (cachedResult && shouldRerun()) {
      return resolve(cachedResult)
    }

    return promiseFn().then((result = pleaseWaitResult()) => {
      alfy.cache.set(id, result)
      resolve(result)
    })
  })
}

const withDefaults = opts => ({
  variables: {
    ALFRED_RERUN: process.env.ALFRED_RERUN ? 1 : 0,
  },
  ...opts,
})

module.exports.outputToAlfred = ({ items, opts = {} }) =>
  console.log(
    JSON.stringify(
      {
        items,
        ...withDefaults(opts),
      },
      null,
      '\t'
    )
  )

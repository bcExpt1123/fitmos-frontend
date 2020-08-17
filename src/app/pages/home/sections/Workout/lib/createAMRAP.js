import createTabata from './createTabata'

export default ({ minutes, cbDelay, cb, cbDone, delay = 10 }) => {
  const work = minutes * 60

  createTabata({
    rounds: 1,
    work,
    rest: 0,
    cbDelay,
    cb,
    cbDone,
    delay
  })
}
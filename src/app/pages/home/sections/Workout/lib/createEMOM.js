import createTabata from './createTabata'

export default ({
  minutes,
  seconds,
  rounds,
  rest,
  cbDelay,
  cb,
  cbDone,
  delay = 10
}) => {
  const work = parseInt(minutes * 60) + parseInt(seconds)

  createTabata({
    rounds,
    work,
    rest,
    cbDelay,
    cb,
    cbDone,
    delay
  })
}
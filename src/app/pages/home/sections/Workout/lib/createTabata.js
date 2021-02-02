import { current } from './timer'
import playBeep from './playBeep'

export default ({
  rounds,
  work,
  rest,
  cbDelay, // callback for countdown
  cb, // callback for the running clock
  cbDone, // callback when it is done
  delay = 10
}) => {
  let secondsAsc = 0
  let secondsDesc = delay
  let count = 0
  let isWork = false
  let intervalId
  let round = 0

  const { setInterval, clearInterval } = window

  rest = parseInt(rest)

  // clear previous timer if any
  window.timerIntervalId && clearInterval(window.timerIntervalId)
  // stop previous pause if any
  window.timerPaused = false

  const run = () => {
    if (window.timerPaused) return

    if (delay > 0) {
      if (delay <= 3) {
        const longBeep = delay === 1
        playBeep(longBeep)
      }
      --delay
      return cbDelay(current(++secondsAsc, --secondsDesc, ++count))
    } else if (delay === 0) {
      // delay finished start work
      --delay
      secondsAsc = 0
      secondsDesc = work
      count = 0
      isWork = true
      round = 1
    }

    if (secondsDesc >= 1 && secondsDesc <= 3) {
      playBeep(secondsDesc === 1)
    } else if (secondsDesc === 0) {
      secondsAsc = 0
      isWork = !isWork || rest === 0

      if (isWork) {
        ++round
        secondsDesc = work
      } else {
        secondsDesc = rest
      }
    }

    let result = {
      ...current(secondsAsc++, secondsDesc--, ++count),
      round,
      isWork
    }
    cb(result)

    if (round > rounds) {
      cbDone({ round })
      return clearInterval(intervalId)
    }
  }

  run()

  intervalId = setInterval(run, 1000)

  window.timerIntervalId = intervalId

  return intervalId
}
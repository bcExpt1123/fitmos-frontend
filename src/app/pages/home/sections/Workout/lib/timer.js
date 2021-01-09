export const formatMinSec = time => {
  const minutes = String(Math.floor(time / 60))
  const seconds = String(time - minutes * 60)

  return `${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
}

export const formatMinSecOther = time => {
  const minutes = String(Math.floor(time / 60))
  const seconds = String(time - minutes * 60)

  return `${minutes}:${seconds.padStart(2, '0')}`
}

export const current = (secondsAsc, secondsDesc, count) => {
  const result = {
    minSecAsc: formatMinSec(secondsAsc),
    minSecDesc: formatMinSec(secondsDesc),
    count
  }

  return result
}
  
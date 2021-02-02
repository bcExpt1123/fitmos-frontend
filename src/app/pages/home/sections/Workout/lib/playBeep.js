const playBeep = isLong => {
  const event = new CustomEvent('playBeep', {
    detail: {
      isLong
    }
  })

  return document.dispatchEvent(event)
}

export default playBeep
// --- Dependencies
import React from 'react'

/**
 * Component
 */

const Label = ({ children, ...labelProps }) => (
  <label className="timer--label w-100 fw4 ttu iosevka" {...labelProps}>
    {children}
  </label>
)

export default Label
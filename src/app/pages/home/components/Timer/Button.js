import React from 'react'

/**
 * Component
 */

const Button = ({ children, className, ...buttonProps }) => (
  <button
    className={`timer--button ${className} ph3 ph5-l pv3 ba b--white bw2  hover-black hover-bg-white iosevka fw4 ttu`}
    {...buttonProps}
  >
    {children}
  </button>
)

export default Button
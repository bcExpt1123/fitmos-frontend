// --- Dependencies
import React from 'react'

// --- Components
import Button from './Button'


/**
 * Component
 */

const GoBackButton = ({ onClick }) => (
  <Button
    onClick={onClick}
    autoFocus
  >Back</Button>
)

export default GoBackButton
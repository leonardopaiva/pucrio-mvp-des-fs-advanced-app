import React from 'react'
import Button from '@mui/material/Button'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

const CustomButton: React.FC<ButtonProps> = ({ children, onClick, type = 'button', disabled = false }) => {
  return (
    <Button variant="contained" onClick={onClick} type={type} disabled={disabled}>
      {children}
    </Button>
  )
}

export default CustomButton

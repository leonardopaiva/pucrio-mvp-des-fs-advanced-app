import React from 'react'
import TextField from '@mui/material/TextField'

interface InputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  required?: boolean
}

const CustomInput: React.FC<InputProps> = ({ label, name, value, onChange, type = 'text', required = false }) => {
  return (
    <TextField 
      label={label} 
      name={name} 
      value={value} 
      onChange={onChange} 
      type={type} 
      required={required}
      fullWidth
      margin="normal"
    />
  )
}

export default CustomInput

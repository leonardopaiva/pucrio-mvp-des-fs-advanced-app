import React from 'react'
import Alert from '@mui/material/Alert'

interface AlertProps {
  message: string
  severity?: 'error' | 'warning' | 'info' | 'success'
}

const CustomAlert: React.FC<AlertProps> = ({ message, severity = 'error' }) => {
  return <Alert severity={severity}>{message}</Alert>
}

export default CustomAlert

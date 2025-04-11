import React from 'react'
import CustomButton from '../../components/CustomButton'
import { useAuth } from '../../context/AuthContext'

const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth()

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <p>Bem-vindo, {user?.name || user?.email || 'Usuário'}</p>
      <div className="mt-4">
        <CustomButton onClick={logout}>Sair</CustomButton>
      </div>
    </div>
  )
}

export default DashboardPage

import React from 'react'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-[80%] mx-auto p-4 bg-white shadow-md rounded">
        {children}
      </div>
    </div>
  )
}

export default Layout

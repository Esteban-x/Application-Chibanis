import { createContext, useState } from 'react'

const UserType = createContext()

const UserContext = ({ children }) => {
  const [userId, setUserId] = useState("")
  const [userRole, setUserRole] = useState("")
  return (
    <UserType.Provider value={{ userId, setUserId, userRole, setUserRole }}>
      {children}
    </UserType.Provider>
  )
}

export { UserType, UserContext }


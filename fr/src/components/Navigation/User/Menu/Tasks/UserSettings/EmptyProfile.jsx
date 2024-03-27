import { useState, useEffect } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"

export const EmptyProfile = () => {
  const currentUser = useAuthContext()
  const [msg, setMsg] = useState()

  console.log(currentUser)

  useEffect(() => {
    if (currentUser.emptyProfile || currentUser.notDistributed) {
      if (currentUser.emptyProfile) {
        console.log(">>>>>>")
        setMsg('Пустой профиль')
      } else if(currentUser.notDistributed) {
        console.log("!!!")
        setMsg('Не присвоен отдел обратитесь к администратору')
      }
    }
  }, [currentUser.emptyProfile, currentUser.notDistributed])

  return(
    <>
      {msg}
    </>
  )
}
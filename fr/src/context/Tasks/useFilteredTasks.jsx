import { useState, useEffect, useMemo } from "react"

export const useFilteredTasks = (allTasks, currentUser, filterFunction) => {
  const filteredTasks = useMemo(() => {
    return currentUser ? allTasks.filter(filterFunction) : []
  }, [allTasks, currentUser])

  const [tasks, setTasks] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    setTasks(filteredTasks)
    setCount(filteredTasks.length)
  }, [filteredTasks, currentUser])

  return [tasks, count]
}

import { createContext, useContext, useState } from "react";
import { getDataFromEndpoint } from "../utils/getDataFromEndpoint";

const TaskContext = createContext()

export const useTaskContext = () => {
  return useContext(TaskContext)
}

export const TasksProvider = ({currentUser, children}) => {
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [allTasks, setAllTasks] = useState([])

  const updateAllTasks = tasks => {
    setAllTasks(tasks)
  }
  
  const notifyEvent = eventName => {
    handleEvent(eventName)
  }

  const handleEvent = eventName => {
    switch (eventName) {
      case "need-all-Tasks":
          if(currentUser.login && currentUser.role === "chife") {
            fetchAllTasksBySubDep(currentUser.token)
              .then(tasks => updateAllTasks(tasks))
              .catch(error => console.error("Error fetching ALL tasks", error))
          }
        break
      default:
        console.log(`Unknown event: ${eventName}`)
    }
  }

  const fetchAllTasksBySubDep = async(token) => {
    return await getDataFromEndpoint(token, "/tasks/getAllTasksBySubDep", "POST", null, setReqStatus)
  }

  return (
    <TaskContext.Provider
      value={{
        allTasks,
        notifyEvent,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
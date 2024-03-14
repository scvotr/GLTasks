import { createContext, useContext } from "react";
import { getDataFromEndpoint } from "../utils/getDataFromEndpoint";

const TaskContext = createContext()

export const useTaskContext = () => {
  return useContext(TaskContext)
}

export const TasksProvider = ({currentUser, children}) => {

  const notifyEvent = eventName => {
    handleEvent(eventName)
  }

  const handleEvent = eventName => {
    switch (eventName) {
      case "need-all-Tasks":
        console.log("Handling event: need-all-Tasks")
        // Логика для добавления новой задачи
        break
      default:
        console.log(`Unknown event: ${eventName}`)
    }
  }

  const fetchAllTasksBySubDep = async(token) => {
    return await getDataFromEndpoint(token, "/tasks/getAllTasksBySubDep", "POST", null)
  }

  return (
    <TaskContext.Provider
      value={{notifyEvent}}
    >
      {children}
    </TaskContext.Provider>
  )
}
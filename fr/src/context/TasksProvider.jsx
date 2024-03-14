import { createContext, useContext } from "react";

const TaskContext = createContext()

export const useTaskContext = () => {
  return useContext(TaskContext)
}

export const TasksProvider = ({currentUser, children}) => {

  const notifyEvent = eventName => {
    
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

  return (
    <TaskContext.Provider
      value={{notifyEvent}}
    >
      {children}
    </TaskContext.Provider>
  )
}
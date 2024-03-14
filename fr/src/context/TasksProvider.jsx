import { createContext, useContext } from "react";

const TaskContext = createContext()

export const useTaskContext = () => {
  return useContext(TaskContext)
}

export const TasksProvider = ({currentUser, children}) => {

  const notifyEvent = eventName => {
    
  }

  return (
    <TaskContext.Provider
      value={{notifyEvent}}
    >
      {children}
    </TaskContext.Provider>
  )
}
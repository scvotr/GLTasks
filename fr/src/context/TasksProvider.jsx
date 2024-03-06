import { createContext, useContext } from "react";

const TaskContext = createContext()

export const useTaskContext = () => {
  return useContext(TaskContext)
}

export const TasksProvider = ({currentUser, children}) => {


  return (
    <TaskContext.Provider>
      {children}
    </TaskContext.Provider>
  )
}
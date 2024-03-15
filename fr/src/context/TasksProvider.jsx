import { createContext, useContext, useState } from "react";
import { getDataFromEndpoint } from "../utils/getDataFromEndpoint";

const TaskContext = createContext()

export const useTaskContext = () => {
  return useContext(TaskContext)
}

export const TasksProvider = ({currentUser, children}) => {
  const [reqStatus, setReqStatus] = useState({ loading: true, error: null })
  const [allTasks, setAllTasks] = useState([])

  console.log(allTasks)

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
              .then(tasks => {
                // Все задачи на согласование от отдела
                const filteredTasks = tasks.filter(task => task.task_status === "toApprove" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString());
                // Все согласованные задачи в отделе
                const filteredTasks2 = tasks.filter(task => task.task_status === "approved" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString());
                const combinedFilteredTasks = [...filteredTasks, ...filteredTasks2]
                // Все согласованные задачи на отдел
                const filteredTasks3 = tasks.filter(task => task.task_status === "approved" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString());
                const test = [...combinedFilteredTasks, ...filteredTasks3]
                updateAllTasks(test)
                // updateAllTasks(tasks)
              })
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
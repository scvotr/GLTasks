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
                const filteredTasks = tasks.filter(task => task.task_status === "toApprove" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString());
                const filteredTasks2 = tasks.filter(task => task.task_status === "approved" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString());
                const combinedFilteredTasks = new Set([...filteredTasks, ...filteredTasks2]);
            
                const filteredTasks3 = tasks.filter(task => task.task_status === "approved" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString());
                const uniqueTasks = new Set([...combinedFilteredTasks, ...filteredTasks3]);

                const allTaskInWorkAL = tasks.filter(task => task.task_status === "inWork" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString());
                const allTaskInWorkRL = tasks.filter(task => task.task_status === "inWork" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString());
                const allTasksInWork = new Set([...allTaskInWorkAL, ...allTaskInWorkRL]);

                const allTasks1 =  new Set([...uniqueTasks, ...allTasksInWork])

                const allTaskOnRewievkAL = tasks.filter(task => task.task_status === "needToConfirm" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString());
                const allTaskInRewievRL = tasks.filter(task => task.task_status === "needToConfirm" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString());
                const allTasksRewiev = new Set([...allTaskOnRewievkAL, ...allTaskInRewievRL]);

                const allTasks2 =  new Set([...allTasks1, ...allTasksRewiev])

                const allTaskOnClosedkAL = tasks.filter(task => task.task_status === "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString());
                const allTaskInClosedRL = tasks.filter(task => task.task_status === "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString());
                const allTasksClosed = new Set([...allTaskOnClosedkAL, ...allTaskInClosedRL]);

                const allTasks =  new Set([...allTasks2, ...allTasksClosed])
                
                updateAllTasks([...allTasks]);
              })
              .catch(error => console.error("Error fetching All sub dep tasks", error))
          } else if(currentUser.login && currentUser.role === "user") {
            fetchAllUserTasks(currentUser.token)
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
  const fetchAllUserTasks = async currentUserToken => {
    return await getDataFromEndpoint(currentUserToken, "/tasks/getAllUserTasks", "POST", null, setReqStatus)
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
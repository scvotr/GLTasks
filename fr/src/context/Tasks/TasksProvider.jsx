import { createContext, useContext, useState } from "react";
import { getDataFromEndpoint } from "../../utils/getDataFromEndpoint";
import { useFilteredTasks } from "./useFilteredTasks";

const TaskContext = createContext()

export const useTaskContext = () => {
  return useContext(TaskContext)
}

export const TasksProvider = ({currentUser, children}) => {
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [allTasks, setAllTasks] = useState([])
  const [closedAndReadedTasks, setClosedAndReadedTasks ] = useState([])

  const updateAllTasks = tasks => {
    setAllTasks(tasks)
  }

  const notifyEvent = eventName => {
    handleEvent(eventName)
  }

  const handleEvent = eventName => {
    switch (eventName) {
      case 'need-all-dep-Tasks':
        fetchAllTasksByDep(currentUser.token)
          .then( tasks => {
            const filteredTasks = tasks.filter(task => task.task_status === "toApprove" && task.appoint_department_id.toString() === currentUser.dep.toString());
            const filteredTasks2 = tasks.filter(task => task.task_status === "approved" && task.appoint_department_id.toString() === currentUser.dep.toString());
            const combinedFilteredTasks = new Set([...filteredTasks, ...filteredTasks2]);
            const filteredTasks3 = tasks.filter(task => task.task_status === "approved" && task.responsible_department_id.toString() === currentUser.dep.toString());
            const uniqueTasks = new Set([...combinedFilteredTasks, ...filteredTasks3]);

            const allTaskInWorkAL = tasks.filter(task => task.task_status === "inWork" && task.appoint_department_id.toString() === currentUser.dep.toString());
            const allTaskInWorkRL = tasks.filter(task => task.task_status === "inWork" && task.responsible_department_id.toString() === currentUser.dep.toString());
            const allTasksInWork = new Set([...allTaskInWorkAL, ...allTaskInWorkRL]);

            const allTasks1 =  new Set([...uniqueTasks, ...allTasksInWork])

            const allTaskOnRewievkAL = tasks.filter(task => task.task_status === "needToConfirm" && task.appoint_department_id.toString() === currentUser.dep.toString());
            const allTaskInRewievRL = tasks.filter(task => task.task_status === "needToConfirm" && task.responsible_department_id.toString() === currentUser.dep.toString());
            const allTasksRewiev = new Set([...allTaskOnRewievkAL, ...allTaskInRewievRL]);

            const allTasks2 =  new Set([...allTasks1, ...allTasksRewiev])

            const allTaskOnClosedkAL = tasks.filter(task => task.task_status === "closed" && task.appoint_department_id.toString() === currentUser.dep.toString()  && task.read_status === "unread") 
            const allTaskInClosedRL = tasks.filter(task => task.task_status === "closed" && task.responsible_department_id.toString() === currentUser.dep.toString()  && task.read_status === "unread")
            const allTasksClosed = new Set([...allTaskOnClosedkAL, ...allTaskInClosedRL]);

            const allTasks =  new Set([...allTasks2, ...allTasksClosed])
            // выбрать все закрытые и прочитаные задачи прочитаные задачи
            const allTaskOnClosedAndReaded = tasks.filter(task => task.task_status === "closed" && task.appoint_department_id.toString() === currentUser.dep.toString()  && task.read_status === "readed") 
            const allTaskInClosedAndReaded = tasks.filter(task => task.task_status === "closed" && task.responsible_department_id.toString() === currentUser.dep.toString()  && task.read_status === "readed")
            const allClosedAndReaded = new Set([...allTaskOnClosedAndReaded, ...allTaskInClosedAndReaded])
            setClosedAndReadedTasks([...allClosedAndReaded])

            updateAllTasks([...allTasks]);
          })
        break
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

                const allTaskOnClosedkAL = tasks.filter(task => task.task_status === "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "unread") 
                const allTaskInClosedRL = tasks.filter(task => task.task_status === "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "unread")
                const allTasksClosed = new Set([...allTaskOnClosedkAL, ...allTaskInClosedRL]);

                const allTasks =  new Set([...allTasks2, ...allTasksClosed])
                // выбрать все закрытые и прочитаные задачи прочитаные задачи
                const allTaskOnClosedAndReaded = tasks.filter(task => task.task_status === "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "readed") 
                const allTaskInClosedAndReaded = tasks.filter(task => task.task_status === "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "readed")
                const allClosedAndReaded = new Set([...allTaskOnClosedAndReaded, ...allTaskInClosedAndReaded])
                setClosedAndReadedTasks([...allClosedAndReaded])
                
                updateAllTasks([...allTasks]);
              })
              .catch(error => console.error("Error fetching All sub dep tasks", error))
          } else if(currentUser.login && currentUser.role === "user") {
            fetchAllUserTasks(currentUser.token)
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

                const allTaskOnClosedkAL = tasks.filter(task => task.task_status === "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "unread") 
                const allTaskInClosedRL = tasks.filter(task => task.task_status === "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "unread")
                const allTasksClosed = new Set([...allTaskOnClosedkAL, ...allTaskInClosedRL]);

                const allTasks =  new Set([...allTasks2, ...allTasksClosed])
                // выбрать все закрытые и прочитаные задачи прочитаные задачи
                const allTaskOnClosedAndReaded = tasks.filter(task => task.task_status === "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "readed") 
                const allTaskInClosedAndReaded = tasks.filter(task => task.task_status === "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString()  && task.read_status === "readed")
                const allClosedAndReaded = new Set([...allTaskOnClosedAndReaded, ...allTaskInClosedAndReaded])
                setClosedAndReadedTasks([...allClosedAndReaded])
                
                updateAllTasks([...allTasks]);
              })
              .catch(error => console.error("Error fetching ALL tasks", error))
          }
        break
      default:
        throw new Error(`Неизвестное событие: ${eventName}`)
    }
  }


  const fetchAllTasksByDep = async(token) => {
    return await getDataFromEndpoint(token, "/tasks/getAllTasksByDep", "POST", null, setReqStatus)
  }
  const fetchAllTasksBySubDep = async(token) => {
    return await getDataFromEndpoint(token, "/tasks/getAllTasksBySubDep", "POST", null, setReqStatus)
  }
  const fetchAllUserTasks = async(token) => {
    return await getDataFromEndpoint(token, "/tasks/getAllUserTasks", "POST", null, setReqStatus)
  }
// !---------------------------------------------------------------------------------------
  const [allLeadTasks, countAllLeadTasks] = useFilteredTasks(allTasks, currentUser, task => 
    (task.appoint_user_id && task.appoint_user_id.toString() === currentUser.id.toString()) || 
    (task.responsible_user_id && task.responsible_user_id.toString() === currentUser.id.toString())
  );

  const [allLeadTasksForSupp, countAllLeadTasksForSupp] = useFilteredTasks(allLeadTasks, currentUser, task => 
    task.responsible_subdepartment_id && task.responsible_subdepartment_id === 9
  );  

  const [allTasksFromSubDep, countAllTasksFromSubDep] = useFilteredTasks(allTasks, currentUser, task => 
    task.appoint_subdepartment_id && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString() && 
    ((task.appoint_user_id && task.appoint_user_id.toString() !== currentUser.id.toString()) 
    // || 
    // (task.responsible_subdepartment_id && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString() && 
    // (task.responsible_user_id && task.responsible_user_id.toString() !== currentUser.id.toString()))
  ));

  const [allTasksToSubDep, countAllTasksToSubDep] = useFilteredTasks(allTasks, currentUser, task => 
    task.responsible_subdepartment_id && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString() && 
    ((task.appoint_user_id && task.appoint_user_id.toString() !== currentUser.id.toString()) 
  ));

  const [allTasksClosed, countAllTasksClosed] = useFilteredTasks(allTasks, currentUser, task => 
    (task.task_status === "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString() &&
    task.read_status === "readed") ||
    (task.task_status === "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString() &&
    task.read_status === "readed")
  );  
  // const [allTasksClosed, countAllTasksClosed] = useFilteredTasks( allTasks, currentUser, task => 
  //   (task.task_status === "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString()) ||
  //   (task.task_status === "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString())
  // )
  const [allTasksNoClosed, countAllTasksNoClosed] = useFilteredTasks( allTasks, currentUser, task => 
    (task.task_status !== "closed" && task.appoint_subdepartment_id.toString() === currentUser.subDep.toString()) ||
    (task.task_status !== "closed" && task.responsible_subdepartment_id.toString() === currentUser.subDep.toString())
  )
  const [allUserTasksClosed, countAllUserTasksClosed] = useFilteredTasks( allTasks, currentUser, task => 
    task.appoint_user_id !== null && 
    task.responsible_user_id === currentUser.id && 
    task.appoint_user_id === currentUser.id && 
    task.task_status.toString() === 'closed'
  )

  return (
    <TaskContext.Provider
      value={{
        allTasks,
        allLeadTasks,
        countAllLeadTasks,
        allLeadTasksForSupp,
        countAllLeadTasksForSupp,
        allTasksFromSubDep,
        countAllTasksFromSubDep,
        allTasksToSubDep,
        countAllTasksToSubDep,
        allTasksNoClosed,
        countAllTasksNoClosed,
        allTasksClosed,
        countAllTasksClosed,
        allUserTasksClosed,
        countAllUserTasksClosed,
        notifyEvent,
        closedAndReadedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}
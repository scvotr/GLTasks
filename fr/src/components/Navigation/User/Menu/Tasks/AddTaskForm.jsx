import { v4 as uuidv4 } from "uuid";
import {useAuthContext} from '../../../../../context/AuthProvider'

export const AddTaskForm = ({onTaskSubmit}) => {
  const currentUser = useAuthContext()
  const initValue = {
    task_id: uuidv4(),
    task_status: "new",
    task_descript: "",
    task_comment: [],
    deadline: "",
    task_priority: false,
    appoint_user_id: currentUser.id, // кто назначил = текущий пользователь
    appoint_department_id: currentUser.dep,
    appoint_subdepartment_id: currentUser.subDep,
    appoint_position_id: currentUser.position,
    responsible_user_id: "",
    responsible_department_id: "",
    responsible_subdepartment_id: "",
    responsible_position_id: "",
    files: [],
    filePreviews: [],
    filesToRemove: [],
    task_files: [],
  };
}
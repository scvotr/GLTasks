import { TextField, Button, List, ListItem, ListItemText, Typography, styled } from "@mui/material"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"
import { useEffect, useState } from "react"
import { useSocketContext } from "../../../../context/SocketProvider"

const ScrollableList = styled(List)({})

export const TaskComments = ({ comments, onSubmit, task }) => {
  const socket = useSocketContext()
  const currentUser = useAuthContext()
  const [comment, setComment] = useState("")
  const [commentList, setCommentList] = useState([])

  const handleChange = event => {
    setComment(event.target.value)
  }

  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formKey, setFormKey] = useState(0)

  const fetchNewComment = async (token, data) => {
    return await getDataFromEndpoint(token, "/tasks/addTaskComment", "POST", data, setReqStatus)
  }

  useEffect(() => {
    getDataFromEndpoint(currentUser.token, "/tasks/getAllTaskComments", "POST", task.task_id, setReqStatus).then(data => {
      setCommentList(data)
    })
  }, [formKey])

  // !------------------------------
  useEffect(()=> {
    socket.on("taskApproved", () => {
      setFormKey(prevKey => prevKey + 1)
    })
  }, [socket])

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      socket.disconnect()
    })
    return () => {
      window.removeEventListener("beforeunload", () => {
        socket.disconnect()
      })
    }
  }, [socket])
  // !------------------------------

  const handleSubmit = () => {
    if (comment.trim() !== "") {
      const newComment = {
        task_id: task.task_id,
        comment: comment,
        user_id: currentUser.id,
        user_dep: currentUser.dep,
        user_subDep: currentUser.subDep,
        user_role: currentUser.role,
        task_status: task.task_status,
        // fields for send notify
        appoint_user_id: task.appoint_user_id,
        appoint_department_id: task.appoint_department_id,
        appoint_subdepartment_id: task.appoint_subdepartment_id,
        responsible_user_id: task.responsible_user_id,
        responsible_department_id: task.responsible_department_id,
        responsible_subdepartment_id: task.responsible_subdepartment_id,
      }
      fetchNewComment(currentUser.token, newComment).then(() => setFormKey(prevKey => prevKey + 1))
      setComment("")
    }
  }

  return (
    <>
      <TextField
        multiline
        rows={4}
        variant="outlined"
        label="Напишите комментарий"
        value={comment}
        onChange={handleChange}
        fullWidth
        inputProps={{ maxLength: 700 }}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ m: "2%" }}>
        Добавить комментарий
      </Button>
      <ScrollableList
        sx={{
          maxHeight: "calc(70vh - 270px)", // 130px - примерная высота TextField и Button
          overflowY: "auto",
        }}>
        {commentList.map((comment, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={comment.comment}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="textPrimary">
                    {comment.last_name}
                  </Typography>
                  {" - " + comment.created_on}
                </>
              }
            />
          </ListItem>
        ))}
      </ScrollableList>
    </>
  )
}

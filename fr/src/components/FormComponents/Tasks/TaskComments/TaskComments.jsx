import { Box, TextField, Button, List, ListItem, ListItemText, Typography, styled } from "@mui/material"
import { useAuthContext } from "../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../utils/getDataFromEndpoint"
import { useEffect, useState } from "react"

const ScrollableList = styled(List)({})

export const TaskComments = ({ comments, onSubmit, task }) => {
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

  const handleSubmit = () => {
    if (comment.trim() !== "") {
      const newComment = {
        comment: comment,
        user_id: currentUser.id,
        task_id: task.task_id,
      }
      fetchNewComment(currentUser.token, newComment).then(() => setFormKey(prevKey => prevKey + 1))
      setComment("")
    }
  }

  return (
    <Box
      sx={{
        // boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        // borderRadius: "5px",
        // height: "70vh",
        // overflow: "hidden",
      }}
    >
      <TextField
        multiline
        rows={4}
        variant="outlined"
        label="Напишите комментарий"
        value={comment}
        onChange={handleChange}
        fullWidth
        inputProps={{ maxLength: 700 }}
        sx={{
          mt: 2,
        }}
      />
      <Button variant="contained" onClick={handleSubmit}>
        Добавить комментарий
      </Button>
      <ScrollableList
        sx={{
          maxHeight: 'calc(70vh - 130px)', // 130px - примерная высота TextField и Button
          overflowY: "auto",
        }}
      >
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
    </Box>
  )
}
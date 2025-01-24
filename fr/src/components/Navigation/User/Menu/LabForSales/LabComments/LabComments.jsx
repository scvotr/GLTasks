import { TextField, Button, List, ListItem, ListItemText, Typography, styled } from "@mui/material"
import { useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { useSocketContext } from "../../../../../../context/SocketProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

const ScrollableList = styled(List)({})

export const LabComments = ({ comments, onSubmit, request, checkFullScreenOpen, reRender }) => {
  const socket = useSocketContext()
  const currentUser = useAuthContext()
  const [comment, setComment] = useState("")
  const [commentList, setCommentList] = useState([])
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [formKey, setFormKey] = useState(0)


  console.log('LabComments- checkFullScreenOpen',checkFullScreenOpen)

  const handleChange = event => {
    setComment(event.target.value)
  }

  const fetchNewComment = async (token, data) => {
    return await getDataFromEndpoint(token, "/lab/addNewLabReqComment", "POST", data, setReqStatus)
  }

  useEffect(() => {
    getDataFromEndpoint(currentUser.token, "/lab/getAllLabReqComment", "POST", request.reqForAvail_id, setReqStatus).then(data => {
      setCommentList(data)
    })
  }, [formKey])

  // !----Подписываемся на сокетное событие
  useEffect(()=> {
    socket.on("reqForLabNewComment", () => {
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
        reqForAvail_id: request.reqForAvail_id,
        comment: comment,
        user_id: currentUser.id,
        modal_isOpen: checkFullScreenOpen,
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
        {commentList.length > 0 && commentList?.map((comment, index) => (
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

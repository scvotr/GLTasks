import { useState } from "react"
import { useAuthContext } from "../../../context/AuthProvider"
import { formatDate } from "../../../utils/formatDate"
import { ModalCustom } from "../../ModalCustom/ModalCustom"
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from "@mui/material"

export const PDFbyPinFromDoc = () => {
  const currentUser = useAuthContext()
  const [reqStatus, setReqStatus] = useState({ loading: false, error: null })
  const [blobData, setBlobData] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [formKey, setFormKey] = useState(0)

  const initVal = {
    name: currentUser.id,
    name: currentUser.name,
    currentData: formatDate(new Date()).split(".").reverse().join("-"),
    selectData: formatDate(new Date()).split(".").reverse().join("-"), // Приведение даты к ожидаемому формату "yyyy-MM-dd"
    timeStart: "08:00",
    timeEnd: "09:00",
  }

  const [formData, setFormData] = useState(initVal)

  const openModal = user => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prevKey => prevKey + 1)
  }

  const testDocuments = [
    { id: 1, title: "Document 1" },
    { id: 2, title: "Document 2" },
    { id: 3, title: "Document 3" },
    { id: 4, title: "Document 4" },
    { id: 5, title: "Document 5" },
  ]

  const [selectedDocument, setSelectedDocument] = useState(null)
  const [password, setPassword] = useState("")

  const handleSignButtonClick = () => {
    if (!selectedDocument) {
      alert("Please select a document to sign.");
      return;
    }
    setModalOpen(true);
  }

  const handlePasswordSubmit = () => {
    // Здесь можно выполнить отправку пароля на сервер и подписать документ
    // После успешного подписания, можно закрыть модальное окно
    setModalOpen(false);
  };

  return (
    <>
      <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Введите пин-код">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <h2>Введите пин-код:</h2>
          <TextField type="password" label="Password" value={password} onChange={e => setPassword(e.target.value)} variant="outlined" fullWidth />
          <Button variant="contained" color="primary" onClick={handlePasswordSubmit} style={{ marginTop: '16px' }}>
            ок
          </Button>
        </div>
      </ModalCustom>
      <div style={{ marginBottom: '16px' }}>
        <FormControl fullWidth>
          <Select value={selectedDocument} onChange={e => setSelectedDocument(e.target.value)}>
            <MenuItem value="">Select a document</MenuItem>
            {testDocuments.map(document => (
              <MenuItem key={document.id} value={document.id}>
                {document.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {selectedDocument && (
        <Button variant="contained" color="primary" onClick={handleSignButtonClick}>
          Подписать
        </Button>
      )}
    </>
  )
}

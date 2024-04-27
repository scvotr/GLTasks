import { AppBar, Toolbar, Typography, Fab, Grid } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { TasksTable } from "../../../../FormComponents/Tables/TasksTable/TasksTable"
import { styled } from "@mui/material/styles"
import { useTaskContext } from "../../../../../context/Tasks/TasksProvider"
import { useEffect, useState } from "react"
import { ModalCustom } from "../../../../ModalCustom/ModalCustom"
import { AddNewDocForm } from "../../../../FormComponents/Docs/AddNewDocForm"
import { DocToPDF } from "../../../../FormComponents/Docs/DocToPDF"
import { UseAccordionView } from "../../../../FormComponents/Accordion/UseAccordionView"
import { PDFbyPinFromDoc } from "../../../../FormComponents/Docs/PDFbyPinFromDoc"
import { AppBarForPage } from "../componenst/AppBarForPage/AppBarForPage"

const Item = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  border: "1px solid",
  borderColor: theme.palette.mode === "dark" ? "#444d58" : "#ced7e0",
  padding: theme.spacing(1),
  margin: theme.spacing(2),
  borderRadius: "4px",
  textAlign: "center",
}))

export const DocsMain = () => {
  const { allTasks, notifyEvent, allTasksNoClosed, countAllTasksNoClosed } = useTaskContext()
  const [formKey, setFormKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    notifyEvent("need-all-Tasks")
  }, [formKey])

  const openModal = user => {
    setModalOpen(true)
  }
  const closeModal = () => {
    setModalOpen(false)
    setFormKey(prevKey => prevKey + 1)
  }

  return (
    <>
      <>
        <ModalCustom isOpen={modalOpen} onClose={closeModal} infoText="Новая задача"></ModalCustom>
      </>
      <AppBarForPage title="Документы:" />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Item>
            <UseAccordionView headerText="Заявление дни в счет отпуска:" bodyText="Прошу предоставить мне дд.мм.гггг c чч:мм до чч:мм в счет отпуска.">
              <AddNewDocForm />
            </UseAccordionView>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <UseAccordionView headerText="Создать PDF:">
              <DocToPDF />
            </UseAccordionView>
          </Item>
        </Grid>
        <Grid item xs={6}>
          <Item>
            <UseAccordionView headerText="Создать PDF через PINCODE:">
              <PDFbyPinFromDoc />
            </UseAccordionView>
          </Item>
        </Grid>
      </Grid>
    </>
  )
}

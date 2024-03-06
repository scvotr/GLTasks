import { convertToFormData } from "./convertToFormData";
import { HOST_ADDR } from "./remoteHosts";

export const sendNewTaskData = async (token, formData, onSuccess) => {
  delete formData.filePreviews;
  const data = convertToFormData(formData);
  try {
    const res = await fetch(HOST_ADDR + "/tasks/addNewTask", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: data,
    });
    if (res.ok) {
      const responseData = await res.json();
      onSuccess(responseData);
    } else {
      throw new Error("Server response was not ok");
    }
  } catch (error) {
    onSuccess(error);
  }
};
import { HOST_ADDR } from "./remoteHosts";

export const sendDataToChangePasPin = async(  token,
  endpoint,
  method,
  data = null,
  onSuccess) => {
  try {
    const res = await fetch(HOST_ADDR + endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: data ? JSON.stringify(data) : null,
    });

    if(res.ok) {
      if (res.headers.has("Authorization")) {
        const newToken = res.headers.get("Authorization");
        return {newToken: newToken}
      } else {
        const responceData = await res.json();
        return {...responceData};
      }
    } else {
      return data.Authtorisation
    }
  } catch (error) {
    console.log(error);
  }
}
export const sendRegData = async (regData, hostAddr, resError) => {
  try {
    const res = await fetch(hostAddr + "/auth/registrationLocalUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regData),
    });
    const data = await res.json();
    if (res.ok) {
      const token = res.headers.get("Authorization");
      if (token === null) {
        console.log("Token not found!", data.Registration);
        resError(data.Registration)
      } else {
        // localStorage.setItem("token", token);
        window.location.href = "/Login";
      }
    } else {
      resError(data.Registrtaion)
    }
  } catch (error) {
    resError(error)
  }
};
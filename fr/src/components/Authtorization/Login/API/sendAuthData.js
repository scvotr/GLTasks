export const sendAuthData = async (authData, apiHostAddr, resError) => {
  try {
    const res = await fetch(apiHostAddr + '/auth/login', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(authData),
    });
    const data = await res.json();
    const token = res.headers.get("Authorization");

    if (token) {
      const userData = {
        token,
        name: data.name,
        role: data.role,
        id: data.id,
        dep: data.dep,
        subDep: data.subDep,
        position: data.position
      };

      return userData;
    } else {
      resError(data.Authtorisation);
    }
  } catch (error) {
    resError(error);
  }
};
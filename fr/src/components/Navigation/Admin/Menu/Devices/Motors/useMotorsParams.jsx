import { useCallback, useEffect, useState } from "react"
import { useAuthContext } from "../../../../../../context/AuthProvider"
import { getDataFromEndpoint } from "../../../../../../utils/getDataFromEndpoint"

export const useMotorsParams = () => {
  const currentUser = useAuthContext()
  const [request, setRequest] = useState()

  const [electricalParams, setElectricalParams] = useState({
    powerRanges: "",
    voltage: "",
    amperage: "",
    efficiency: "",
    cosF: "",
  })

  const [mechanicalParams, setMechanicalParams] = useState({
    rotationSpeed: "",
    torque: "",
    temperature: "",
    operationMode: "",
  })

  const [protectionParams, setProtectionParams] = useState({
    protectionLevel: "",
    explosionProof: "",
    brake: "",
  })

  const [technicalParams, setTechnicalParams] = useState({
    bearingType: "",
    mounting: "",
  })

  const fetchData = useCallback(async () => {
    if (currentUser.login) {
      try {
        const [
          powerRanges,
          voltage,
          amperage,
          efficiency,
          cosF,
          rotationSpeed,
          torque,
          temperature,
          operationMode,
          protectionLevel,
          explosionProof,
          brake,
          bearingType,
          mounting,
        ] = await Promise.all([
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/electrical/power/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/electrical/voltage/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/electrical/amperage/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/electrical/efficiency/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/electrical/cosF/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/mechanical/rotationSpeed/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/mechanical/torque/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/mechanical/temperature/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/mechanical/operationMode/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/protection/protectionLevel/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/protection/explosionProof/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/protection/brake/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/technical/bearingType/read`, "POST", null, setRequest),
          getDataFromEndpoint(currentUser.token, `/admin/devices/motor/technical/mounting/read`, "POST", null, setRequest),
        ])

        // Обновляем состояние с полученными данными
        setElectricalParams({
          powerRanges,
          voltage,
          amperage,
          efficiency,
          cosF,
        })

        setMechanicalParams({
          rotationSpeed,
          torque,
          temperature,
          operationMode,
        })

        setProtectionParams({
          protectionLevel,
          explosionProof,
          brake,
        })

        setTechnicalParams({
          bearingType,
          mounting,
        })
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error)
      }
    }
  }, [currentUser])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { electricalParams, mechanicalParams, protectionParams, technicalParams }
}

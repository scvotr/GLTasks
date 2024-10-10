import { useState } from "react"

export const MotorInfoViewV2 = ({ motor }) => {
    const [value, setValue] = useState("1")

    const handleChange = (event, newValue) => {
        setValue(newValue)
      }
    console.log(motor)
}

import * as React from "react"
import PropTypes from "prop-types"
import { styled } from "@mui/material/styles"
import Rating from "@mui/material/Rating"
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied"
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied"
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied"
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined"
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied"


import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import StarRateOutlinedIcon from '@mui/icons-material/StarRateOutlined';
import GradeOutlinedIcon from '@mui/icons-material/GradeOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

const StyledRating = styled(Rating)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  size: "large",
  "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
    color: theme.palette.action.disabled,
  },
}))

const customIcons = {
  1: {
    icon: <StarBorderOutlinedIcon color="error" />,
    label: "Very Dissatisfied",
  },
  2: {
    icon: <GradeOutlinedIcon color="error" />,
    label: "Dissatisfied",
  },
  3: {
    icon: <StarRateOutlinedIcon color="warning" />,
    label: "Neutral",
  },
  4: {
    icon: <StarHalfOutlinedIcon color="success" />,
    label: "Satisfied",
  },
  5: {
    icon: <StarOutlinedIcon color="success" />,
    label: "Very Satisfied",
  },
}

function IconContainer(props) {
  const { value, ...other } = props
  return <span {...other}>{customIcons[value].icon}</span>
}

IconContainer.propTypes = {
  value: PropTypes.number.isRequired,
}

const getLabelText = value => {
  return customIcons[value]?.label || "No label"
}

export const RadioGroupRating = ({ onRatingChange, rate, viewOnly }) => {
  const handleChange = (event, newValue) => {
    onRatingChange(newValue)
  }

  return viewOnly ? (
    <StyledRating
      name="highlight-selected-only"
      // value={rate}
      value={Number(rate)}
      IconContainerComponent={IconContainer}
      getLabelText={getLabelText}
      highlightSelectedOnly
      readOnly={!!rate} // Делаем рейтинг только для чтения, если rate передан
      
    />
  ) : (
    <StyledRating
      name="highlight-selected-only"
      // value={rate || 0}
      value={Number(rate) || 0}
      IconContainerComponent={IconContainer}
      getLabelText={value => customIcons[value].label}
      highlightSelectedOnly
      onChange={handleChange}
    />
  )
}

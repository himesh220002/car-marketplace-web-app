import React, { JSX } from 'react'
import {
    FaClipboardList, FaTag, FaDollarSign, FaMoneyBillAlt, FaCar, FaCarSide, FaCheckCircle, FaClipboardCheck, FaCalendarAlt, FaRoad, FaCogs,
    FaExchangeAlt, FaGasPump, FaTachometerAlt, FaWrench, FaPalette, FaDoorOpen, FaIdCard, FaHandHoldingUsd, FaFileAlt,
    FaQuestionCircle
} from "react-icons/fa"
import {GiPathDistance} from "react-icons/gi"


const iconMap: Record<string, JSX.Element> = {
    FaClipboardList: <FaClipboardList />,
    FaTag: <FaTag />,
    FaDollarSign: <FaDollarSign />,
    FaMoneyBillAlt: <FaMoneyBillAlt />,
    FaCar: <FaCar />,
    FaCarSide: <FaCarSide />,
    FaCheckCircle: <FaCheckCircle />,
    FaClipboardCheck: <FaClipboardCheck />,
    FaCalendarAlt: <FaCalendarAlt />,
    FaRoad: <FaRoad />,
    FaCogs: <FaCogs />,
    FaExchangeAlt: <FaExchangeAlt />,
    FaGasPump: <FaGasPump />,
    FaTachometerAlt: <FaTachometerAlt />,
    FaWrench: <FaWrench />,
    FaPalette: <FaPalette />,
    FaDoorOpen: <FaDoorOpen />,
    FaIdCard: <FaIdCard />,
    FaHandHoldingUsd: <FaHandHoldingUsd />,
    FaFileAlt: <FaFileAlt />,
    GiPathDistance: <GiPathDistance />,
}

interface IconFieldProps {
    icon: string; // Type for the "icon" prop
}

const IconField: React.FC<IconFieldProps> = ({ icon }) => {
    return (
        <div className='text-blue-700 bg-blue-100 p-1.5 rounded-full'>{iconMap[icon] || <FaQuestionCircle />}</div>
    )


}

export default IconField;
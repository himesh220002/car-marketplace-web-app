import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface DropdownFieldProps {
  item: {
    name: string;
    label: string;
    required?: boolean;
    options: string[];
  };
  handleInputChange: (name: string, value: string) => void;
  carInfo?: any;
}

const DropdownField: React.FC<DropdownFieldProps> = ({ item, handleInputChange,carInfo }) => {

  const [selectedValue, setSelectedValue] = useState('');

  useEffect(() => {
    if (carInfo?.[item.name]) {
      setSelectedValue(carInfo?.[item?.name]);
    }
  }, [carInfo]);

  return (
    <div>
      <Select
        onValueChange={(value) => {handleInputChange(item.name, value)
          setSelectedValue(value);
        }}
        required={item.required}
        value={selectedValue}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={selectedValue?selectedValue:item.label} />
        </SelectTrigger>
        <SelectContent>

        {item.options.includes(carInfo?.[item.name]) || !carInfo?.[item.name] ? null : (
            <SelectItem value={carInfo[item.name]}>{carInfo[item.name]}</SelectItem>
        )}

          {item.options.map((option, index) => (
            <SelectItem key={index} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DropdownField;

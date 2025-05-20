import { Input } from '@/components/ui/input'
// import React from 'react'

interface InputFieldProps {
  item: {
    name: string;
    fieldType: string;
    required?: boolean;
  };
  handleInputChange: (name: string, value: string) => void;
  carInfo?: any;
}

function InputField({item,handleInputChange,carInfo}:InputFieldProps) {
  return (
    <div>
      <Input type={item?.fieldType}
      name={item?.name} 
      required={item?.required}
      defaultValue={carInfo?.[item.name]}
      onChange={(e) => handleInputChange(item.name, e.target.value)}
      />
    </div>
  )
}

export default InputField
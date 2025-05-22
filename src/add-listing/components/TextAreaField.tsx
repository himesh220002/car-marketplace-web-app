
import { Textarea } from '@/components/ui/textarea'

function TextAreaField({item, handleInputChange, carInfo}: any) {
  return (
    <div>
        <Textarea onChange={(e)=>handleInputChange(item.name,e.target.value)}
            required={item.required}
            defaultValue={carInfo?.[item.name]}
            />
    </div>
  )
}

export default TextAreaField
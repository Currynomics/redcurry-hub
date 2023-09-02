import { useField } from "payload/components/forms";
import { useFormFields } from 'payload/components/forms';
import {NumberField} from 'payload/types'
import React from 'react'

type Props = { path: string }

const CustomTextField: React.FC<Props> = ({ path }) => {
  const { value, setValue } = useField<string>({ path })

  useFormFields(([fields, dispatch]) => {});
  


  return <input onChange={e => setValue(e.target.value)} value={value} />
}
export default CustomTextField;
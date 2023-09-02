import { Field } from 'payload/types';
import CustomTextField from './index';

export const validateHexColor = (value: string = ''): true | string => {
  return value.match(/^#(?:[0-9a-fA-F]{3}){1,2}$/) !== null || `Please give a valid hex color`;
}

const customField: Field = {
  name: 'color',
  type: 'text',
  validate: validateHexColor,
  required: true,
  admin: {
    components: {
      Field: CustomTextField,
    }
  }
};

export default customField;
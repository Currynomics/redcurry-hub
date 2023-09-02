import { Field } from 'payload/types';
import AppMessage from './index'

const SupplyWarnMsg: Field = {
  name: 'supplyWarnMsg',
  type: 'ui',
  admin: {
    components: {
      Field: () => AppMessage({type:"warnMsg", text: "Following asset will update the supply to maintain the peg. Select source asset to avoid supply change." })
    }
  }
};

export default SupplyWarnMsg;
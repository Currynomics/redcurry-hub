import { CollectionBeforeOperationHook } from 'payload/types';

const OPERATION_CREATE = "create"
const OPERATION_DELETE = "delete"
const OPERATION_UPDATE = "update"
const MIN_PSW_LENGTH = 16

const usersBeforeOperationPswValidation: CollectionBeforeOperationHook = async ({
    args, // Original arguments passed into the operation
    operation, // name of the operation
}) => {
    if ((operation == OPERATION_UPDATE || operation == OPERATION_CREATE) && args?.data.password) {
        const { password } = args?.data
        // check if the password is at least X chars long and contains 3 of 4 conditions:
        // lowercase / uppercase / digit / sepcial character qEbF_JHm87s@Ku65rt2UqWDJ
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{16,})/;
        const isValid = strongPasswordRegex.test(password)
        if (!isValid) throw new Error("Password: min 16 characters with lower- and uppercase, digit and sepcial character.");
    }
    return args
}

export default usersBeforeOperationPswValidation;


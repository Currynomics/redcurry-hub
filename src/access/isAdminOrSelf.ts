import { Access, FieldAccess } from "payload/types";
import { User } from "../payload-types";

export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    if (user.roles?.includes('admin')) {
      return true;
    }

    // If any other type of user, only provide access to themselves
    return {
      id: {
        equals: user.id,
      }
    }
  }

  // Reject everyone else
  return false;
}

// DOES NOT WORK
// export const isAdminOrSelfFieldLevel: FieldAccess<{ id: string }, unknown, User> = ({ req: { user } }) => {
//     // Need to be logged in
//     if (user) {
//       // If user has role of 'admin'
//       if (user.roles?.includes('admin')) {
//         return true;
//       }
  
//       // If any other type of user, only provide access to themselves
//       return (id == user.id)
//       // {
//       //   id: {
//       //     equals: user.id,
//       //   }
//       // }
//     }
  
//     // Reject everyone else
//     return false;
// }
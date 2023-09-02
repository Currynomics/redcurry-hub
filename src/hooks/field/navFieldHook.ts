import type { FieldHook } from 'payload/types';

// Field hook type is a generic that takes three arguments:
// 1: The document type
// 2: The value type
// 3: The sibling data type

type NavFieldHook = FieldHook<any, number, any>;

//'NAV = OAV + COA + OLTA + OSTA + REC - LIA - OAVi + OAVr'
export const navFieldHook: NavFieldHook = (args) => {
    const {
        siblingData, // Typed as a Partial of SiblingDataType
    } = args;
    var nav = 0;
    siblingData.oav?nav+=siblingData.oav:void 0;
    siblingData.oa?nav+=siblingData.oa:void 0;
    siblingData.ral?nav+=siblingData.ral:void 0;
    siblingData.coa?nav+=siblingData.coa:void 0;
    siblingData.oavr?nav+=siblingData.oavr:void 0;
    siblingData.bd?nav-=siblingData.bd:void 0;
    siblingData.oavi?nav-=siblingData.oavi:void 0;
    return nav;
}
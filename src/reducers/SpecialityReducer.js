import * as Actions from '../actions/ActionTypes'
const SpecialityReducer = (state = { speciality_name:'', speciality_brand:'', speciality_color:'', speciality_number:'', speciality_type:'', speciality_type_lbl:'' }, action) => {
    switch (action.type) {
        case Actions.UPDATE_SPECIALITY_NAME:
            return Object.assign({}, state, {
                speciality_name: action.data
            });
        case Actions.UPDATE_SPECIALITY_BRAND:
            return Object.assign({}, state, {
                speciality_brand: action.data
            });
        case Actions.UPDATE_SPECIALITY_COLOR:
            return Object.assign({}, state, {
                speciality_color: action.data
            });
        case Actions.UPDATE_SPECIALITY_NUMBER:
            return Object.assign({}, state, {
                speciality_number: action.data
            });
        case Actions.UPDATE_SPECIALITY_TYPE:
            return Object.assign({}, state, {
                speciality_type: action.data
            });
        case Actions.UPDATE_SPECIALITY_TYPE_LBL:
            return Object.assign({}, state, {
                speciality_type_lbl: action.data
            });
        default:
            return state;
    }
}

export default SpecialityReducer;
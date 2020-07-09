import { ThemeActionType, ThemeStateType } from '../actions';

const initialState: ThemeStateType = {

};

const themeReducer = (state = initialState, action: ThemeActionType) => {
	switch (action.type) {
		case 'CHANGE_THEME':
			return {
				...state,
				...action.payload,
			};
		default:
			return state;
	}
};

export { themeReducer };

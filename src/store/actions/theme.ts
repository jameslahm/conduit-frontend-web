import { ThemeOptions } from '@material-ui/core';
const CHANGE_THEME = 'CHANGE_THEME';

type ThemeStateType = ThemeOptions;

interface ThemeActionType {
	type: typeof CHANGE_THEME;
	payload: ThemeOptions;
}

const changeTheme = (payload: ThemeOptions): ThemeActionType => {
	return {
		type: CHANGE_THEME,
		payload: payload,
	};
};

export { changeTheme };
export type { ThemeStateType, ThemeActionType };

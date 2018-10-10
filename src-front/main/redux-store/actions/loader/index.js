export const LOADING_START = 'LOADING_START';
export const LOADING_END = 'LOADING_END';

export const StartLoading = () => ({ type: LOADING_START });
export const EndLoading = () => ({ type: LOADING_END });
import { configureStore } from '@reduxjs/toolkit';
import { reducer } from './reducer';
import { thunk } from 'redux-thunk';

export const store = configureStore({
    reducer: reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk)
});

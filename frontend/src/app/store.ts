import { configureStore } from '@reduxjs/toolkit'
import auth, { sessaoExpirada } from '../features/auth/authSlice'
import { definirAoExpirarSessao } from '../shared/api/client'

export const store = configureStore({ reducer: { auth } })

definirAoExpirarSessao(() => {
	store.dispatch(sessaoExpirada())
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

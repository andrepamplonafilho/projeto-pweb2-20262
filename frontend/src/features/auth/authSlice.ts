import { createSlice } from '@reduxjs/toolkit'

export interface Usuario {
  id: number
  nome: string
  email: string
}

interface AuthState {
  usuario: Usuario | null
  token: string | null
  status: 'ocioso' | 'carregando' | 'erro'
  erro: string | null
}

const initialState: AuthState = {
  usuario: null,
  token: localStorage.getItem('token'),
  status: 'ocioso',
  erro: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sair(state) {
      state.usuario = null
      state.token = null
      localStorage.removeItem('token')
    },
  },
})

export const { sair } = authSlice.actions
export default authSlice.reducer

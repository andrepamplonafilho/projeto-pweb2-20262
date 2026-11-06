import { createSlice } from '@reduxjs/toolkit'
import { tokenStorage } from '../../shared/api/client'
import type { UsuarioLogado } from '../../shared/api/tipos'

export type StatusAuth = 'ocioso' | 'carregando' | 'erro'

export interface AuthState {
  usuario: UsuarioLogado | null
  token: string | null
  status: StatusAuth
  erro: string | null
  campos: Record<string, string> // erros por campo vindos da API (ex.: { email: '...' })
}

const initialState: AuthState = {
  usuario: null,
  token: tokenStorage.get(),
  status: 'ocioso',
  erro: null,
  campos: {},
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    limparErro(state) {
      if (state.status === 'erro') state.status = 'ocioso'
      state.erro = null
      state.campos = {}
    },
    // Provisório
    sair(state) {
      state.usuario = null
      state.token = null
      tokenStorage.clear()
    },
  },
})

export const { limparErro, sair } = authSlice.actions
export default authSlice.reducer

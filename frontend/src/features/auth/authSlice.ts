import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, tokenStorage } from '../../shared/api/client'
import { ApiError } from '../../shared/api/errors'
import type { CadastroRequest, LoginRequest, Sessao, UsuarioLogado } from '../../shared/api/tipos'

export type StatusAuth = 'ocioso' | 'carregando' | 'erro'

export interface AuthState {
  usuario: UsuarioLogado | null
  token: string | null
  status: StatusAuth
  erro: string | null
  campos: Record<string, string> // erros por campo vindos da API (ex.: { email: '...' })
}

// O que os thunks entregam quando falham (chega em action.payload via rejectWithValue).
export interface ErroAuth {
  mensagem: string
  campos: Record<string, string>
}

const MENSAGEM_PADRAO = 'Erro inesperado. Tente novamente.'

function extrairErro(erro: unknown): ErroAuth {
  if (erro instanceof ApiError) {
    return { mensagem: erro.message, campos: erro.campos }
  }
  return { mensagem: MENSAGEM_PADRAO, campos: {} }
}

export const cadastrar = createAsyncThunk<Sessao, CadastroRequest, { rejectValue: ErroAuth }>(
  'auth/cadastrar',
  async (dados, { rejectWithValue }) => {
    try {
      const sessao = await api<Sessao>('/auth/cadastro', { method: 'POST', body: dados })
      tokenStorage.set(sessao.token)
      return sessao
    } catch (erro) {
      return rejectWithValue(extrairErro(erro))
    }
  },
)

export const login = createAsyncThunk<Sessao, LoginRequest, { rejectValue: ErroAuth }>(
  'auth/login',
  async (dados, { rejectWithValue }) => {
    try {
      const sessao = await api<Sessao>('/auth/login', { method: 'POST', body: dados })
      tokenStorage.set(sessao.token)
      return sessao
    } catch (erro) {
      return rejectWithValue(extrairErro(erro))
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async () => {
  tokenStorage.clear()
})

export const restaurarSessao = createAsyncThunk<
  UsuarioLogado,
  void,
  { rejectValue: ErroAuth }
>('auth/restaurarSessao', async (_, { rejectWithValue }) => {
  const token = tokenStorage.get()
  if (!token) {
    return rejectWithValue({ mensagem: 'Sem sessão ativa.', campos: {} })
  }

  try {
    return await api<UsuarioLogado>('/usuarios/eu')
  } catch (erro) {
    return rejectWithValue(extrairErro(erro))
  }
})

// Reducers compartilhados: login e restaurar sessão vão reaproveitar estes mesmos.
function comecou(state: AuthState) {
  state.status = 'carregando'
  state.erro = null
  state.campos = {}
}

function autenticou(state: AuthState, action: { payload: Sessao }) {
  state.status = 'ocioso'
  state.usuario = action.payload.usuario
  state.token = action.payload.token
}

function restaurou(state: AuthState, action: { payload: UsuarioLogado }) {
  state.status = 'ocioso'
  state.usuario = action.payload
  state.token = tokenStorage.get()
}

function falhou(state: AuthState, action: { payload?: ErroAuth }) {
  state.status = 'erro'
  state.erro = action.payload?.mensagem ?? MENSAGEM_PADRAO
  state.campos = action.payload?.campos ?? {}
}

function desautenticou(state: AuthState) {
  state.usuario = null
  state.token = null
  state.status = 'ocioso'
  state.erro = null
  state.campos = {}
}

function restauracaoFalhou(state: AuthState) {
  state.status = 'ocioso'
  state.erro = null
  state.campos = {}
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
    sessaoExpirada(state) {
      desautenticou(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cadastrar.pending, comecou)
      .addCase(cadastrar.fulfilled, autenticou)
      .addCase(cadastrar.rejected, falhou)
      .addCase(login.pending, comecou)
      .addCase(login.fulfilled, autenticou)
      .addCase(login.rejected, falhou)
      .addCase(logout.fulfilled, desautenticou)
      .addCase(restaurarSessao.pending, comecou)
      .addCase(restaurarSessao.fulfilled, restaurou)
      .addCase(restaurarSessao.rejected, restauracaoFalhou)
  },
})

export const { limparErro, sessaoExpirada } = authSlice.actions
export default authSlice.reducer

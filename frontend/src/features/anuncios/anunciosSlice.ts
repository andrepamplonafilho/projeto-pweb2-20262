import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { ApiError, type ErrosPorCampo } from '../../shared/api/errors'
import { api } from '../../shared/api/client'
import type { AlterarEstadoRequest, AnuncioDetalhe, EstadoAnuncio } from '../../shared/api/tipos'

export type StatusRequisicao = 'ocioso' | 'carregando' | 'erro'

interface RequisicaoState {
  status: StatusRequisicao
  erro: string | null
}

interface RequisicaoFormularioState extends RequisicaoState {
  campos: ErrosPorCampo
}

export interface ErroAnuncio {
  mensagem: string
  campos: ErrosPorCampo
}

interface AnunciosState {
  detalhe: AnuncioDetalhe | null
  busca: RequisicaoState
  salvamento: RequisicaoFormularioState
  alteracaoEstado: RequisicaoState
  buscaRequestId: string | null
}

const MENSAGEM_PADRAO = 'Erro inesperado. Tente novamente.'

function extrairErro(erro: unknown): ErroAnuncio {
  if (erro instanceof ApiError) {
    return { mensagem: erro.message, campos: erro.campos }
  }
  return { mensagem: MENSAGEM_PADRAO, campos: {} }
}

export const buscarAnuncio = createAsyncThunk<
  AnuncioDetalhe,
  number,
  { rejectValue: ErroAnuncio }
>('anuncios/buscar', async (id, { rejectWithValue, signal }) => {
  try {
    return await api<AnuncioDetalhe>(`/anuncios/${id}`, { signal })
  } catch (erro) {
    return rejectWithValue(extrairErro(erro))
  }
})

export const criarAnuncio = createAsyncThunk<
  AnuncioDetalhe,
  FormData,
  { rejectValue: ErroAnuncio }
>('anuncios/criar', async (dados, { rejectWithValue, signal }) => {
  try {
    return await api<AnuncioDetalhe>('/anuncios', {
      method: 'POST',
      body: dados,
      signal,
    })
  } catch (erro) {
    return rejectWithValue(extrairErro(erro))
  }
})

export const editarAnuncio = createAsyncThunk<
  AnuncioDetalhe,
  { id: number; dados: FormData },
  { rejectValue: ErroAnuncio }
>('anuncios/editar', async ({ id, dados }, { rejectWithValue, signal }) => {
  try {
    return await api<AnuncioDetalhe>(`/anuncios/${id}`, {
      method: 'PUT',
      body: dados,
      signal,
    })
  } catch (erro) {
    return rejectWithValue(extrairErro(erro))
  }
})

export const alterarEstadoAnuncio = createAsyncThunk<
  AnuncioDetalhe,
  { id: number; estado: EstadoAnuncio },
  { rejectValue: ErroAnuncio }
>('anuncios/alterarEstado', async ({ id, estado }, { rejectWithValue, signal }) => {
  try {
    const dados: AlterarEstadoRequest = { estado }
    return await api<AnuncioDetalhe>(`/anuncios/${id}/estado`, {
      method: 'PATCH',
      body: dados,
      signal,
    })
  } catch (erro) {
    return rejectWithValue(extrairErro(erro))
  }
})

const requisicaoInicial: RequisicaoState = { status: 'ocioso', erro: null }

const initialState: AnunciosState = {
  detalhe: null,
  busca: { ...requisicaoInicial },
  salvamento: { ...requisicaoInicial, campos: {} },
  alteracaoEstado: { ...requisicaoInicial },
  buscaRequestId: null,
}

const anunciosSlice = createSlice({
  name: 'anuncios',
  initialState,
  reducers: {
    limparErroSalvamento(state) {
      state.salvamento.status = 'ocioso'
      state.salvamento.erro = null
      state.salvamento.campos = {}
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buscarAnuncio.pending, (state, action) => {
        state.busca.status = 'carregando'
        state.busca.erro = null
        state.buscaRequestId = action.meta.requestId
      })
      .addCase(buscarAnuncio.fulfilled, (state, action) => {
        if (state.buscaRequestId !== action.meta.requestId) return
        state.detalhe = action.payload
        state.busca.status = 'ocioso'
        state.buscaRequestId = null
      })
      .addCase(buscarAnuncio.rejected, (state, action) => {
        if (state.buscaRequestId !== action.meta.requestId) return
        state.busca.status = action.meta.aborted ? 'ocioso' : 'erro'
        state.busca.erro = action.meta.aborted
          ? null
          : (action.payload?.mensagem ?? MENSAGEM_PADRAO)
        state.buscaRequestId = null
      })
      .addCase(criarAnuncio.pending, (state) => {
        state.salvamento.status = 'carregando'
        state.salvamento.erro = null
        state.salvamento.campos = {}
      })
      .addCase(criarAnuncio.fulfilled, (state, action) => {
        state.detalhe = action.payload
        state.salvamento.status = 'ocioso'
      })
      .addCase(criarAnuncio.rejected, (state, action) => {
        state.salvamento.status = action.meta.aborted ? 'ocioso' : 'erro'
        state.salvamento.erro = action.meta.aborted
          ? null
          : (action.payload?.mensagem ?? MENSAGEM_PADRAO)
        state.salvamento.campos = action.payload?.campos ?? {}
      })
      .addCase(editarAnuncio.pending, (state) => {
        state.salvamento.status = 'carregando'
        state.salvamento.erro = null
        state.salvamento.campos = {}
      })
      .addCase(editarAnuncio.fulfilled, (state, action) => {
        state.detalhe = action.payload
        state.salvamento.status = 'ocioso'
      })
      .addCase(editarAnuncio.rejected, (state, action) => {
        state.salvamento.status = action.meta.aborted ? 'ocioso' : 'erro'
        state.salvamento.erro = action.meta.aborted
          ? null
          : (action.payload?.mensagem ?? MENSAGEM_PADRAO)
        state.salvamento.campos = action.payload?.campos ?? {}
      })
      .addCase(alterarEstadoAnuncio.pending, (state) => {
        state.alteracaoEstado.status = 'carregando'
        state.alteracaoEstado.erro = null
      })
      .addCase(alterarEstadoAnuncio.fulfilled, (state, action) => {
        state.detalhe = action.payload
        state.alteracaoEstado.status = 'ocioso'
      })
      .addCase(alterarEstadoAnuncio.rejected, (state, action) => {
        state.alteracaoEstado.status = action.meta.aborted ? 'ocioso' : 'erro'
        state.alteracaoEstado.erro = action.meta.aborted
          ? null
          : (action.payload?.mensagem ?? MENSAGEM_PADRAO)
      })
  },
})

export const { limparErroSalvamento } = anunciosSlice.actions
export default anunciosSlice.reducer

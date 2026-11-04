// Tipos dos modelos da API, a partir de http://localhost:8080/v3/api-docs

export type Papel = 'estudante' | 'administrador'
export type Modalidade = 'venda' | 'doacao'
export type EstadoAnuncio = 'ativo' | 'pausado' | 'reservado' | 'vendido' | 'concluido'
export type EstadoConservacao = 'novo' | 'seminovo' | 'usado'

// ---------- Listas ----------

export interface Curso {
  id: number
  nome: string
}

export interface Categoria {
  id: number
  nome: string
  slug: string // valor do filtro `categoria` da busca
}

export interface OpcaoEstadoConservacao {
  valor: EstadoConservacao
  rotulo: string
}

// ---------- Usuário ----------

export interface UsuarioLogado {
  id: number
  nome: string
  email: string
  curso: Curso
  telefone: string | null
  fotoUrl: string | null // URL assinada, expira em 1h: não guardar
  papel: Papel
}

export interface Perfil {
  id: number
  nome: string
  curso: Curso
  telefone: string | null
  fotoUrl: string | null // URL assinada, expira em 1h
}

export interface AnuncianteResumo {
  id: number
  nome: string
}

// ---------- Autenticação ----------

export interface LoginRequest {
  email: string
  senha: string
}

export interface CadastroRequest {
  nome: string
  email: string // @academico.ifpb.edu.br
  senha: string // 6 a 72 caracteres
  cursoId: number
  telefone?: string | null
}

export interface Sessao {
  token: string
  expiraEm: string // date-time
  usuario: UsuarioLogado
}

export interface AtualizarUsuarioRequest {
  nome: string
  cursoId: number
  telefone?: string | null // vazio ou nulo remove o telefone
}

// ---------- Anúncios ----------

export interface FotoAnuncio {
  id: number
  url: string // URL assinada, expira em 1h
  capa: boolean
}

export interface AnuncioResumo {
  id: number
  titulo: string
  modalidade: Modalidade
  preco: number | null // nulo em doações
  estado: EstadoAnuncio
  estadoConservacao: EstadoConservacao
  categoria: Categoria
  capaUrl: string
  anunciante: AnuncianteResumo
  publicadoEm: string
}

export interface AnuncioDetalhe {
  id: number
  titulo: string
  descricao: string
  modalidade: Modalidade
  preco: number | null // nulo em doações
  estado: EstadoAnuncio
  estadoConservacao: EstadoConservacao
  categoria: Categoria
  localEntrega: string
  capaUrl: string
  fotos: FotoAnuncio[] // na ordem de exibição
  anunciante: Perfil
  publicadoEm: string
  atualizadoEm: string
}

export interface PaginaAnuncioResumo {
  itens: AnuncioResumo[]
  pagina: number
  tamanho: number
  total: number
  totalPaginas: number
}

export interface AlterarEstadoRequest {
  estado: EstadoAnuncio // `vendido` só em vendas; `concluido` só em doações
}

// Os formulários de anúncio vão como multipart/form-data (FormData), não JSON.
// Estes tipos descrevem os campos que a tela monta antes de gerar o FormData.

export interface NovoAnuncioForm {
  titulo: string // até 100
  descricao: string // até 2000
  modalidade: Modalidade
  preco?: number // obrigatório em vendas; ausente em doações
  estadoConservacao: EstadoConservacao
  categoriaId: number
  localEntrega: string // até 200
  fotos: File[] // 1 a 10 (JPEG, PNG ou WebP, até 5 MB cada)
  capaIndice?: number // padrão 0
}

export interface EdicaoAnuncioForm extends Omit<NovoAnuncioForm, 'fotos' | 'capaIndice'> {
  fotosMantidas?: number[] // ids das fotos atuais que ficam, na ordem
  fotos?: File[] // fotos novas; o total (mantidas + novas) fica entre 1 e 10
  capaId?: number // capa entre as mantidas...
  capaIndice?: number // ...ou entre as novas (use um dos dois)
}
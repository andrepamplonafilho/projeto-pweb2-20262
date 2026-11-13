import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  Button,
  ErrorMessage,
  Field,
  ImagePreviewCard,
  ImageUpload,
  Input,
  Select,
  Spinner,
  Textarea,
} from '../../components/ui'
import { ApiError } from '../../shared/api/errors'
import { api } from '../../shared/api/client'
import type {
  AnuncioDetalhe,
  Categoria,
  EstadoConservacao,
  Modalidade,
  OpcaoEstadoConservacao,
} from '../../shared/api/tipos'
import { buscarAnuncio, criarAnuncio, editarAnuncio, limparErroSalvamento } from './anunciosSlice'
import styles from './AnuncioFormularioPage.module.css'

interface CamposFormulario {
  titulo: string
  descricao: string
  modalidade: Modalidade
  preco: string
  estadoConservacao: EstadoConservacao | ''
  categoriaId: string
  localEntrega: string
}

interface FotoExistente {
  tipo: 'existente'
  chave: string
  id: number
  url: string
}

interface FotoNova {
  tipo: 'nova'
  chave: string
  arquivo: File
  url: string
}

type FotoFormulario = FotoExistente | FotoNova
type ErrosFormulario = Record<string, string>

const camposIniciais: CamposFormulario = {
  titulo: '',
  descricao: '',
  modalidade: 'venda',
  preco: '',
  estadoConservacao: '',
  categoriaId: '',
  localEntrega: '',
}

const tamanhoMaximoFoto = 5 * 1024 * 1024

function mensagemErro(erro: unknown) {
  return erro instanceof ApiError ? erro.message : 'Não foi possível carregar as opções do anúncio.'
}

function preencherFormulario(anuncio: AnuncioDetalhe): CamposFormulario {
  return {
    titulo: anuncio.titulo,
    descricao: anuncio.descricao,
    modalidade: anuncio.modalidade,
    preco: anuncio.preco === null ? '' : String(anuncio.preco),
    estadoConservacao: anuncio.estadoConservacao,
    categoriaId: String(anuncio.categoria.id),
    localEntrega: anuncio.localEntrega,
  }
}

function montarFormData(
  campos: CamposFormulario,
  fotos: FotoFormulario[],
  capa: string,
  editando: boolean,
) {
  const dados = new FormData()
  dados.append('titulo', campos.titulo.trim())
  dados.append('descricao', campos.descricao.trim())
  dados.append('modalidade', campos.modalidade)
  if (campos.modalidade === 'venda') dados.append('preco', campos.preco)
  dados.append('estadoConservacao', campos.estadoConservacao)
  dados.append('categoriaId', campos.categoriaId)
  dados.append('localEntrega', campos.localEntrega.trim())

  const mantidas = fotos.filter((foto): foto is FotoExistente => foto.tipo === 'existente')
  const novas = fotos.filter((foto): foto is FotoNova => foto.tipo === 'nova')
  if (editando) {
    mantidas.forEach((foto) => dados.append('fotosMantidas', String(foto.id)))
    novas.forEach((foto) => dados.append('fotos', foto.arquivo))
    const capaExistente = mantidas.find((foto) => foto.chave === capa)
    if (capaExistente) {
      dados.append('capaId', String(capaExistente.id))
    } else {
      const indiceCapa = novas.findIndex((foto) => foto.chave === capa)
      if (indiceCapa >= 0) dados.append('capaIndice', String(indiceCapa))
    }
  } else {
    novas.forEach((foto) => dados.append('fotos', foto.arquivo))
    const indiceCapa = novas.findIndex((foto) => foto.chave === capa)
    if (indiceCapa >= 0) dados.append('capaIndice', String(indiceCapa))
  }
  return dados
}

export default function AnuncioFormularioPage() {
  const { id: idParam } = useParams()
  const editando = idParam !== undefined
  const id = Number(idParam)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const usuario = useAppSelector((state) => state.auth.usuario)
  const statusAuth = useAppSelector((state) => state.auth.status)
  const anuncioRedux = useAppSelector((state) => state.anuncios.detalhe)
  const statusBusca = useAppSelector((state) => state.anuncios.busca.status)
  const erroBusca = useAppSelector((state) => state.anuncios.busca.erro)
  const salvamento = useAppSelector((state) => state.anuncios.salvamento)
  const anuncio = editando && anuncioRedux?.id === id ? anuncioRedux : null

  const [campos, setCampos] = useState(camposIniciais)
  const [fotos, setFotos] = useState<FotoFormulario[]>([])
  const [capa, setCapa] = useState('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [estados, setEstados] = useState<OpcaoEstadoConservacao[]>([])
  const [erroCatalogo, setErroCatalogo] = useState<string | null>(null)
  const [carregandoCatalogo, setCarregandoCatalogo] = useState(true)
  const [errosLocais, setErrosLocais] = useState<ErrosFormulario>({})
  const [erroFotos, setErroFotos] = useState<string | null>(null)
  const [anuncioInicializado, setAnuncioInicializado] = useState<number | null>(null)
  const sequenciaFoto = useRef(0)
  const urlsFotos = useRef(new Set<string>())

  useEffect(() => {
    let ativo = true
    Promise.all([
      api<Categoria[]>('/categorias'),
      api<OpcaoEstadoConservacao[]>('/estados-conservacao'),
    ])
      .then(([listaCategorias, listaEstados]) => {
        if (!ativo) return
        setCategorias(listaCategorias)
        setEstados(listaEstados)
        setCarregandoCatalogo(false)
      })
      .catch((erro: unknown) => {
        if (!ativo) return
        setErroCatalogo(mensagemErro(erro))
        setCarregandoCatalogo(false)
      })
    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    if (!editando || !Number.isSafeInteger(id) || id < 1) return
    const requisicao = dispatch(buscarAnuncio(id))
    return () => requisicao.abort()
  }, [dispatch, editando, id])

  if (anuncio && anuncioInicializado !== anuncio.id) {
    setCampos(preencherFormulario(anuncio))
    const fotosAnuncio: FotoExistente[] = anuncio.fotos.map((foto) => ({
      tipo: 'existente',
      chave: `existente-${foto.id}`,
      id: foto.id,
      url: foto.url,
    }))
    setFotos(fotosAnuncio)
    setCapa(
      fotosAnuncio.find((foto) => anuncio.fotos.find((original) => original.id === foto.id)?.capa)
        ?.chave ??
        fotosAnuncio[0]?.chave ??
        '',
    )
    setAnuncioInicializado(anuncio.id)
  }

  useEffect(
    () => () => {
      urlsFotos.current.forEach((url) => URL.revokeObjectURL(url))
      urlsFotos.current.clear()
    },
    [],
  )

  const alterarCampo = (campo: keyof CamposFormulario, valor: string) => {
    setCampos((atuais) => ({ ...atuais, [campo]: valor }))
    setErrosLocais((atuais) => ({ ...atuais, [campo]: '' }))
    dispatch(limparErroSalvamento())
  }

  const adicionarFotos = (arquivos: File[]) => {
    setErroFotos(null)
    const dentroDoLimite = arquivos.filter((arquivo) => arquivo.size <= tamanhoMaximoFoto)
    const acimaDoLimite = arquivos
      .filter((arquivo) => arquivo.size > tamanhoMaximoFoto)
      .map((arquivo) => arquivo.name)
    const mensagens =
      acimaDoLimite.length > 0 ? [`Arquivos acima de 5 MB: ${acimaDoLimite.join(', ')}.`] : []

    if (fotos.length + dentroDoLimite.length > 10) {
      mensagens.push('O anúncio pode ter no máximo 10 fotos.')
      setErroFotos(mensagens.join(' '))
      return
    }

    setErroFotos(mensagens.length > 0 ? mensagens.join(' ') : null)
    const novasFotos = dentroDoLimite.map((arquivo): FotoNova => {
      const url = URL.createObjectURL(arquivo)
      urlsFotos.current.add(url)
      return {
        tipo: 'nova',
        chave: `nova-${sequenciaFoto.current++}`,
        arquivo,
        url,
      }
    })
    if (novasFotos.length === 0) return
    setFotos((atuais) => [...atuais, ...novasFotos])
    setCapa((atual) => atual || novasFotos[0]?.chave || '')
  }

  const removerFoto = (chave: string) => {
    const foto = fotos.find((item) => item.chave === chave)
    if (foto?.tipo === 'nova') {
      URL.revokeObjectURL(foto.url)
      urlsFotos.current.delete(foto.url)
    }
    const restantes = fotos.filter((item) => item.chave !== chave)
    setFotos(restantes)
    if (capa === chave) setCapa(restantes[0]?.chave ?? '')
    setErroFotos(null)
  }

  const validar = () => {
    const novosErros: ErrosFormulario = {}
    if (!campos.titulo.trim()) novosErros.titulo = 'Informe o título.'
    if (campos.titulo.length > 100) novosErros.titulo = 'Use no máximo 100 caracteres.'
    if (!campos.descricao.trim()) novosErros.descricao = 'Informe a descrição.'
    if (campos.descricao.length > 2000) novosErros.descricao = 'Use no máximo 2000 caracteres.'
    if (campos.modalidade === 'venda') {
      const preco = Number(campos.preco)
      if (!campos.preco || !Number.isFinite(preco) || preco <= 0) {
        novosErros.preco = 'Informe um preço válido para a venda.'
      } else if (!/^\d{1,7}(\.\d{1,2})?$/.test(campos.preco)) {
        novosErros.preco = 'Use até 7 dígitos e 2 casas decimais.'
      }
    }
    if (!campos.estadoConservacao)
      novosErros.estadoConservacao = 'Selecione o estado de conservação.'
    if (!campos.categoriaId) novosErros.categoriaId = 'Selecione uma categoria.'
    if (!campos.localEntrega.trim()) novosErros.localEntrega = 'Informe o local de entrega.'
    if (campos.localEntrega.length > 200) novosErros.localEntrega = 'Use no máximo 200 caracteres.'
    if (fotos.length < 1 || fotos.length > 10) setErroFotos('O anúncio deve ter de 1 a 10 fotos.')
    else if (!fotos.some((foto) => foto.chave === capa)) setErroFotos('Escolha uma foto de capa.')
    setErrosLocais(novosErros)
    return (
      Object.keys(novosErros).length === 0 &&
      fotos.length >= 1 &&
      fotos.length <= 10 &&
      fotos.some((foto) => foto.chave === capa)
    )
  }

  const enviar = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    if (!validar()) return
    dispatch(limparErroSalvamento())
    const dados = montarFormData(campos, fotos, capa, editando)
    const resultado = editando
      ? await dispatch(editarAnuncio({ id, dados }))
      : await dispatch(criarAnuncio(dados))
    if (criarAnuncio.fulfilled.match(resultado) || editarAnuncio.fulfilled.match(resultado)) {
      navigate(`/anuncios/${resultado.payload.id}`, { replace: true })
    }
  }

  if (editando && (!Number.isSafeInteger(id) || id < 1)) {
    return (
      <ErrorMessage title="Anúncio inválido" message="O identificador do anúncio é inválido." />
    )
  }
  if (editando && (statusBusca === 'carregando' || (statusAuth === 'carregando' && !usuario))) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando anúncio" />
      </div>
    )
  }
  if (editando && statusBusca === 'erro') {
    return (
      <ErrorMessage
        message={erroBusca ?? 'Não foi possível carregar o anúncio.'}
        onRetry={() => void dispatch(buscarAnuncio(id))}
      />
    )
  }
  if (
    editando &&
    anuncio &&
    anuncioInicializado === anuncio.id &&
    (!usuario || anuncio.anunciante.id !== usuario.id)
  ) {
    return (
      <ErrorMessage
        title="Acesso não permitido"
        message="Somente o anunciante pode editar este anúncio."
      />
    )
  }
  if (editando && !anuncio) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando anúncio" />
      </div>
    )
  }

  if (carregandoCatalogo) {
    return (
      <div className={styles.loading}>
        <Spinner label="Carregando opções" />
      </div>
    )
  }
  if (erroCatalogo) {
    return <ErrorMessage message={erroCatalogo} onRetry={() => window.location.reload()} />
  }

  return (
    <section className={styles.page}>
      <Link to={editando ? `/anuncios/${id}` : '/vendas'} className={styles.backLink}>
        ← {editando ? 'Voltar ao anúncio' : 'Voltar'}
      </Link>
      <h1>{editando ? 'Editar anúncio' : 'Novo anúncio'}</h1>
      <p className={styles.subtitle}>Preencha os dados e publique seu anúncio imediatamente.</p>

      <form className={styles.form} onSubmit={enviar} noValidate>
        {salvamento.erro && (
          <p className={styles.errorSummary} role="alert">
            {salvamento.erro}
          </p>
        )}

        <Field label="Título" required error={errosLocais.titulo || salvamento.campos.titulo}>
          <Input
            value={campos.titulo}
            maxLength={100}
            onChange={(evento) => alterarCampo('titulo', evento.target.value)}
          />
        </Field>
        <Field
          label="Descrição"
          required
          error={errosLocais.descricao || salvamento.campos.descricao}
        >
          <Textarea
            value={campos.descricao}
            rows={5}
            maxLength={2000}
            onChange={(evento) => alterarCampo('descricao', evento.target.value)}
          />
        </Field>
        <Field
          label="Modalidade"
          required
          error={errosLocais.modalidade || salvamento.campos.modalidade}
        >
          <Select
            value={campos.modalidade}
            onChange={(evento) => alterarCampo('modalidade', evento.target.value)}
          >
            <option value="venda">Venda</option>
            <option value="doacao">Doação</option>
          </Select>
        </Field>
        {campos.modalidade === 'venda' && (
          <Field label="Preço (R$)" required error={errosLocais.preco || salvamento.campos.preco}>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={campos.preco}
              onChange={(evento) => alterarCampo('preco', evento.target.value)}
            />
          </Field>
        )}
        <Field
          label="Estado de conservação"
          required
          error={errosLocais.estadoConservacao || salvamento.campos.estadoConservacao}
        >
          <Select
            value={campos.estadoConservacao}
            onChange={(evento) => alterarCampo('estadoConservacao', evento.target.value)}
          >
            <option value="">Selecione</option>
            {estados.map((estado) => (
              <option key={estado.valor} value={estado.valor}>
                {estado.rotulo}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Categoria"
          required
          error={errosLocais.categoriaId || salvamento.campos.categoriaId}
        >
          <Select
            value={campos.categoriaId}
            onChange={(evento) => alterarCampo('categoriaId', evento.target.value)}
          >
            <option value="">Selecione</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Local de entrega"
          required
          error={errosLocais.localEntrega || salvamento.campos.localEntrega}
        >
          <Input
            value={campos.localEntrega}
            maxLength={200}
            onChange={(evento) => alterarCampo('localEntrega', evento.target.value)}
          />
        </Field>

        <div className={styles.photoField}>
          <label htmlFor="fotos-anuncio" className={styles.photoLabel}>
            Fotos (de 1 a 10)
          </label>
          <ImageUpload
            id="fotos-anuncio"
            multiple
            hint="JPEG, PNG ou WebP. Até 5 MB por imagem; você pode enviar até 10."
            error={erroFotos || salvamento.campos.fotos}
            onFiles={adicionarFotos}
          />
          {salvamento.campos.capaIndice && (
            <p className={styles.fieldError} role="alert">
              {salvamento.campos.capaIndice}
            </p>
          )}
          <div className={styles.photoGrid}>
            {fotos.map((foto) => (
              <ImagePreviewCard
                key={foto.chave}
                src={foto.url}
                alt={foto.tipo === 'nova' ? foto.arquivo.name : 'Foto do anúncio'}
                selectionName="foto-capa"
                selectionValue={foto.chave}
                selectionLabel="Foto de capa"
                selected={capa === foto.chave}
                onSelect={() => setCapa(foto.chave)}
                onRemove={() => removerFoto(foto.chave)}
              />
            ))}
          </div>
        </div>

        {salvamento.campos.capaId && (
          <p className={styles.fieldError} role="alert">
            {salvamento.campos.capaId}
          </p>
        )}
        <div className={styles.actions}>
          <Button type="submit" disabled={salvamento.status === 'carregando'}>
            {salvamento.status === 'carregando'
              ? 'Publicando...'
              : editando
                ? 'Salvar alterações'
                : 'Publicar anúncio'}
          </Button>
        </div>
      </form>
    </section>
  )
}

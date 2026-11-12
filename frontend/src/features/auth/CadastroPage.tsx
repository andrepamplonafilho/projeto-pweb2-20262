import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate } from 'react-router'
import { Alert, Button, Field, Input, Select } from '../../components/ui'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { cadastrar, limparErro } from './authSlice'
import { useCursos } from './useCursos'
import styles from './AuthPage.module.css'

const DOMINIO = '@academico.ifpb.edu.br'

export default function CadastroPage() {
  const dispatch = useAppDispatch()
  const { token, status, erro, campos } = useAppSelector((s) => s.auth)
  const { cursos, carregando: carregandoCursos, erro: erroCursos } = useCursos()

  // Valores do formulário em estado local (fora do Redux)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cursoId, setCursoId] = useState('')
  const [telefone, setTelefone] = useState('')

  // Erros de validação do próprio formulário (antes de chamar a API)
  const [errosLocais, setErrosLocais] = useState<Record<string, string>>({})

  // Ao abrir a página, limpa erro que tenha sobrado de outra tela
  useEffect(() => {
    dispatch(limparErro())
  }, [dispatch])

  // Quem já está logado (inclusive logo após cadastrar) vai para a página inicial
  if (token) return <Navigate to="/vendas" replace />

  const enviando = status === 'carregando'

  function validar(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!nome.trim()) e.nome = 'Informe seu nome.'
    if (!email.trim()) {
      e.email = 'Informe seu e-mail.'
    } else if (!email.trim().toLowerCase().endsWith(DOMINIO)) {
      e.email = `Use o e-mail institucional (${DOMINIO}).`
    }
    if (senha.length < 6) e.senha = 'A senha deve ter pelo menos 6 caracteres.'
    if (!cursoId) e.cursoId = 'Escolha seu curso.'
    return e
  }

  function aoEnviar(ev: FormEvent) {
    ev.preventDefault()
    const e = validar()
    setErrosLocais(e)
    if (Object.keys(e).length > 0) return

    dispatch(
      cadastrar({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        cursoId: Number(cursoId),
        telefone: telefone.trim() || null,
      }),
    )
  }

  // Erro local tem prioridade; senão mostra o que a API devolveu para o campo
  const erroDe = (campo: string) => errosLocais[campo] ?? campos[campo]

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="cadastro-title">
        <header className={styles.header}>
          <h1 id="cadastro-title" className={styles.title}>
            Cadastro
          </h1>
          <p className={styles.subtitle}>Crie sua conta com seu e-mail institucional.</p>
        </header>
        <form className={styles.form} onSubmit={aoEnviar} noValidate>
          {erro && <Alert variant="error">{erro}</Alert>}
          {erroCursos && <Alert variant="warning">{erroCursos}</Alert>}

          <Field label="Nome" required error={erroDe('nome')}>
            <Input value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="name" />
          </Field>

          <Field label="E-mail institucional" required error={erroDe('email')}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={`seunome${DOMINIO}`}
              autoComplete="email"
            />
          </Field>

          <Field label="Senha" required error={erroDe('senha')}>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="new-password"
            />
          </Field>

          <Field label="Curso" required error={erroDe('cursoId')}>
            <Select
              value={cursoId}
              onChange={(e) => setCursoId(e.target.value)}
              disabled={carregandoCursos}
            >
              <option value="">{carregandoCursos ? 'Carregando cursos...' : 'Selecione...'}</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Telefone/WhatsApp (opcional)" error={erroDe('telefone')}>
            <Input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(83) 99999-0000"
              autoComplete="tel"
            />
          </Field>

          <Button className={styles.submit} type="submit" disabled={enviando || carregandoCursos}>
            {enviando ? 'Cadastrando...' : 'Cadastrar'}
          </Button>

          <p className={styles.footer}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

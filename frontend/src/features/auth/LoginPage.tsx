import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router'
import { Alert, Button, Field, Input } from '../../components/ui'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { limparErro, login } from './authSlice'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { token, status, erro, campos } = useAppSelector((s) => s.auth)

  // Valores do formulário em estado local (fora do Redux)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [errosLocais, setErrosLocais] = useState<Record<string, string>>({})

  // Ao abrir a página, limpa erro que tenha sobrado de outra tela
  useEffect(() => {
    dispatch(limparErro())
  }, [dispatch])

  // Já logado (ou login bem-sucedido): volta para a página de origem, ou /vendas
  if (token) {
    const origem = (location.state as { from?: string } | null)?.from ?? '/vendas'
    return <Navigate to={origem} replace />
  }

  const enviando = status === 'carregando'

  function aoEnviar(ev: FormEvent) {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (!email.trim()) e.email = 'Informe seu e-mail.'
    if (!senha) e.senha = 'Informe sua senha.'
    setErrosLocais(e)
    if (Object.keys(e).length > 0) return

    dispatch(login({ email: email.trim(), senha }))
  }

  const erroDe = (campo: string) => errosLocais[campo] ?? campos[campo]

  return (
    <main className={styles.page}>
      <section className={styles.card} aria-labelledby="login-title">
        <header className={styles.header}>
          <h1 id="login-title" className={styles.title}>
            Entrar
          </h1>
          <p className={styles.subtitle}>Acesse sua conta para continuar.</p>
        </header>
        <form className={styles.form} onSubmit={aoEnviar} noValidate>
          {erro && <Alert variant="error">{erro}</Alert>}

          <Field label="E-mail" required error={erroDe('email')}>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>

          <Field label="Senha" required error={erroDe('senha')}>
            <Input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />
          </Field>

          <Button className={styles.submit} type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </Button>

          <p className={styles.footer}>
            Ainda não tem conta? <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </form>
      </section>
    </main>
  )
}

import { createBrowserRouter, Navigate } from 'react-router'
import Pagina from './Pagina'
import RotaProtegida from './RotaProtegida'
import NaoEncontrada from './NaoEncontrada'
import { Layout } from '../components/layout/Layout/Layout'
import CadastroPage from '../features/auth/CadastroPage'
import LoginPage from '../features/auth/LoginPage'
import AnuncioDetalhePage from '../features/anuncios/AnuncioDetalhePage'
import AnuncioFormularioPage from '../features/anuncios/AnuncioFormularioPage'
import BuscaPage from '../features/busca/BuscaPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/cadastro', element: <CadastroPage /> },
  { path: '/admin/login', element: <Pagina titulo="Login do administrador" /> },

  {
    element: <RotaProtegida />,
    children: [
      {
        element: <Layout />,
        children: [
          { path: '/', element: <Navigate to="/vendas" replace /> },
          { path: '/vendas', element: <BuscaPage /> },
          { path: '/doacoes', element: <BuscaPage /> },
          { path: '/perfil', element: <Pagina titulo="Meu perfil" /> },
          { path: '/perfil/editar', element: <Pagina titulo="Editar perfil" /> },
          { path: '/usuarios/:id', element: <Pagina titulo="Perfil do usuário" /> },
          { path: '/anuncios/novo', element: <AnuncioFormularioPage /> },
          { path: '/anuncios/:id', element: <AnuncioDetalhePage /> },
          { path: '/anuncios/:id/editar', element: <AnuncioFormularioPage /> },
        ],
      },
    ],
  },
  {
    element: <RotaProtegida admin />,
    children: [{ path: '/admin', element: <Pagina titulo="Administração" /> }],
  },
  { path: '*', element: <NaoEncontrada /> },
])

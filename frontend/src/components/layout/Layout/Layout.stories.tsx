import type { Meta, StoryObj } from '@storybook/react-vite'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { store } from '../../../app/store'
import { Layout } from './Layout'

const meta: Meta<typeof Layout> = {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <MemoryRouter initialEntries={['/vendas']}>
          <Routes>
            <Route element={<Story />}>
              <Route path="/vendas" element={<h1>Conteúdo da página de Vendas</h1>} />
              <Route path="/doacoes" element={<h1>Conteúdo da página de Doações</h1>} />
              <Route path="/perfil" element={<h1>Conteúdo do Perfil</h1>} />
            </Route>
            <Route path="/login" element={<h1>Tela de login</h1>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Layout>

export const Padrao: Story = {}

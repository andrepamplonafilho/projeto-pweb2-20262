import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'

const meta: Meta<typeof Layout> = {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/vendas']}>
        <Routes>
          <Route element={<Story />}>
            <Route path="/vendas" element={<h1>Conteúdo da página de Vendas</h1>} />
            <Route path="/doacoes" element={<h1>Conteúdo da página de Doações</h1>} />
            <Route path="/perfil" element={<h1>Conteúdo do Perfil</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Layout>

export const Padrao: Story = {}

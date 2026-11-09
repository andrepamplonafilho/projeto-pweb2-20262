import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { Card } from './Card'

const capa =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>" +
      "<rect width='400' height='300' fill='#e2f1df'/>" +
      "<rect x='120' y='90' width='160' height='120' rx='16' fill='#2a9d8f'/>" +
      '</svg>',
  )

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  args: {
    title: 'Calculadora científica Casio',
    modality: 'venda',
    price: 45,
    coverUrl: capa,
  },
  argTypes: {
    modality: {
      control: 'select',
      options: ['venda', 'doacao'],
    },
    status: {
      control: 'select',
      options: ['ativo', 'pausado', 'reservado', 'vendido', 'concluido', 'removido'],
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div style={{ width: '16rem' }}>
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Card>

export const Venda: Story = {}

export const Doacao: Story = {
  args: {
    title: 'Livros de cálculo (volumes 1 e 2)',
    modality: 'doacao',
    price: undefined,
  },
}

export const SemFoto: Story = {
  args: { coverUrl: null },
}

export const ComEstado: Story = {
  args: { status: 'reservado' },
}

export const DoacaoConcluida: Story = {
  args: {
    title: 'Mochila escolar',
    modality: 'doacao',
    price: undefined,
    status: 'concluido',
  },
}

export const TituloLongo: Story = {
  args: {
    title:
      'Kit completo de ferramentas para laboratório de eletrônica com multímetro e ferro de solda',
    price: 189.9,
  },
}

export const ComLink: Story = {
  args: { to: '/anuncios/1' },
}

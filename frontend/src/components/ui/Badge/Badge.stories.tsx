import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  args: { status: 'ativo' },
  argTypes: {
    status: {
      control: 'select',
      options: ['ativo', 'pausado', 'reservado', 'vendido', 'concluido', 'removido'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Badge>

export const Ativo: Story = {}

export const Pausado: Story = { args: { status: 'pausado' } }

export const Reservado: Story = { args: { status: 'reservado' } }

export const Vendido: Story = { args: { status: 'vendido' } }

export const Concluido: Story = { args: { status: 'concluido' } }

export const Removido: Story = { args: { status: 'removido' } }

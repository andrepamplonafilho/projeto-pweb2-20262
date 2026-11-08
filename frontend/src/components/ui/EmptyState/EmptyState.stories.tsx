import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  args: {
    title: 'Nenhum anúncio encontrado',
    description: 'Tente mudar os filtros ou volte mais tarde.',
  },
}

export default meta

type Story = StoryObj<typeof EmptyState>

export const Padrao: Story = {}

export const ComAcao: Story = {
  args: {
    title: 'Você ainda não tem anúncios',
    description: 'Publique o primeiro item para vender ou doar.',
    actionLabel: 'Criar anúncio',
    onAction: () => {},
  },
}

export const SoTitulo: Story = {
  args: { description: undefined },
}

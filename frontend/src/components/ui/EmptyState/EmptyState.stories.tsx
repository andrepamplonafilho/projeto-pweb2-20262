import type { Meta, StoryObj } from '@storybook/react-vite'
import { EmptyState } from './EmptyState'

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  args: {
    title: 'Nenhuma aula encontrada',
    description: 'Tente mudar os filtros ou volte mais tarde.',
  },
}

export default meta

type Story = StoryObj<typeof EmptyState>

export const Padrao: Story = {}

export const ComAcao: Story = {
  args: {
    title: 'Você ainda não tem aulas',
    description: 'Publique a primeira aula, paga ou gratuita.',
    actionLabel: 'Publicar aula',
    onAction: () => {},
  },
}

export const SoTitulo: Story = {
  args: { description: undefined },
}

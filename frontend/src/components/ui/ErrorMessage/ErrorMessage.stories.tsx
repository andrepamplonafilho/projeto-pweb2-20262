import type { Meta, StoryObj } from '@storybook/react-vite'
import { ErrorMessage } from './ErrorMessage'

const meta: Meta<typeof ErrorMessage> = {
  title: 'UI/ErrorMessage',
  component: ErrorMessage,
  args: {
    message: 'Não foi possível carregar os anúncios. Verifique sua conexão.',
  },
}

export default meta

type Story = StoryObj<typeof ErrorMessage>

export const Padrao: Story = {}

export const ComTentarNovamente: Story = {
  args: { onRetry: () => {} },
}

export const ComTituloPersonalizado: Story = {
  args: {
    title: 'Anúncio não encontrado',
    message: 'Ele pode ter sido removido pelo administrador.',
  },
}

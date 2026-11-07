import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert } from './Alert'

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  args: {
    children: 'Seu anúncio foi atualizado.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Alert>

export const Informacao: Story = {
  args: { variant: 'info', children: 'Você só vê anúncios do seu campus.' },
}

export const Sucesso: Story = {
  args: { variant: 'success', title: 'Pronto!', children: 'Anúncio publicado.' },
}

export const Aviso: Story = {
  args: {
    variant: 'warning',
    title: 'Atenção',
    children: 'Este anúncio está pausado e não aparece nas buscas.',
  },
}

export const Erro: Story = {
  args: {
    variant: 'error',
    title: 'Não foi possível salvar',
    children: 'Confira os campos destacados e tente de novo.',
  },
}

export const ComBotaoFechar: Story = {
  args: { variant: 'success', onClose: () => {} },
}

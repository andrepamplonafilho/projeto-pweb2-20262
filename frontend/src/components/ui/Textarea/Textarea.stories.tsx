import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Descreva a aula: conteúdo, duração, pré-requisitos...',
    'aria-label': 'Descrição',
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Padrao: Story = {}

export const ComValor: Story = {
  args: {
    defaultValue: 'Aulas práticas de Cálculo I, com listas de exercícios resolvidos.',
  },
}

export const ComErro: Story = {
  args: { invalid: true },
}

export const Desabilitado: Story = {
  args: { disabled: true, placeholder: 'Campo indisponível' },
}

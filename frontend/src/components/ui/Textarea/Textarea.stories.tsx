import type { Meta, StoryObj } from '@storybook/react-vite'
import { Textarea } from './Textarea'

const meta: Meta<typeof Textarea> = {
  title: 'UI/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Descreva o item: estado, tempo de uso, detalhes...',
    'aria-label': 'Descrição',
  },
}

export default meta

type Story = StoryObj<typeof Textarea>

export const Padrao: Story = {}

export const ComValor: Story = {
  args: {
    defaultValue: 'Calculadora científica em ótimo estado, usada por um semestre.',
  },
}

export const ComErro: Story = {
  args: { invalid: true },
}

export const Desabilitado: Story = {
  args: { disabled: true, placeholder: 'Campo indisponível' },
}

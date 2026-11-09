import type { Meta, StoryObj } from '@storybook/react-vite'
import { Input } from './Input'

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  args: {
    placeholder: 'seu.nome@academico.ifpb.edu.br',
    'aria-label': 'E-mail',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'tel'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Input>

export const Padrao: Story = {}

export const ComValor: Story = {
  args: { defaultValue: 'estudante@academico.ifpb.edu.br' },
}

export const ComErro: Story = {
  args: { defaultValue: 'estudante@gmail.com', invalid: true },
}

export const Desabilitado: Story = {
  args: { disabled: true, placeholder: 'Campo indisponível' },
}

export const Senha: Story = {
  args: { type: 'password', placeholder: 'Sua senha', 'aria-label': 'Senha' },
}

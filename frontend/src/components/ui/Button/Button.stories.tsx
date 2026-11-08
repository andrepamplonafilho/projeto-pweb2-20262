import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Botão',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primario: Story = {
  args: { variant: 'primary', children: 'Salvar' },
}

export const Secundario: Story = {
  args: { variant: 'secondary', children: 'Cancelar' },
}

export const Perigo: Story = {
  args: { variant: 'danger', children: 'Remover anúncio' },
}

export const Pequeno: Story = {
  args: { size: 'sm', children: 'Ver detalhes' },
}

export const Desabilitado: Story = {
  args: { disabled: true, children: 'Indisponível' },
}

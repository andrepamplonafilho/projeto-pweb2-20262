import type { Meta, StoryObj } from '@storybook/react-vite'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Spinner>

export const Padrao: Story = {}

export const Pequeno: Story = {
  args: { size: 'sm' },
}

export const Grande: Story = {
  args: { size: 'lg' },
}

export const ComRotuloPersonalizado: Story = {
  args: { size: 'lg', label: 'Carregando anúncios' },
}

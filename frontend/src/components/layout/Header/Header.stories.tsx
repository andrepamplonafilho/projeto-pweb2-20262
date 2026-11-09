import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { Header } from './Header'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/vendas']}>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    onLogout: () => {},
  },
}

export default meta

type Story = StoryObj<typeof Header>

export const Padrao: Story = {}

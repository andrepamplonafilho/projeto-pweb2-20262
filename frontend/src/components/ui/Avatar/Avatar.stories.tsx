import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const foto =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>" +
      "<rect width='96' height='96' fill='#2a9d8f'/>" +
      "<circle cx='48' cy='38' r='16' fill='white'/>" +
      "<rect x='20' y='60' width='56' height='36' rx='18' fill='white'/>" +
      '</svg>',
  )

const meta: Meta<typeof Avatar> = {
  title: 'UI/Avatar',
  component: Avatar,
  args: {
    name: 'Maria Souza',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
  },
}

export default meta

type Story = StoryObj<typeof Avatar>

export const ComImagem: Story = {
  args: { src: foto },
}

export const SemFoto: Story = {}

export const ImagemQuebrada: Story = {
  args: { src: '/arquivo-que-nao-existe.png' },
}

export const Tamanhos: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size="xl" />
    </div>
  ),
}

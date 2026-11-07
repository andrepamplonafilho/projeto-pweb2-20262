import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'
import { Toast, ToastViewport } from './Toast'

function AutoCloseDemo() {
  const [open, setOpen] = useState(true)

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Mostrar toast
      </Button>
      <ToastViewport>
        {open && (
          <Toast variant="success" title="Pronto!" duration={3000} onClose={() => setOpen(false)}>
            Anúncio publicado. Some em 3 segundos.
          </Toast>
        )}
      </ToastViewport>
    </>
  )
}

const meta: Meta<typeof Toast> = {
  title: 'UI/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    children: 'Seu perfil foi atualizado.',
    duration: 0,
    onClose: () => {},
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info'],
    },
  },
  decorators: [
    (Story) => (
      <ToastViewport>
        <Story />
      </ToastViewport>
    ),
  ],
}

export default meta

type Story = StoryObj<typeof Toast>

export const Sucesso: Story = {
  args: { variant: 'success', title: 'Pronto!' },
}

export const Erro: Story = {
  args: {
    variant: 'error',
    title: 'Não foi possível salvar',
    children: 'Tente de novo em instantes.',
  },
}

export const FechaSozinho: Story = {
  decorators: [(Story) => <Story />],
  render: () => <AutoCloseDemo />,
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageUpload } from './ImageUpload'

const meta: Meta<typeof ImageUpload> = {
  title: 'UI/ImageUpload',
  component: ImageUpload,
  args: {
    id: 'upload-imagens',
    multiple: true,
    hint: 'JPEG, PNG ou WebP. Até 5 MB por imagem.',
    onFiles: () => {},
  },
}

export default meta

type Story = StoryObj<typeof ImageUpload>

export const Padrao: Story = {}

export const UmaImagem: Story = {
  args: {
    id: 'upload-imagem',
    multiple: false,
    hint: 'JPEG, PNG ou WebP.',
  },
}

export const ComErro: Story = {
  args: {
    id: 'upload-com-erro',
    error: 'O arquivo excede o tamanho permitido.',
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImagePreviewCard } from './ImagePreviewCard'

const imagem =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>" +
      "<rect width='400' height='300' fill='#e2f1df'/>" +
      "<circle cx='200' cy='150' r='70' fill='#2a9d8f'/>" +
      '</svg>',
  )

const meta: Meta<typeof ImagePreviewCard> = {
  title: 'UI/ImagePreviewCard',
  component: ImagePreviewCard,
  args: {
    src: imagem,
    alt: 'Prévia de uma imagem',
    selectionName: 'imagem-selecionada',
    selectionValue: 'imagem-1',
    selectionLabel: 'Selecionar imagem',
    selected: true,
    onSelect: () => {},
    onRemove: () => {},
  },
}

export default meta

type Story = StoryObj<typeof ImagePreviewCard>

export const Padrao: Story = {}

export const Desmarcada: Story = {
  args: { selected: false },
}

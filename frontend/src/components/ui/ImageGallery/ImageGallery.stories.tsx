import type { Meta, StoryObj } from '@storybook/react-vite'
import { ImageGallery } from './ImageGallery'

const image1 =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'>" +
      "<rect width='640' height='480' fill='#e2f1df'/>" +
      "<circle cx='320' cy='240' r='120' fill='#2a9d8f'/>" +
      '</svg>',
  )
const image2 =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='640' height='480'>" +
      "<rect width='640' height='480' fill='#e6e6e6'/>" +
      "<rect x='160' y='100' width='320' height='280' rx='24' fill='#0f6a60'/>" +
      '</svg>',
  )

const meta: Meta<typeof ImageGallery> = {
  title: 'UI/ImageGallery',
  component: ImageGallery,
  args: {
    images: [
      { id: 1, src: image1 },
      { id: 2, src: image2 },
    ],
    selectedSrc: image1,
    alt: 'Item anunciado',
    ariaLabel: 'Galeria de imagens do anúncio',
    onSelect: () => {},
  },
}

export default meta

type Story = StoryObj<typeof ImageGallery>

export const ComMiniaturas: Story = {}

export const SemImagens: Story = {
  args: {
    images: [],
    selectedSrc: undefined,
    emptyMessage: 'Este anúncio não tem fotos.',
  },
}

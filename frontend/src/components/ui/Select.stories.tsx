import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  args: {
    'aria-label': 'Curso',
    defaultValue: '',
    children: (
      <>
        <option value="" disabled>
          Selecione um curso
        </option>
        <option value="ads">Análise e Desenvolvimento de Sistemas</option>
        <option value="eletro">Eletrotécnica</option>
        <option value="info">Informática</option>
      </>
    ),
  },
}

export default meta

type Story = StoryObj<typeof Select>

export const Padrao: Story = {}

export const ComValor: Story = {
  args: { defaultValue: 'ads' },
}

export const ComErro: Story = {
  args: { invalid: true },
}

export const Desabilitado: Story = {
  args: { disabled: true },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field } from './Field'
import { Input } from './Input'
import { Textarea } from './Textarea'
import { Select } from './Select'

const meta: Meta<typeof Field> = {
  title: 'UI/Field',
  component: Field,
  args: {
    label: 'E-mail institucional',
    children: <Input type="email" placeholder="seu.nome@academico.ifpb.edu.br" />,
  },
}

export default meta

type Story = StoryObj<typeof Field>

export const Padrao: Story = {}

export const Obrigatorio: Story = {
  args: { required: true },
}

export const ComErro: Story = {
  args: {
    required: true,
    error: 'Use um e-mail @academico.ifpb.edu.br.',
    children: <Input type="email" defaultValue="estudante@gmail.com" />,
  },
}

export const ComTextarea: Story = {
  args: {
    label: 'Descrição',
    children: <Textarea placeholder="Descreva o item..." />,
  },
}

export const ComSelect: Story = {
  args: {
    label: 'Curso',
    required: true,
    children: (
      <Select defaultValue="">
        <option value="" disabled>
          Selecione um curso
        </option>
        <option value="ads">Análise e Desenvolvimento de Sistemas</option>
        <option value="info">Informática</option>
      </Select>
    ),
  },
}

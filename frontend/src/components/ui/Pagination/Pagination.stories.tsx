import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
  args: {
    currentPage: 3,
    totalPages: 8,
    pageSize: 10,
    onPageChange: () => {},
    onPageSizeChange: () => {},
  },
}

export default meta

type Story = StoryObj<typeof Pagination>

export const Padrao: Story = {}

export const PrimeiraPagina: Story = {
  args: { currentPage: 1 },
}

export const UltimaPagina: Story = {
  args: { currentPage: 8 },
}

export const PoucasPaginas: Story = {
  args: { currentPage: 2, totalPages: 3 },
}

export const Interativa: Story = {
  render: function ExemploInterativo(args) {
    const [currentPage, setCurrentPage] = useState(args.currentPage)
    const [pageSize, setPageSize] = useState(args.pageSize)
    const totalPages = Math.ceil(80 / pageSize)

    return (
      <Pagination
        {...args}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setCurrentPage(1)
        }}
      />
    )
  },
}

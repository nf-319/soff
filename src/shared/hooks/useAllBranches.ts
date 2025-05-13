import { useGetBranches } from '@/shared/query-hooks'

type ReturnProps = {
  label: string
  value: string
}

export const useAllBranches = (): ReturnProps[] => {
  const { data: branches, isLoading } = useGetBranches()

  if (isLoading || !branches?.results) {
    return []
  }

  return [
    {
      label: 'Barcha filiallar',
      value: ''
    },
    ...branches.results.map(branch => ({
      label: branch.name,
      value: branch.id
    }))
  ]
}

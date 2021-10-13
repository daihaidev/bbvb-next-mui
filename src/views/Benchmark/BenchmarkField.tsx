import React from 'react'
import { Autocomplete, AutocompleteFieldProps } from '@onextech/gvs-kit/core'
import { ListBenchmarksQueryVariables } from '@onextech/btb-api'
import { useListBenchmarks } from '../../graphql/benchmark/queries'
import config from '../../config'

const pk = 'benchmarkID'

interface BenchmarkFieldProps extends AutocompleteFieldProps {
  ListboxProps?: object
}

const BenchmarkField: React.FC<BenchmarkFieldProps> = (props) => {
  const { filter } = props

  const variables: ListBenchmarksQueryVariables = { limit: config.arbitraryQueryLimit }
  if (filter) variables.filter = filter
  const { loading, benchmarks } = useListBenchmarks({ variables })

  const options = benchmarks?.map(({ id, title, ...rest }) => ({ ...rest, [pk]: id, title, id }))

  return <Autocomplete pk={pk} options={options} loading={loading} {...props} />
}

export default BenchmarkField

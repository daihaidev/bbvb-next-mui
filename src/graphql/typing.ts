import { QueryHookOptions } from '@apollo/react-hooks'

export type ID = string

export enum ModelAttributeTypes {
  Binary = 'binary',
  BinarySet = 'binarySet',
  Bool = 'bool',
  List = 'list',
  Map = 'map',
  Number = 'number',
  NumberSet = 'numberSet',
  String = 'string',
  StringSet = 'stringSet',
  Null = '_null',
}

export enum ModelSortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export interface ModelSizeInput {
  ne?: number
  eq?: number
  le?: number
  lt?: number
  ge?: number
  gt?: number
  between?: number[]
}

export interface ModelIDInput {
  ne?: ID
  eq?: ID
  le?: ID
  lt?: ID
  ge?: ID
  gt?: ID
  contains?: ID
  notContains?: ID
  between?: ID[]
  beginsWith?: ID
  attributeExists?: boolean
  attributeType?: ModelAttributeTypes
  size?: ModelSizeInput
}

export interface ModelStringInput {
  ne?: string
  eq?: string
  le?: string
  lt?: string
  ge?: string
  gt?: string
  contains?: string
  notContains?: string
  between?: string[]
  beginsWith?: string
  attributeExists?: boolean
  attributeType?: ModelAttributeTypes
  size?: ModelSizeInput
}

export interface ModelIntInput {
  ne?: number
  eq?: number
  le?: number
  lt?: number
  ge?: number
  gt?: number
  between?: number[]
  attributeExists?: boolean
  attributeType?: ModelAttributeTypes
}

export interface ModelIDKeyConditionInput {
  eq?: ID
  le?: ID
  lt?: ID
  ge?: ID
  gt?: ID
  between?: ID[]
  beginsWith?: ID
}

export interface File {
  path: string
  name: string
  size: number
  type: string
}

export interface ModelFilterInput<T> {
  and?: T[]
  or?: T[]
  not?: T
}

export interface ModelConditionInput<T> {
  and?: T[]
  or?: T[]
  not?: T
}

export interface ListModelVariables<TFilter> {
  filter?: TFilter
  limit?: number
  nextToken?: string
}

// Arguments to pass into useQuery
export type UseQueryArgs<TData, TVariables> = QueryHookOptions<TData, TVariables>

export interface ModelConnectionVariables<TFilter> extends ListModelVariables<TFilter> {
  sortDirection?: ModelSortDirection
}

export interface GetModelVariables {
  id: ID
}

export interface ListModelConnection<T> {
  items: T[]
  nextToken: string
}

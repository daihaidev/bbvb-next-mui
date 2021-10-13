import gql from 'graphql-tag'
import { listCartItems as listCartItemsQuery, ListCartItemsQuery } from '@onextech/etc-api'
import { useAuth } from '../../auth'
import useListCartItems from './queries/useListCartItems'
import { useCreateCartItem, useUpdateCartItem, useDeleteCartItem } from './mutations'
import { DEFAULT_LIMIT } from '../constants'

const listCartItemsQueryAST = gql(listCartItemsQuery)

const useCurrentCart = ({ isMutationOnly = false } = {}) => {
  const { loading, user } = useAuth()

  const listCartItemsVariables = {
    filter: {
      userID: {
        eq: user?.id,
      },
    },
    limit: DEFAULT_LIMIT,
  }

  const onUseListCartItems = useListCartItems({
    variables: listCartItemsVariables,
    skip: loading || !user || isMutationOnly,
    fetchPolicy: 'cache-and-network',
  })

  const { handleCreateCartItem, onCartItemCreated } = useCreateCartItem({
    update: (cache, { data }) => {
      const cartItem = data?.createCartItem
      const queryData = cache.readQuery<ListCartItemsQuery>({
        query: listCartItemsQueryAST,
        variables: listCartItemsVariables,
      })
      const cartItems = queryData?.listCartItems?.items
      const items = cartItems.concat(cartItem)
      cache.writeQuery({
        query: listCartItemsQueryAST,
        variables: listCartItemsVariables,
        data: {
          ...queryData,
          listCartItems: {
            ...queryData?.listCartItems,
            items,
          },
        },
      })
    },
  })

  const { handleUpdateCartItem, onCartItemUpdated } = useUpdateCartItem({
    update: (cache, { data }) => {
      const cartItem = data?.updateCartItem
      const queryData = cache.readQuery<ListCartItemsQuery>({
        query: listCartItemsQueryAST,
        variables: listCartItemsVariables,
      })
      const cartItems = queryData?.listCartItems?.items ?? []
      const items = cartItems.map((item) => (item.id === cartItem.id ? cartItem : item))
      cache.writeQuery({
        query: listCartItemsQueryAST,
        variables: listCartItemsVariables,
        data: {
          ...queryData,
          listCartItems: {
            ...queryData?.listCartItems,
            items,
          },
        },
      })
    },
  })

  const { handleDeleteCartItem, onCartItemDeleted } = useDeleteCartItem({
    update: (cache, { data }) => {
      const cartItem = data?.deleteCartItem
      const queryData = cache.readQuery<ListCartItemsQuery>({
        query: listCartItemsQueryAST,
        variables: listCartItemsVariables,
      })
      const cartItems = queryData?.listCartItems?.items ?? []
      const items = cartItems.filter(({ id }) => id !== cartItem.id)
      cache.writeQuery({
        query: listCartItemsQueryAST,
        variables: listCartItemsVariables,
        data: {
          ...queryData,
          listCartItems: {
            ...queryData?.listCartItems,
            items,
          },
        },
      })
    },
  })

  return {
    ...onUseListCartItems,
    handleCreateCartItem,
    onCartItemCreated,
    handleUpdateCartItem,
    onCartItemUpdated,
    handleDeleteCartItem,
    onCartItemDeleted,
  }
}

export default useCurrentCart

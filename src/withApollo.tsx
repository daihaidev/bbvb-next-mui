import React, { ReactElement } from 'react'
import Head from 'next/head'
import { ApolloProvider, getDataFromTree } from 'react-apollo'
import { ApolloClient, ApolloClientOptions } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { NextPageContext, NextComponentType } from 'next'
import { AppContext } from 'next/app'
import { ApolloLink } from 'apollo-link'
import { createSubscriptionHandshakeLink } from 'aws-appsync-subscription-link'
import { createAuthLink } from 'aws-appsync-auth-link'
import config from './config'

const awsconfig = config.aws

// https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/182
if (!process.browser) {
  // @ts-ignore
  global.fetch = require('isomorphic-unfetch')
}

const apolloConfig = {
  url: awsconfig.aws_appsync_graphqlEndpoint,
  region: awsconfig.aws_appsync_region,
  auth: {
    type: awsconfig.aws_appsync_authenticationType,
    apiKey: awsconfig.aws_appsync_apiKey,
  },
  disableOffline: true,
}

export interface PageComponentWithApolloState<TCache> {
  data?: TCache
}

export interface PageComponentWithApolloProps<TCache = any> {
  apolloState: PageComponentWithApolloState<TCache>
  apolloClient: ApolloClient<TCache>
}

export type ApolloContext = NextPageContext | AppContext

let globalApolloClient: ApolloClient<any> = null

/**
 * Creates and configures the ApolloClient
 */
export const createApolloClient = (initialState = {}, options: Partial<ApolloClientOptions<any>> = {}) => {
  /**
   * How to setup Apollo client instead of AppSync client:
   * @link https://github.com/awslabs/aws-mobile-appsync-sdk-js/issues/448
   * @link https://github.com/wolfeidau/appsync-apollo-links
   */
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // Disables forceFetch on the server (so queries are only run once)
    link: ApolloLink.from([
      // @ts-ignore
      createAuthLink(apolloConfig),
      // @ts-ignore
      createSubscriptionHandshakeLink(apolloConfig),
    ]),
    cache: new InMemoryCache().restore(initialState),
    ...options,
  })
}

/**
 * Always creates a new apollo client on the server
 * Creates or reuses apollo client in the browser.
 */
const initApolloClient = (initialState = {}) => {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return createApolloClient(initialState)
  }

  // Reuse client on the client-side
  if (!globalApolloClient) {
    globalApolloClient = createApolloClient(initialState)
  }

  return globalApolloClient
}

/**
 * Creates and provides the apolloContext
 * to a next.js PageTree. Use it by wrapping
 * your PageComponent via HOC pattern.
 */
export const withApollo = ({ ssr = false } = {}) => (PageComponent: NextComponentType<any>): any => {
  const PageComponentWithApollo = ({
    apolloClient,
    apolloState,
    ...pageProps
  }: PageComponentWithApolloProps): ReactElement => {
    const client = apolloClient || initApolloClient(apolloState)
    return (
      <ApolloProvider client={client}>
        <PageComponent {...pageProps} />
      </ApolloProvider>
    )
  }

  // Set the correct displayName in development
  if (process.env.NODE_ENV !== 'production') {
    const displayName = PageComponent.displayName || PageComponent.name || 'Component'

    if (displayName === 'App') {
      console.warn('This withApollo HOC only works with PageComponents.')
    }

    PageComponentWithApollo.displayName = `withApollo(${displayName})`
  }

  if (ssr || PageComponent.getInitialProps) {
    PageComponentWithApollo.getInitialProps = async (ctx: NextPageContext) => {
      const { AppTree } = ctx

      // Initialize ApolloClient
      const apolloClient = initApolloClient()

      // Run wrapped getInitialProps methods
      let pageProps = {}
      if (PageComponent.getInitialProps) {
        // Add it to the ctx object so we can use it in `PageComponent.getInitialProp`.
        pageProps = await PageComponent.getInitialProps({ ...ctx, apolloClient })
      }

      // Only on the server:
      if (typeof window === 'undefined') {
        // When redirecting, the response is finished.
        // No point in continuing to render
        if (ctx.res && ctx.res.finished) {
          return pageProps
        }

        // Only if ssr is enabled
        if (ssr) {
          try {
            // Run all GraphQL queries
            await getDataFromTree(
              <AppTree
                pageProps={{
                  ...pageProps,
                  apolloClient,
                }}
              />
            )
          } catch (error) {
            // Prevent Apollo Client GraphQL errors from crashing SSR.
            // Handle them in components via the data.error prop:
            // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
            console.error('Error while running `getDataFromTree`', error)
          }

          // getDataFromTree does not call componentWillUnmount
          // head side effect therefore need to be cleared manually
          Head.rewind()
        }
      }

      // Extract query data from the Apollo store
      const apolloState = apolloClient.cache.extract()

      return {
        ...pageProps,
        apolloState,
      }
    }
  }

  return PageComponentWithApollo
}

export default withApollo

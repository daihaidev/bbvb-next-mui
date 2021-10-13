import React from 'react'
import Helmet from 'react-helmet'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'
import config from '../src/config'

// React helmet
// @link https://github.com/zeit/next.js/tree/canary/examples/with-react-helmet
export default class extends Document {
  static async getInitialProps(ctx) {
    // Material UI SSR
    // @link https://antesepic.com/using-material-ui-and-styled-components-with-next-js/
    const sheets = new ServerStyleSheets()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
      })

    const documentProps = await super.getInitialProps(ctx)

    // see https://github.com/nfl/react-helmet#server-usage for more information
    // 'head' was occupied by 'renderPage().head', we cannot use it
    return {
      ...documentProps,
      helmet: Helmet.renderStatic(),
      styles: (
        <>
          {documentProps.styles}
          {sheets.getStyleElement()}
        </>
      ),
    }
  }

  // should render on <html>
  get helmetHtmlAttrComponents() {
    return this.props.helmet.htmlAttributes.toComponent()
  }

  // should render on <body>
  get helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent()
  }

  // should render on <head>
  get helmetHeadComponents() {
    return Object.keys(this.props.helmet)
      .filter((el) => el !== 'htmlAttributes' && el !== 'bodyAttributes')
      .map((el) => this.props.helmet[el].toComponent())
  }

  render() {
    return (
      <html {...this.helmetHtmlAttrComponents}>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&display=swap" rel="stylesheet" />

          {this.helmetHeadComponents}
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
          <title>{config.seo.title}</title>
          <meta name="description" content={config.seo.description} />
          <meta itemProp="name" content={config.seo.title} />
          <meta itemProp="description" content={config.seo.description} />
          <meta itemProp="image" content={config.seo.image} />
          <meta property="og:url" content={config.seo.url} />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={config.seo.title} />
          <meta property="og:description" content={config.seo.description} />
          <meta property="og:image" content={config.seo.image} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={config.seo.title} />
          <meta name="twitter:description" content={config.seo.description} />
          <meta name="twitter:image" content={config.seo.image} />
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

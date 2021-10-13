/* eslint-disable @typescript-eslint/camelcase */
import ReactGA from 'react-ga'
import config from '../config'

export const initGA = () => {
  ReactGA.initialize(config.analytics.ga.trackingId)
}

/**
 * NextJS with Google Analytics example
 * https://github.com/zeit/next.js/tree/canary/examples/with-google-analytics
 */
export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const logEvent = (args) => ReactGA.event(args)

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export default {
  initGA,
  logPageView,
  logEvent,
}

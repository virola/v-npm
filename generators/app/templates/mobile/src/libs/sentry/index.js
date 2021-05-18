import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

export default {
  install(Vue) {
    if (process.env.NODE_ENV === 'production') {
      Sentry.init({
        Vue,
        dsn: 'https://4dbdb2b563674c539b065cee441ede38@o388988.ingest.sentry.io/5226689',
        autoSessionTracking: true,
        integrations: [new Integrations.BrowserTracing()],

        // We recommend adjusting this value in production, or using tracesSampler
        // for finer control
        tracesSampleRate: 1.0
      })
    }
  }
}

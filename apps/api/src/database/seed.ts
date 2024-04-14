import { subscriptionFactory } from './factories/subscription'
import { subscriptionCredentialFactory } from './factories/subscriptionCredential'

(async () => {
  await subscriptionFactory.create()
  await subscriptionCredentialFactory.create()
})().catch(e => { console.error(e) })

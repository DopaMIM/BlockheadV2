import { MetamaskInfo } from "@/components/metamask-info"
import { OutgoingSubscriptions } from "@/components/outgoing-subscriptions"
import { Subscriptions } from "@/components/subscriptions"

export default async function IndexPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <MetamaskInfo classes="absolute top-16 right-0" />
      <div className="mt-24">
        <OutgoingSubscriptions />
        <Subscriptions />
      </div>
    </div>
  )
}

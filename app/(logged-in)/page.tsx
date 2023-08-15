import {OutgoingSubscriptions} from "@/components/outgoing-subscriptions";
import {Subscriptions} from "@/components/subscriptions";

export default async function IndexPage() {
  return (
    <div className="">
      <div className="my-32 container flex h-screen w-screen flex-col items-center justify-center">
        <OutgoingSubscriptions />
        <Subscriptions />
      </div>
    </div>
  )
}

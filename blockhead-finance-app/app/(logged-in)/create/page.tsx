"use client"

import { useEffect } from "react"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import {
  LineaMainChainId,
  LineaTestChainId,
  PolygonChainId,
  SepoliaChainId,
  addressesByNetwork,
} from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEthers } from "@usedapp/core"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { subscriptionSchema } from "@/lib/validations/subscription"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"

type FormData = z.infer<typeof subscriptionSchema>

export default function CreateSubscriptionPage() {
  const { account, chainId } = useEthers()

  const form = useForm<FormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      logoUrl: undefined,
      recipientName: "",
      productName: undefined,
      receiverAddress: "",
      network: (chainId || LineaMainChainId).toString(),
      amount: 0.01,
      token: "usdc",
      frequency: "monthly",
      trial: "none",
    },
  })

  const router = useRouter()

  useEffect(() => {
    if (!account) {
      return
    }
    form.setValue("receiverAddress", account)
  }, [account])

  const supabase = createClientComponentClient()

  async function onSubmit(data: FormData) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data: recurringPaymentTemplate, error } = await supabase
      .from("subscription")
      .insert({
        meta: data,
        user_id: user?.id,
      })
      .select()
      .single()

    if (error) {
      toast({
        title: "Something went wrong.",
        description: "Your request failed. Please try again.",
        variant: "destructive",
      })
      return
    }

    router.push("/pay/" + recurringPaymentTemplate.id)

    // return toast({
    //   title: "👍 Subscription created.",
    //   description: "Click here to copy the link to your clipboard.",
    // })
  }

  return (
    <div className="container flex flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-xl">
        <div className="flex flex-col space-y-2 text-center">
          <div className="flex space-x-2 justify-center">
            <h1 className="mt-8 text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Create a Subscription
            </h1>
          </div>
          <p className="text-lg text-gray-500 sm:text-xl">
            Recurring payments with crypto should be this easy
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (...args) => {
              console.log("INVALID", args)
            })}
            className="grid gap-6"
          >
            <div className="grid gap-6">
              <Avatar className="mx-auto w-24 h-24">
                <AvatarImage src="" />
                <AvatarFallback>
                  <Icons.plus className="w-4 h-4" />
                  Add Logo
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="recipientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Blockhead" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormDescription>Optional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid col-span-2 gap-1">
                <FormField
                  control={form.control}
                  name="receiverAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Receiver Wallet Address</FormLabel>
                      <FormControl>
                        <Input placeholder="0x12345..." {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Network</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={LineaMainChainId.toString()}>
                            {addressesByNetwork[LineaMainChainId]?.name || ""} (
                            {LineaMainChainId})
                          </SelectItem>
                          <SelectItem value={LineaTestChainId.toString()}>
                            {addressesByNetwork[LineaTestChainId]?.name || ""} (
                            {LineaTestChainId})
                          </SelectItem>
                          <SelectItem value={SepoliaChainId.toString()}>
                            {addressesByNetwork[SepoliaChainId]?.name || ""} (
                            {SepoliaChainId})
                          </SelectItem>
                          <SelectItem value={PolygonChainId.toString()}>
                            {addressesByNetwork[PolygonChainId]?.name || ""} (
                            {PolygonChainId})
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-2 col-span-2 grid gap-1">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step={0.01}
                          placeholder=""
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Minimum $3</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-1">
                <FormField
                  control={form.control}
                  name="token"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="usdc">USDC</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-2 col-span-2 grid gap-1">
                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          {/*<SelectItem value="quarterly">Quarterly</SelectItem>*/}
                          <SelectItem value="annual">Annual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 grid gap-1">
                <FormField
                  control={form.control}
                  name="trial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free trial period?</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="day">1 Day</SelectItem>
                          <SelectItem value="week">1 Week</SelectItem>
                          <SelectItem value="month">1 Month</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit">Create subscription</Button>
          </form>
        </Form>
        <p className="pb-16 px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-brand underline underline-offset-4"
          >
            Back to the dashboard
          </Link>
        </p>
      </div>
    </div>
  )
}

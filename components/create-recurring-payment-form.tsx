"use client";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "@/components/ui/use-toast";
import {useRecurringPaymentContract} from "@/lib/use-recurring-payment-contract";
import {utils, Contract, BigNumber} from "ethers";
import {Icons} from "@/components/icons";
import {MetaMaskConnectButton} from "@/components/metamask-connect-button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Badge} from "@/components/ui/badge";
import {Button, buttonVariants} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {
  LEVI_TEST_WALLET_ADDRESS,
  RECURRING_PAYMENT_CONTRACT,
  SepoliaTestNetwork,
  UI_PARTNER_ADDRESS
} from "@/constants";
import {cn, formatAmount, frequencyToSeconds, getTokenAddress, parseAmount} from "@/lib/utils";
import {recurringPaymentsABI} from "@/lib/recurring-payments-abi";
import type {Subscription} from "@/lib/validations/subscription";
import {Polygon, useEthers, useCall, useToken, useTokenAllowance, ERC20Interface, useSigner} from "@usedapp/core";
import Link from "next/link";
import {useState} from "react";

function MetamaskInfo() {
  const {account, chainId} = useEthers()
  return (
    <Card className="absolute top-0 right-0 m-4">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium grow">
      <MetaMaskConnectButton />
      <div className="flex items-center space-x-1">
        <span className={`rounded-full h-2 w-2 ${account ? 'bg-green-600' : 'bg-red-600'}`}></span><span>{account ? '' : 'Not '}Connected</span>
      </div>
    </CardTitle>
  </CardHeader>
  <CardContent>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="text-2xl font-bold">{chainId || ''}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chain ID</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <p className="text-xs text-muted-foreground">
      {account || 'Not connected'}
    </p>
  </CardContent>
</Card>
  )
}

interface ICreateRecurringPaymentForm {
  subscription: Subscription
}
export default function CreateRecurringPaymentForm({subscription}: ICreateRecurringPaymentForm) {
  const {account, chainId, error, switchNetwork} = useEthers()
  const signer = useSigner()
  const [loading, setLoading] = useState(false)
  const subscriptionChainId = parseInt(subscription.meta.network)
  
  console.log('Metamask account, error, chainId', account, error, chainId)
  if (subscriptionChainId !== chainId || error?.name === 'ChainIdError') {
    switchNetwork(subscriptionChainId)
  }
  
  const subscriptionTokenAddress = getTokenAddress(subscription.meta.token)
  const amountInWei = parseAmount(subscription.meta.amount, subscriptionTokenAddress)
  console.log('amountInWei', amountInWei.toString())
  
  const recurringPaymentContract = useRecurringPaymentContract()
  console.log('recurringPaymentContract', recurringPaymentContract)
  
  console.log('subscription', subscription, frequencyToSeconds(subscription.meta.frequency))
  const subscriptionToken = new Contract(subscriptionTokenAddress, ERC20Interface, signer)
  
  // check allowance for this subscription's token
  const allowance = useTokenAllowance(subscriptionTokenAddress, account, RECURRING_PAYMENT_CONTRACT)
  const hasAllowance = BigNumber.isBigNumber(allowance) && allowance.gt(0)
  console.log('allowance, hasAllowance', allowance, hasAllowance)
  
  // if less than the subscription amount, show a message to approve the token
  async function approveToken() {
    setLoading(true)
    if (subscriptionToken) {
      await subscriptionToken.approve(RECURRING_PAYMENT_CONTRACT, parseAmount('10000000', subscriptionTokenAddress))
    }
    setLoading(false)
  }
  
  async function approveSubscription() {
    setLoading(true)
    if (!subscriptionToken || !recurringPaymentContract) {
      return
      setLoading(false)
    }
    
    const functionArgs = [
      subscription.meta.receiverAddress,
      amountInWei,
      subscriptionTokenAddress,
      frequencyToSeconds(subscription.meta.frequency),
      UI_PARTNER_ADDRESS,
      [`subscriptionId:${subscription.id}`],
      frequencyToSeconds(subscription.meta.trial),
    ]
    
    const gasLimit = await recurringPaymentContract.estimateGas.createRecurringPayment(...functionArgs)
    //@ts-ignore
    const {value, error} = await recurringPaymentContract.createRecurringPayment(
      ...functionArgs,
      // overrides
      {gasLimit}
    )
    
    if (error) {
      console.error(error.message)
      return toast({
        title: "Something went wrong.",
        description: "Your create recurring payment request failed. Please try again.",
        variant: "destructive",
      })
    }
    setLoading(false)
    return toast({
      title: "Success!",
      description: "You created a recurring payment.",
    })
  }
  
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <MetamaskInfo />
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 max-w-2xl">
        <div className="flex flex-col space-y-8 text-center">
          <div>
          <div className="flex space-x-2 justify-center">
            <h1 className="mt-16 text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              {subscription.meta.recipientName}
            </h1>
          </div>
          <p className="text-lg text-gray-500 sm:text-xl">
            {subscription.meta.productName}
          </p>
          </div>
          <div className="grid w-full items-start gap-6 rounded-lg border p-6">
            <div className="grid gap-6">
              <h3 className="text-xl font-bold sm:text-2xl">
                Setup recurring payment?
              </h3>
              <ul className="grid gap-3 text-sm text-muted-foreground grid-cols-1">
                <li className="flex flex-col sm:flex-row space-x-2">
                  <span className="flex items-center shrink-0">
                    <Icons.logo className="mr-2 h-4 w-4" /> Verify the receiver address
                  </span>
                  <span className="">
                    <Badge variant="secondary">{subscription.meta.receiverAddress}</Badge>
                  </span>
                </li>
                <li className="flex items-center">
                  <Icons.logo className="mr-2 h-4 w-4" /> You can cancel at any time from your dashboard.
                </li>
              </ul>
            </div>
            <div className="flex flex-col gap-4 text-center">
              <div>
                <h4 className="text-7xl font-bold">${subscription.meta.amount}</h4>
                <p className="text-sm font-medium text-muted-foreground">
                  {subscription.meta.token.toLocaleUpperCase()} billed {subscription.meta.frequency}
                </p>
                <div className="flex items-center justify-center space-x-1 text-sm font-medium text-muted-foreground">
                  <Icons.link className="h-3 w-3" /><span>{subscription.meta.network}</span>
                </div>
                {subscription.meta?.trial !== 'none' && (
                  <p className="text-sm font-medium text-muted-foreground">
                    *first {subscription.meta?.trial} is free!
                  </p>
                )}
              </div>
            </div>
          </div>
          {!hasAllowance ? (
            <Button variant="secondary" disabled={!account} onClick={() => approveToken()}>Approve {subscription.meta.token.toLocaleUpperCase()}</Button>
          ) : (
            <Button type="submit" disabled={!account} onClick={() => approveSubscription()}>Subscribe</Button>
          )}
          <p className="pb-16 px-8 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand underline underline-offset-4">
              Back to blockhead
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
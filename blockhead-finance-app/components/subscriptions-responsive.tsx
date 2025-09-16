// components/subscriptions-responsive.tsx
import Link from "next/link"
import { formatUnits } from "@ethersproject/units"

type Row = {
  id: string
  counterparty: string // recipient or sender
  tokenAddress: string
  tokenSymbol: string
  decimals: number
  amount: string | number // in smallest units or human, see below
  frequency: string
  status: "active" | "paused" | "canceled"
}

export function SubscriptionsResponsive({
  rows, title, smallestUnit = true
}: { rows: Row[]; title: string; smallestUnit?: boolean }) {
  return (
    <section className="w-full">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>

      {/* Mobile: cards */}
      <ul className="space-y-3 md:hidden">
        {rows.map((r) => {
          const amt = smallestUnit
            ? formatUnits(String(r.amount), r.decimals)
            : String(r.amount)

          return (
            <li key={r.id} className="rounded-2xl border p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm text-muted-foreground">Counterparty</p>
                  <p className="truncate font-medium">{r.counterparty}</p>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize">
                  {r.status}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-medium">{amt} {r.tokenSymbol}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Frequency</p>
                  <p className="font-medium">{r.frequency}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-muted-foreground">Token</p>
                  <Link
                    href={`https://basescan.org/token/${r.tokenAddress}`}
                    className="truncate text-sm underline underline-offset-4"
                    title={r.tokenAddress}
                  >
                    {r.tokenAddress}
                  </Link>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      {/* Desktop: classic table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Counterparty</th>
              <th className="px-4 py-3 font-medium">Token</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Frequency</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const amt = smallestUnit
                ? formatUnits(String(r.amount), r.decimals)
                : String(r.amount)
              return (
                <tr key={r.id} className="odd:bg-white even:bg-muted/10">
                  <td className="px-4 py-3">{r.counterparty}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`https://basescan.org/token/${r.tokenAddress}`}
                      className="truncate underline underline-offset-4"
                      title={r.tokenAddress}
                    >
                      {r.tokenSymbol}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{amt} {r.tokenSymbol}</td>
                  <td className="px-4 py-3">{r.frequency}</td>
                  <td className="px-4 py-3 capitalize">{r.status}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

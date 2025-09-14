// src/config/lib/detect-wallets.ts

export type InjectedWallet = {
  key: string
  label: string
  provider: any
  info?: { uuid?: string; name?: string; icon?: string; rdns?: string }
}

// ✅ allow the common EVM-injected wallets (add org.uniswap)
const ALLOWED = [
  "io.metamask",
  "org.uniswap",           // ← Uniswap Wallet
  "com.coinbase.wallet",
  "app.rabby.io",
  "com.okex.wallet",
  "com.okx.wallet",
  "com.brave.wallet",
  "app.phantom",
]

// map RDNS (or provider flags) → friendly label
function labelFor(provider: any, rdns?: string): string {
  const n = (rdns || "").toLowerCase()
  if (n.includes("io.metamask")) return "MetaMask"
  if (n.includes("org.uniswap")) return "Uniswap Wallet" // ← added
  if (n.includes("com.coinbase.wallet")) return "Coinbase Wallet"
  if (n.includes("app.rabby.io")) return "Rabby"
  if (n.includes("com.okx.wallet") || n.includes("com.okex.wallet")) return "OKX Wallet"
  if (n.includes("com.brave.wallet")) return "Brave Wallet"
  if (n.includes("app.phantom")) return "Phantom"

  if (provider?.isMetaMask) return "MetaMask"
  if (provider?.isCoinbaseWallet) return "Coinbase Wallet"
  if ((provider?.name || "").toLowerCase().includes("uniswap")) return "Uniswap Wallet" // fallback
  if ((provider?.name || "").toLowerCase().includes("rabby")) return "Rabby"
  if (provider?.isOkxWallet || provider?.isOKExWallet) return "OKX Wallet"
  if ((provider?.name || "").toLowerCase().includes("brave")) return "Brave Wallet"
  if ((provider?.name || "").toLowerCase().includes("phantom")) return "Phantom"

  return provider?.name || "Injected"
}

function isEip1193(p: any): boolean {
  return !!p && typeof p.request === "function" && typeof p.on === "function"
}

function isAllowed(info: any, provider: any): boolean {
  const rdns = (info?.rdns || "").toLowerCase()
  const label = labelFor(provider, rdns).toLowerCase()
  const allowedByRdns = ALLOWED.some((k) => rdns.includes(k))
  const allowedByLabel = ["metamask", "uniswap", "coinbase", "rabby", "okx", "brave", "phantom"]
    .some((k) => label.includes(k))
  return isEip1193(provider) && (allowedByRdns || allowedByLabel)
}

export function initEip6963Listener() {
  if (typeof window === "undefined") return
  // @ts-ignore
  if (!(window as any).__eip6963) (window as any).__eip6963 = []
  window.addEventListener("eip6963:announceProvider" as any, (event: any) => {
    const detail = event?.detail
    if (!detail?.provider) return
    // @ts-ignore
    const list = (window as any).__eip6963 as any[]
    const rdns = (detail?.info?.rdns || "").toLowerCase()
    if (
      (rdns && list.some((e) => (e?.info?.rdns || "").toLowerCase() === rdns)) ||
      (detail?.info?.uuid && list.some((e) => e?.info?.uuid === detail.info.uuid))
    ) {
      return
    }
    list.push(detail)
  })
  try {
    const ev = new CustomEvent("eip6963:requestProvider")
    window.dispatchEvent(ev)
  } catch {}
}

export function getInjectedWallets(): InjectedWallet[] {
  if (typeof window === "undefined") return []
  const out: InjectedWallet[] = []
  const seen = new Set<string>()

  // EIP-6963
  // @ts-ignore
  const announced = (window as any).__eip6963 || []
  for (const entry of announced) {
    const prov = entry?.provider
    const info = entry?.info
    if (!prov) continue
    if (!isAllowed(info, prov)) continue
    const rdns = (info?.rdns || "").toLowerCase()
    const key = (rdns || labelFor(prov)).toLowerCase().replace(/\s+/g, "-")
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ key, label: labelFor(prov, rdns), provider: prov, info })
  }

  // legacy fallback
  // @ts-ignore
  const eth = (window as any).ethereum
  if (eth) {
    const providers: any[] = Array.isArray(eth.providers) ? eth.providers : [eth]
    for (const p of providers) {
      if (!isAllowed(undefined, p)) continue
      const label = labelFor(p)
      const key = label.toLowerCase().replace(/\s+/g, "-")
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ key, label, provider: p })
    }
  }

  // sort for nice UX (MetaMask, Uniswap, Coinbase, Rabby, OKX, Brave, Phantom, …)
  const order = ["metamask", "uniswap wallet", "coinbase", "rabby", "okx", "brave", "phantom"]
  out.sort((a, b) => {
    const ia = order.findIndex((k) => a.label.toLowerCase().includes(k))
    const ib = order.findIndex((k) => b.label.toLowerCase().includes(k))
    const A = ia === -1 ? 999 : ia
    const B = ib === -1 ? 999 : ib
    if (A !== B) return A - B
    return a.label.localeCompare(b.label)
  })

  return out
}

export function selectInjectedProvider(provider: any) {
  if (typeof window === "undefined" || !provider) return
  try {
    if (provider?.setSelectedProvider) provider.setSelectedProvider(provider)
    // @ts-ignore
    window.ethereum = provider
  } catch {}
}

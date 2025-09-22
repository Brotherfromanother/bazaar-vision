export type AuctionRow = {
  id: number
  character: string
  level: number
  vocation: string
  bid: number
  endTime: string // ISO
  status: 'sold' | 'unsold'
  bidders?: number
}

const fromHistoryServer = async (): Promise<AuctionRow[]> => {
  const base = process.env.NEXT_PUBLIC_HISTORY_SERVER_URL
  const res = await fetch(`${base}/auctions/recent`)
  if (!res.ok) throw new Error('History server error')
  return res.json()
}

const fromTibiaData = async (): Promise<AuctionRow[]> => {
  const base = process.env.NEXT_PUBLIC_TIBIADATA_URL ?? 'https://api.tibiadata.com/v3'
  const res = await fetch(`${base}/bazaar/auctions`)
  const json = await res.json()
  const auctions = json?.bazaar?.auctions ?? []
  return auctions.map((a: any, i: number) => ({
    id: a.auctionid ?? i,
    character: a.name,
    level: a.level,
    vocation: a.vocation,
    bid: a.currentbid ?? a.minimumbid ?? 0,
    endTime: a.enddate ? new Date(a.enddate * 1000).toISOString() : new Date().toISOString(),
    status: a.ended ? 'sold' : 'unsold',
    bidders: a.bidders ?? undefined
  }))
}

export async function getAuctions(): Promise<AuctionRow[]> {
  const source = process.env.NEXT_PUBLIC_DATA_SOURCE || 'tibiadata'
  if (source === 'tibiadata') return fromTibiaData()
  return fromHistoryServer()
}

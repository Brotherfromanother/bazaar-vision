import Head from 'next/head'
import AuctionCharts from '../../components/AuctionCharts'

async function loadAuction(id: string){
  const base = process.env.NEXT_PUBLIC_HISTORY_SERVER_URL
  try{
    const res = await fetch(`${base}/auctions/${id}`)
    if (!res.ok) throw new Error('not ok')
    return await res.json()
  } catch {
    return {
      id,
      character: 'Unknown',
      level: 100,
      vocation: 'knight',
      priceSeries: [
        { time: 'Start', price: 100000 },
        { time: 'Mid', price: 150000 },
        { time: 'End', price: 220000 },
      ],
      biddersSeries: [
        { time: 'Start', count: 2 },
        { time: 'End', count: 5 },
      ]
    }
  }
}

export async function getServerSideProps({ params }: any){
  const data = await loadAuction(params.id as string)
  return { props: { data } }
}

export default function AuctionDetail({ data }: any){
  return (
    <>
      <Head><title>{data.character} – aukcja</title></Head>
      <main className="min-h-screen p-4 md:p-6 lg:p-8 space-y-4">
        <div className="card p-4">
          <h1 className="text-xl font-bold mb-1">{data.character}</h1>
          <p className="text-muted">Lvl {data.level} • {data.vocation}</p>
        </div>
        <AuctionCharts priceSeries={data.priceSeries} biddersSeries={data.biddersSeries} />
      </main>
    </>
  )
}

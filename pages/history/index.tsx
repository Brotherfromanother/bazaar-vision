import Head from 'next/head'
import ThemeToggle from '../../components/ThemeToggle'
import AuctionHistoryTable from '../../components/AuctionHistoryTable'
import { getAuctions } from '../../lib/dataSource'

export async function getServerSideProps(){
  try {
    const rows = await getAuctions()
    return { props: { rows } }
  } catch (e){
    return { props: { rows: [] } }
  }
}

export default function HistoryPage({ rows }: { rows: any[] }){
  return (
    <>
      <Head><title>Auction History</title></Head>
      <main className="min-h-screen p-4 md:p-6 lg:p-8 space-y-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Historia aukcji</h1>
          <ThemeToggle />
        </header>
        <section className="grid gap-4">
          <AuctionHistoryTable rows={rows as any} />
        </section>
      </main>
    </>
  )
}

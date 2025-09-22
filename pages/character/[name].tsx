import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { addLog, loadDataset } from '../../lib/altDetection'
import { useEffect } from 'react'

type Char = { name: string; world?: string; vocation?: string; level?: number; last_login?: string, source?: string }

export const getServerSideProps: GetServerSideProps = async ({ params, req }) => {
  const name = decodeURIComponent(String(params?.name||''))
  try{
    const base = process.env.NEXT_PUBLIC_BASE_URL || ''
    const r = await fetch(`${base}/api/character?name=${encodeURIComponent(name)}`, { headers: { cookie: req.headers.cookie||'' } })
    const data = await r.json()
    return { props: { data } }
  }catch{
    return { props: { data: { name } } }
  }
}

export default function CharacterPage({ data }: { data: Char }){
  useEffect(()=>{
    if (data?.name && data?.last_login){
      const iso = new Date(data.last_login).toISOString()
      addLog({ name: data.name, lastLoginISO: iso, world: data.world })
    }
  }, [data])

  return (
    <>
      <Head><title>{data?.name} – postać</title></Head>
      <div className="card p-4 space-y-2">
        <div className="text-xl font-bold">{data?.name || 'Postać'}</div>
        <div className="text-muted">Świat: {data.world||'—'} • {data.vocation||'—'} • Lvl {data.level||'—'}</div>
        <div>Ostatnie logowanie: <b>{data.last_login || '—'}</b> <span className="text-muted">({data.source||'—'})</span></div>
        <p className="text-sm text-muted">Każde wejście na tę stronę zapisuje log do „Alt Radar”.</p>
        <a className="button" href="/alts">Zobacz Alt Radar</a>
      </div>
    </>
  )
}

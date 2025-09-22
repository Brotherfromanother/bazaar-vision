'use client'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Sidebar(){
  const r = useRouter()
  const [q, setQ] = useState('')
  return (
    <aside className="sticky top-0 h-[100dvh] p-4 pr-2 border-r border-border hidden md:block w-72">
      <div className="mb-4 text-sm text-muted">Menu</div>
      <nav className="grid gap-2">
        <a className="button" href="/history">Historia aukcji</a>
        <a className="button" href="/alts">Alt Radar</a>
      </nav>
      <div className="mt-6">
        <div className="text-sm text-muted mb-2">Szukaj postaci</div>
        <form onSubmit={e=>{e.preventDefault(); if(q.trim()) r.push('/character/'+encodeURIComponent(q.trim()))}} className="flex gap-2">
          <input className="input flex-1" placeholder="np. Knight Sample" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="button">Szukaj</button>
        </form>
        <p className="text-xs text-muted mt-2">Pobiera dane z tibia.com / TibiaData.</p>
      </div>
    </aside>
  )
}

'use client'
import { useEffect, useMemo, useState } from 'react'
import type { AuctionRow } from '../lib/dataSource'
import { ArrowUpDown } from 'lucide-react'

function formatGold(n: number) { return n.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' gp' }

function SortButton({label, active, dir}:{label:string, active:boolean, dir:'asc'|'desc'}){
  return (
    <span className={`inline-flex items-center gap-1 ${active? 'text-accent' : 'text-muted'}`}>
      {label}
      <ArrowUpDown size={14} className={active? '' : 'opacity-50'}/>
      <span className="sr-only">sort</span>
    </span>
  )
}

export default function AuctionHistoryTable({ rows }: { rows: AuctionRow[] }) {
  const [query, setQuery] = useState('')
  const [voc, setVoc] = useState('all')
  const [sortKey, setSortKey] = useState<keyof AuctionRow>('endTime')
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc')
  const [page, setPage] = useState(1)
  const pageSize = 25

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter(r => (
      (!q || r.character.toLowerCase().includes(q)) &&
      (voc==='all' || r.vocation.toLowerCase()===voc)
    ))
  }, [rows, query, voc])

  const sorted = useMemo(() => {
    const copy = [...filtered]
    copy.sort((a,b)=>{
      const dir = sortDir === 'asc' ? 1 : -1
      const av = (a as any)[sortKey]
      const bv = (b as any)[sortKey]
      if (av < bv) return -1*dir
      if (av > bv) return 1*dir
      return 0
    })
    return copy
  }, [filtered, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const pageRows = sorted.slice((page-1)*pageSize, page*pageSize)
  useEffect(()=>{ setPage(1) }, [query, voc])

  function toggleSort(k: keyof AuctionRow){
    if (k===sortKey) setSortDir(sortDir==='asc'?'desc':'asc')
    else { setSortKey(k); setSortDir('asc') }
  }

  return (
    <div className="card p-4">
      <div className="flex flex-wrap gap-2 items-center justify-between mb-3">
        <input className="input w-64" placeholder="Szukaj postaci..." value={query} onChange={e=>setQuery(e.target.value)} />
        <div className="flex items-center gap-2">
          <select className="select" value={voc} onChange={e=>setVoc(e.target.value)}>
            <option value="all">Wszystkie voc</option>
            <option value="knight">Knight</option>
            <option value="paladin">Paladin</option>
            <option value="sorcerer">Sorcerer</option>
            <option value="druid">Druid</option>
          </select>
          <span className="badge">{sorted.length} wyników</span>
        </div>
      </div>

      <div className="overflow-auto max-h-[70vh] rounded-2xl border border-border">
        <table className="table-base">
          <thead>
            <tr>
              <th onClick={()=>toggleSort('character')}><SortButton label="Postać" active={sortKey==='character'} dir={sortDir}/></th>
              <th onClick={()=>toggleSort('level')}><SortButton label="Poziom" active={sortKey==='level'} dir={sortDir}/></th>
              <th onClick={()=>toggleSort('vocation')}><SortButton label="Vocation" active={sortKey==='vocation'} dir={sortDir}/></th>
              <th onClick={()=>toggleSort('bid')}><SortButton label="Bid" active={sortKey==='bid'} dir={sortDir}/></th>
              <th onClick={()=>toggleSort('endTime')}><SortButton label="Koniec" active={sortKey==='endTime'} dir={sortDir}/></th>
              <th onClick={()=>toggleSort('status')}><SortButton label="Status" active={sortKey==='status'} dir={sortDir}/></th>
              <th onClick={()=>toggleSort('bidders')}><SortButton label="Licytacje" active={sortKey==='bidders'} dir={sortDir}/></th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map(r=> (
              <tr key={r.id} className="hover:bg-surface2">
                <td><a className="link" href={`/history/${r.id}`}>{r.character}</a></td>
                <td>{r.level}</td>
                <td className="capitalize">{r.vocation}</td>
                <td>{formatGold(r.bid)}</td>
                <td>{new Date(r.endTime).toLocaleString()}</td>
                <td><span className={`badge ${r.status==='sold'?'text-positive':'text-negative'}`}>{r.status}</span></td>
                <td>{r.bidders ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3">
        <button className="button" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Poprzednia</button>
        <div className="text-muted">Strona {page}/{totalPages}</div>
        <button className="button" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Następna</button>
      </div>
    </div>
  )
}

'use client'
import { inferAltEdges, clustersFromEdges, loadDataset } from '../lib/altDetection'
import { useMemo, useState } from 'react'

export default function Alts(){
  const [windowMin, setWindowMin] = useState(30)
  const ds = loadDataset()
  const edges = useMemo(()=> inferAltEdges(ds, windowMin), [JSON.stringify(ds), windowMin])
  const clusters = useMemo(()=> clustersFromEdges(edges), [edges])

  return (
    <div className="grid gap-4">
      <div className="card p-4">
        <h2 className="text-lg font-bold mb-2">Alt Radar (beta)</h2>
        <p className="text-muted text-sm">Algorytm: jeśli dwie postacie logują w podobnym czasie (±{windowMin} min) w co najmniej <b>2 różnych dniach</b>, łączymy je krawędzią. Grupujemy krawędzie w klastry.</p>
        <div className="mt-3 flex items-center gap-3">
          <label className="text-sm">Okno czasowe (min):</label>
          <input className="input w-24" type="number" value={windowMin} onChange={e=>setWindowMin(parseInt(e.target.value||'30',10))} />
          <span className="badge">Logów: {ds.logs.length}</span>
          <a className="button" href="/history">Dodaj więcej danych</a>
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-2">Grupy altów</h3>
        {clusters.length === 0 && <div className="text-muted">Brak wykrytych grup. Odwiedź kilka profili postaci, aby zebrać logi.</div>}
        <div className="grid gap-3">
          {clusters.map((g, i)=> (
            <div key={i} className="p-3 rounded-xl border border-border bg-surface2">
              <div className="font-semibold mb-1">Grupa {i+1}</div>
              <div className="text-sm">{g.join(' • ')}</div>
              <div className="text-xs text-muted mt-1">Siła połączeń (dni wspólnych logowań): {edges.filter(e=> g.includes(e.a) && g.includes(e.b)).map(e=> e.score).join(', ') || '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

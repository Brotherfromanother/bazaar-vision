export type CharLog = { name: string; lastLoginISO: string; world?: string }
export type Dataset = { logs: CharLog[] }

const STORAGE_KEY = 'bv_charlogs_v1'

export function loadDataset(): Dataset {
  if (typeof window === 'undefined') return { logs: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { logs: [] }
    const parsed = JSON.parse(raw)
    if (!parsed.logs) return { logs: [] }
    return parsed
  } catch { return { logs: [] } }
}

export function addLog(log: CharLog){
  if (typeof window === 'undefined') return
  const ds = loadDataset()
  ds.logs.push(log)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ds))
}

export function clearDataset(){
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

// Group logs by character
function groupByChar(ds: Dataset): Record<string, CharLog[]> {
  const map: Record<string, CharLog[]> = {}
  for (const l of ds.logs){
    const key = l.name.toLowerCase()
    if (!map[key]) map[key] = []
    map[key].push(l)
  }
  for (const k in map){
    map[k].sort((a,b)=> new Date(a.lastLoginISO).getTime() - new Date(b.lastLoginISO).getTime())
  }
  return map
}

/** Return edges between chars that often log around the same time (windowMinutes) across distinct days */
export function inferAltEdges(ds: Dataset, windowMinutes = 30){
  const byChar = groupByChar(ds)
  const names = Object.keys(byChar)
  const edges: { a: string; b: string; score: number; days: string[] }[] = []
  function dayKey(d: Date){ return d.toISOString().slice(0,10) }
  for (let i=0;i<names.length;i++){
    for (let j=i+1;j<names.length;j++){
      const A = byChar[names[i]]
      const B = byChar[names[j]]
      const daysSeen = new Set<string>()
      for (const la of A){
        const ta = new Date(la.lastLoginISO).getTime()
        for (const lb of B){
          const tb = new Date(lb.lastLoginISO).getTime()
          const diff = Math.abs(ta - tb) / 60000
          if (diff <= windowMinutes){
            const dk = dayKey(new Date(la.lastLoginISO))
            daysSeen.add(dk)
          }
        }
      }
      if (daysSeen.size >= 2){ // at least 2 dni korelacji
        edges.push({ a: names[i], b: names[j], score: daysSeen.size, days: Array.from(daysSeen) })
      }
    }
  }
  return edges.sort((x,y)=> y.score - x.score)
}

export function clustersFromEdges(edges: {a:string;b:string;score:number}[]){
  // Union-find
  const parent: Record<string,string> = {}
  function find(x:string){ if(parent[x]!==x) parent[x]=find(parent[x]); return parent[x] }
  function uni(x:string,y:string){ const rx=find(x), ry=find(y); if(rx!==ry) parent[ry]=rx }
  const nodes = new Set<string>()
  edges.forEach(e=>{ nodes.add(e.a); nodes.add(e.b) })
  nodes.forEach(n=> parent[n]=n)
  edges.forEach(e=> uni(e.a,e.b))
  const groups: Record<string,string[]> = {}
  nodes.forEach(n=>{ const r=find(n); (groups[r]=groups[r]||[]).push(n) })
  return Object.values(groups).filter(g=>g.length>1)
}

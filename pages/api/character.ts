import type { NextApiRequest, NextApiResponse } from 'next'
import * as cheerio from 'cheerio'

async function fetchTibiaData(name: string){
  try{
    const url = `https://api.tibiadata.com/v4/character/${encodeURIComponent(name)}.json`
    const res = await fetch(url, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error('td fail')
    const json = await res.json()
    const c = json?.characters?.data || json?.characters?.character || json?.character
    if (!c) throw new Error('no char')
    const lastLogin = c.last_login || c.lastLogin || c?.login?.last || null
    return {
      source: 'tibiadata',
      name: c.name || name,
      world: c.world,
      vocation: c.vocation,
      level: c.level,
      last_login: lastLogin
    }
  } catch(e){
    return null
  }
}

async function scrapeTibia(name: string){
  const url = `https://www.tibia.com/community/?name=${encodeURIComponent(name)}`
  const res = await fetch(url, {
    headers: { 'user-agent': 'Mozilla/5.0 BazaarVision/1.0; +https://example.com' }
  })
  if (!res.ok) throw new Error('scrape fail')
  const html = await res.text()
  const $ = cheerio.load(html)
  const infoRows = $('table.Table3 table.TableContent tr')
  let world = '', vocation = '', level = 0, lastLogin = ''
  infoRows.each((_, tr)=>{
    const th = $(tr).find('td.LabelV').text().trim()
    const td = $(tr).find('td:nth-child(2)').text().trim()
    if (/World/i.test(th)) world = td
    if (/Vocation/i.test(th)) vocation = td
    if (/Level/i.test(th)) level = parseInt(td,10) || level
    if (/Last Login/i.test(th)) lastLogin = td
  })
  return { source: 'tibia.com', name, world, vocation, level, last_login: lastLogin }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  const name = (req.query.name as string || '').trim()
  if (!name) return res.status(400).json({ error: 'Missing name' })
  const td = await fetchTibiaData(name)
  if (td) return res.status(200).json(td)
  try {
    const sc = await scrapeTibia(name)
    return res.status(200).json(sc)
  } catch(e){
    return res.status(502).json({ error: 'Failed to fetch character' })
  }
}

import Sidebar from './Sidebar'
import Banner from './Banner'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }){
  return (
    <div className="min-h-screen grid md:grid-cols-[18rem_1fr] gap-0">
      <Sidebar />
      <div className="p-3 md:p-6">
        <Banner />
        {children}
      </div>
    </div>
  )
}

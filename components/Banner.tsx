export default function Banner(){
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border mb-4">
      <div className="absolute inset-0 opacity-40" style={{background: 'radial-gradient(1000px 400px at 10% 0%, #f6c45344, transparent), radial-gradient(800px 300px at 90% 0%, #66ccff33, transparent)'}}/>
      <div className="relative p-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Bazaar Vision</h1>
          <p className="text-muted">Podgląd aukcji, wyszukiwarka postaci i wykrywanie altów</p>
        </div>
        <img className="h-10 opacity-90" src="/brand/logo.svg" alt="logo"/>
      </div>
    </div>
  )
}

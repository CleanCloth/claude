export default function ExtraServicesPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-[#2c2c2c] text-white p-8">
      <button onClick={() => onNavigate('home')} className="text-[#3CACAE] mb-4">&larr; Tilbage</button>
      <h1 className="text-3xl font-bold mb-4">Ekstra Tilvalg</h1>
      <p className="text-white/70">Tilføj ekstra services til din rengøring.</p>
    </div>
  );
}

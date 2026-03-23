export default function BookPrivateCleaningPage({ onNavigate, initialPostalCode, initialPropertySize }: { onNavigate: (page: string) => void; initialPostalCode?: string; initialPropertySize?: string }) {
  return (
    <div className="min-h-screen bg-[#2c2c2c] text-white p-8">
      <button onClick={() => onNavigate('home')} className="text-[#3CACAE] mb-4">&larr; Tilbage</button>
      <h1 className="text-3xl font-bold mb-4">Book Privat Rengøring</h1>
      <p className="text-white/70">Få et tilbud på privat rengøring.</p>
      {initialPostalCode && <p className="text-white/50 mt-2">Postnummer: {initialPostalCode}</p>}
      {initialPropertySize && <p className="text-white/50">Størrelse: {initialPropertySize} m²</p>}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';

// Tryg logo - replace with actual path if you have the asset locally
const trygLogo = 'https://cleancloth.dk/wp-content/uploads/2025/08/tryg-logo.png';

const ZONE_MAP: Record<string, number> = {
  '8000': 0, '8230': 0,
  '8200': 1, '8210': 1, '8220': 1,
  '8240': 2, '8250': 2,
  '8260': 3, '8270': 3, '8310': 3, '8320': 3, '8330': 3,
  '8361': 4, '8362': 4, '8370': 4, '8380': 4, '8381': 4,
  '8382': 4, '8410': 4, '8471': 4, '8520': 4, '8541': 4,
  '8543': 4, '8600': 4, '8660': 4, '8670': 4, '8680': 4
};

export default function App() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [postalCode, setPostalCode] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [validZone, setValidZone] = useState(false);

  // Collapsible menu states
  const [privateMenuOpen, setPrivateMenuOpen] = useState(false);
  const [commercialMenuOpen, setCommercialMenuOpen] = useState(false);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [extraMenuOpen, setExtraMenuOpen] = useState(false);

  const navigateTo = (path: string) => {
    const routeMap: Record<string, string> = {
      'home': '/',
      'private-cleaning': '/private-cleaning',
      'flytterengoring': '/flytterengoring',
      'book-flytterengoring': '/book-flytterengoring',
      'erhverv': '/erhverv',
      'book-private': '/book-private',
      'extra-services': '/extra-services',
      'faq': '/faq',
      'service-included': '/service-included',
      'pricing': '/pricing',
      'how-it-works': '/how-it-works',
      'booking-hub': '/booking-hub',
    };
    const url = routeMap[path] || '/';
    navigate(url);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const validateForm = () => {
    const hasValidLength = postalCode.length === 4;
    const hasSize = propertySize && parseInt(propertySize) > 0;
    const isInZone = ZONE_MAP[postalCode] !== undefined;

    if (hasValidLength && hasSize) {
      if (isInZone) {
        setValidZone(true);
        return true;
      } else {
        setValidZone(false);
        return false;
      }
    } else {
      setValidZone(false);
      return false;
    }
  };

  const handlePostalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setPostalCode(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      navigateTo('book-private');
    }
  };

  useEffect(() => {
    validateForm();
  }, [postalCode, propertySize]);

  // Home page
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#2c2c2c]">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-80"
        >
          <source
            src="https://cleancloth.dk/wp-content/uploads/2025/08/cleancloth-broll-privat.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-black/35"></div>
      </div>

      {/* Navigation */}
      <div className="relative z-10">
        <div className="absolute top-4 left-4">
          <button onClick={() => navigateTo('home')} className="bg-white/15 backdrop-blur-xl rounded-lg p-3 shadow-lg">
            <img
              src="https://cleancloth.dk/wp-content/uploads/2025/08/cropped-cropped-image-scaled-1-1.png"
              alt="CleanCloth"
              className="h-14 w-auto"
            />
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="absolute top-4 right-4 w-16 h-16 bg-gray-500/75 backdrop-blur-md rounded flex items-center justify-center text-white z-50"
        >
          {menuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/85 z-40"
              onClick={() => setMenuOpen(false)}
            ></div>
            <div className="fixed top-0 right-0 w-[85%] max-w-[400px] h-full bg-gradient-to-b from-[#2c2c2c] to-[#1f1f1f] z-50 overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between p-5 bg-[#3CACAE]/10 border-b-2 border-[#3CACAE]">
                <img
                  src="https://cleancloth.dk/wp-content/uploads/2025/08/cropped-cropped-image-scaled-1-1.png"
                  alt="CleanCloth"
                  className="h-9"
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white text-3xl"
                >
                  ×
                </button>
              </div>

              <nav className="p-8 space-y-4">
                <button
                  onClick={() => navigateTo('home')}
                  className="block w-full text-left py-4 text-white/90 text-lg border-b border-white/10 hover:text-[#3CACAE] transition-colors"
                >
                  Forside
                </button>

                {/* Private Cleaning Category */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => setPrivateMenuOpen(!privateMenuOpen)}
                    className="flex items-center justify-between w-full py-4 text-white/90 text-lg hover:text-[#3CACAE] transition-colors"
                  >
                    <span>Privat Rengøring</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${privateMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {privateMenuOpen && (
                    <div className="ml-4 space-y-2 pb-4">
                      <button
                        onClick={() => navigateTo('private-cleaning')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Privat rengøring Aarhus
                      </button>
                      <button
                        onClick={() => navigateTo('book-private')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Få tilbud
                      </button>
                      <button
                        onClick={() => navigateTo('how-it-works')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Sådan virker det
                      </button>
                      <button
                        onClick={() => navigateTo('service-included')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Hvad følger med?
                      </button>
                      <button
                        onClick={() => navigateTo('pricing')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Priser
                      </button>
                    </div>
                  )}
                </div>

                {/* Commercial Cleaning Category */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => setCommercialMenuOpen(!commercialMenuOpen)}
                    className="flex items-center justify-between w-full py-4 text-white/90 text-lg hover:text-[#3CACAE] transition-colors"
                  >
                    <span>Erhvervsrengøring</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${commercialMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {commercialMenuOpen && (
                    <div className="ml-4 space-y-2 pb-4">
                      <button
                        onClick={() => navigateTo('erhverv')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Erhvervsrengøring
                      </button>
                    </div>
                  )}
                </div>

                {/* Moving Cleaning Category */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => setMoveMenuOpen(!moveMenuOpen)}
                    className="flex items-center justify-between w-full py-4 text-white/90 text-lg hover:text-[#3CACAE] transition-colors"
                  >
                    <span>Flytterengøring</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${moveMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {moveMenuOpen && (
                    <div className="ml-4 space-y-2 pb-4">
                      <button
                        onClick={() => navigateTo('flytterengoring')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Flytterengøring
                      </button>
                      <button
                        onClick={() => navigateTo('book-flytterengoring')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Få tilbud
                      </button>
                    </div>
                  )}
                </div>

                {/* Additional Services Category */}
                <div className="border-b border-white/10">
                  <button
                    onClick={() => setExtraMenuOpen(!extraMenuOpen)}
                    className="flex items-center justify-between w-full py-4 text-white/90 text-lg hover:text-[#3CACAE] transition-colors"
                  >
                    <span>Ekstra & Miljø</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${extraMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {extraMenuOpen && (
                    <div className="ml-4 space-y-2 pb-4">
                      <button
                        onClick={() => navigateTo('extra-services')}
                        className="block w-full text-left py-2 ml-4 text-white/70 text-base border-b border-white/5 hover:text-[#3CACAE] transition-colors"
                      >
                        Ekstra tilvalg
                      </button>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => navigateTo('faq')}
                  className="block w-full text-left py-4 text-white/90 text-lg border-b border-white/10 hover:text-[#3CACAE] transition-colors"
                >
                  Spørgsmål & svar
                </button>
              </nav>

              <div className="px-8 mt-8">
                <button
                  onClick={() => navigateTo('booking-hub')}
                  className="block w-full py-4 bg-gradient-to-r from-[#3CACAE] to-[#1386bf] text-white text-center text-lg font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
                >
                  Få tilbud →
                </button>
              </div>
            </div>
          </>
        )}

        {/* Hero Content */}
        <div className="min-h-screen flex items-end pb-20 px-4">
          <div className="w-full max-w-md mx-auto md:mx-0 md:ml-10">
            <div className="bg-[#2c2c2c]/92 backdrop-blur-lg rounded-lg p-4 shadow-2xl">
              <h1 className="text-sm md:text-base text-white font-medium mb-3 leading-tight">
                Rengøringshælp i Aarhus
              </h1>

              <p className="text-white/80 text-xs md:text-sm mb-4 leading-relaxed">
                Professionel service med transparent prissætning. Indtast dit postnummer og boligens størrelse nedenfor.
              </p>

              <div className="mt-4 pt-4 border-t border-white/20">

                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={postalCode}
                      onChange={handlePostalCodeChange}
                      placeholder="Postnr."
                      maxLength={4}
                      className="flex-1 px-2 py-2 bg-white/15 border-2 border-white/30 rounded-md text-white text-sm placeholder-white/60 focus:outline-none focus:border-[#3CACAE] focus:bg-white/20"
                    />
                    <input
                      type="number"
                      value={propertySize}
                      onChange={(e) => setPropertySize(e.target.value)}
                      placeholder="Størrelse"
                      min="0"
                      max="300"
                      className="flex-1 px-2 py-2 bg-white/15 border-2 border-white/30 rounded-md text-white text-sm placeholder-white/60 focus:outline-none focus:border-[#3CACAE] focus:bg-white/20"
                    />
                    <span className="text-white font-medium text-sm">m²</span>
                  </div>

                  {validZone && (
                    <div className="bg-[#3CACAE]/15 border-2 border-[#3CACAE] rounded-lg p-2 text-center text-white text-xs">
                      <strong>Godt nyt!</strong> Vi rengør i dit område.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!validZone}
                    className="mx-auto block px-12 py-4 bg-[#00FFFF] text-black font-extrabold rounded-lg hover:bg-[#3CACAE] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 border-4 border-[#00FFFF] hover:border-[#3CACAE]"
                  >
                    SE DIN PRIS →
                  </button>
                </form>

                <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center gap-1.5">
                    <div className="text-yellow-400 text-xs">★★★★★</div>
                    <span className="text-white/90 text-xs">5.0 på Google</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <img
                      src={trygLogo}
                      alt="Tryg"
                      className="h-5 rounded"
                    />
                    <span className="text-white/90 text-xs">Forsikret</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-white/20 text-white/95 text-xs">
                  <svg
                    className="w-3 h-3 text-[#3CACAE]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Svanemærkede produkter
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-3 border-[#3CACAE] shadow-2xl z-30">
          <div className="max-w-7xl mx-auto px-5 py-4">
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
              <button
                onClick={() => navigateTo('faq')}
                className="text-gray-800 font-bold hover:text-[#3CACAE] transition-colors"
              >
                Spørgsmål & svar
              </button>
              <span className="text-gray-300 text-lg">|</span>
              <button
                onClick={() => navigateTo('private-cleaning')}
                className="text-gray-800 font-bold hover:text-[#3CACAE] transition-colors"
              >
                Privat rengøring i Aarhus
              </button>
              <span className="text-gray-300 text-lg">|</span>
              <button
                onClick={() => navigateTo('how-it-works')}
                className="text-gray-800 font-bold hover:text-[#3CACAE] transition-colors"
              >
                Sådan virker det
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

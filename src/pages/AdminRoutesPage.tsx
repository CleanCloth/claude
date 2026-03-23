import { useNavigate } from 'react-router-dom';

interface RouteInfo {
  path: string;
  label: string;
  category: string;
  description: string;
}

const routes: RouteInfo[] = [
  { path: '/', label: 'Forside', category: 'Main', description: 'Homepage with video background and price calculator' },
  { path: '/private-cleaning', label: 'Privat Rengøring', category: 'Privat Rengøring', description: 'Private cleaning services in Aarhus' },
  { path: '/book-private', label: 'Book Privat Rengøring', category: 'Privat Rengøring', description: 'Booking form for private cleaning' },
  { path: '/how-it-works', label: 'Sådan Virker Det', category: 'Privat Rengøring', description: 'How the service works - 3 easy steps' },
  { path: '/service-included', label: 'Hvad Følger Med?', category: 'Privat Rengøring', description: 'What is included in the cleaning service' },
  { path: '/pricing', label: 'Priser', category: 'Privat Rengøring', description: 'Transparent pricing information' },
  { path: '/erhverv', label: 'Erhvervsrengøring', category: 'Erhvervsrengøring', description: 'Commercial/business cleaning services' },
  { path: '/flytterengoring', label: 'Flytterengøring', category: 'Flytterengøring', description: 'Moving cleaning services' },
  { path: '/book-flytterengoring', label: 'Book Flytterengøring', category: 'Flytterengøring', description: 'Booking form for moving cleaning' },
  { path: '/extra-services', label: 'Ekstra Tilvalg', category: 'Ekstra & Miljø', description: 'Additional services and add-ons' },
  { path: '/faq', label: 'Spørgsmål & Svar', category: 'Main', description: 'Frequently asked questions' },
  { path: '/booking-hub', label: 'Booking Hub', category: 'Main', description: 'Central booking page for all services' },
  { path: '/admin/routes', label: 'Admin: Routes', category: 'Admin', description: 'This page – overview of all application routes' },
];

const categoryColors: Record<string, string> = {
  'Main': '#3CACAE',
  'Privat Rengøring': '#1386bf',
  'Erhvervsrengøring': '#e67e22',
  'Flytterengøring': '#9b59b6',
  'Ekstra & Miljø': '#27ae60',
  'Admin': '#e74c3c',
};

export default function AdminRoutesPage() {
  const navigate = useNavigate();

  const grouped = routes.reduce<Record<string, RouteInfo[]>>((acc, route) => {
    if (!acc[route.category]) acc[route.category] = [];
    acc[route.category].push(route);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white">
      {/* Header */}
      <div className="bg-[#16213e] border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-[#3CACAE] hover:text-white transition-colors text-sm"
            >
              &larr; Tilbage til site
            </button>
            <div className="w-px h-6 bg-white/20" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <span className="text-white/40 text-sm">{routes.length} routes</span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Application Routes</h2>
          <p className="text-white/50">Overview of all navigable pages in the CleanCloth application.</p>
        </div>

        {/* Route Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(grouped).map(([category, categoryRoutes]) => (
            <div
              key={category}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[category] || '#888' }}
                />
                <span className="text-white/70 text-sm">{category}</span>
              </div>
              <span className="text-2xl font-bold">{categoryRoutes.length}</span>
              <span className="text-white/40 text-sm ml-1">routes</span>
            </div>
          ))}
        </div>

        {/* Routes Table */}
        <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left px-6 py-3 text-white/60 text-sm font-medium">Path</th>
                <th className="text-left px-6 py-3 text-white/60 text-sm font-medium">Label</th>
                <th className="text-left px-6 py-3 text-white/60 text-sm font-medium hidden md:table-cell">Category</th>
                <th className="text-left px-6 py-3 text-white/60 text-sm font-medium hidden lg:table-cell">Description</th>
                <th className="text-right px-6 py-3 text-white/60 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr
                  key={route.path}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <code className="text-[#3CACAE] text-sm bg-[#3CACAE]/10 px-2 py-1 rounded">
                      {route.path}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-white/90 text-sm">{route.label}</td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: `${categoryColors[route.category] || '#888'}20`,
                        color: categoryColors[route.category] || '#888',
                        border: `1px solid ${categoryColors[route.category] || '#888'}40`,
                      }}
                    >
                      {route.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/50 text-sm hidden lg:table-cell">
                    {route.description}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(route.path)}
                      className="text-[#3CACAE] hover:text-white text-sm transition-colors"
                    >
                      Visit &rarr;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

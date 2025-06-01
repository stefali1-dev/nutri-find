import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

// Iconițe (poți folosi o bibliotecă de iconițe precum Heroicons sau React Icons)
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.408c.498 0 .706.656.34.957l-4.37 3.185a.563.563 0 00-.182.635l2.125 5.111a.563.563 0 01-.812.622l-4.37-3.185a.563.563 0 00-.652 0l-4.37 3.185a.563.563 0 01-.812-.622l2.125-5.111a.563.563 0 00-.182-.635l-4.37-3.185a.563.563 0 01.34-.957h5.408a.563.563 0 00.475-.31l2.125-5.111z" />
  </svg>
)
const CurrencyEuroIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 100 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const CalendarDaysIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z" />
  </svg>
)
const Cog6ToothIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.096.573.394 1.086.785 1.475l.93.89a.75.75 0 010 1.06l-.93.89c-.39.39-.69.902-.784 1.475l-.214 1.282c-.09.542-.56.94-1.11.94h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.096-.573-.393-1.086-.785-1.475l-.93-.89a.75.75 0 010-1.06l.93-.89c.39-.39.69-.902.785-1.475l.213-1.282zM12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
)
const ArrowTrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.329 4.329 7.006-7.006M21 7.5V12M21 7.5H16.5" />
    </svg>
)
const ArrowTrendingDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.329-4.329 7.006 7.006M21 16.5V12M21 16.5H16.5" />
    </svg>
)


interface MetricCardProps {
  title: string;
  value: string;
  period?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  actionLink?: string;
  actionText?: string;
  colorClass?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, period, icon, trend, trendValue, actionLink, actionText, colorClass = 'bg-green-600' }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-full ${colorClass} text-white`}>
          {icon}
        </div>
        {actionLink && actionText && (
            <Link href={actionLink}>
                <span className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                    {actionText}
                </span>
            </Link>
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-500 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <div className="flex items-center text-sm">
        {trend && trendValue && (
          <span className={`flex items-center mr-2 ${
            trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {trend === 'up' && <ArrowTrendingUpIcon />}
            {trend === 'down' && <ArrowTrendingDownIcon />}
            <span className="ml-1 font-medium">{trendValue}</span>
          </span>
        )}
        {period && <span className="text-gray-500">{period}</span>}
      </div>
    </div>
  )
}

interface UpcomingAppointment {
    id: string;
    clientName: string;
    time: string;
    date: string;
    type: 'Online' | 'În persoană';
    avatarUrl?: string;
}

const mockAppointments: UpcomingAppointment[] = [
    { id: '1', clientName: 'Ana Popescu', time: '10:00', date: 'Azi', type: 'Online', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=b6e3f4' },
    { id: '2', clientName: 'Mihai Ionescu', time: '14:30', date: 'Azi', type: 'În persoană', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mihai&backgroundColor=c0aede' },
    { id: '3', clientName: 'Elena Vasilescu', time: '09:00', date: 'Mâine', type: 'Online', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd5dc' },
]

// Mock data - ar trebui să vină din API
const nutritionistData = {
  name: 'Dr. Exemplu Nutriționist', // Înlocuiește cu numele real
  profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=NutritionistDas&backgroundColor=d1d4f9', // Placeholder, înlocuiește
  metrics: {
    profileViews: { value: '1,230', period: 'ultima lună', trend: 'up', trendValue: '+15%' },
    conversionRate: { value: '12.5%', period: 'ultima lună', trend: 'up', trendValue: '+2.1%' },
    avgRating: { value: '4.92', period: '(125 recenzii)', trend: 'neutral', trendValue: '' },
    totalRevenue: { value: '5,850 RON', period: 'luna curentă', trend: 'up', trendValue: '+850 RON' },
  }
}


export default function NutritionistDashboard() {
  const router = useRouter()
  const [activeLink, setActiveLink] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simulează încărcarea datelor (poți adăuga un loader real dacă e nevoie)
  // useEffect(() => {
  //   // Fetch data from Supabase here
  // }, [])

  const sidebarLinks = [
    { name: 'Dashboard', href: '/nutritionists/dashboard', icon: ChartBarIcon, id: 'dashboard' },
    { name: 'Programări', href: '/nutritionists/appointments', icon: CalendarDaysIcon, id: 'appointments' },
    { name: 'Profilul Meu', href: '/nutritionists/profile', icon: UsersIcon, id: 'profile' },
    { name: 'Servicii & Prețuri', href: '/nutritionists/services', icon: CurrencyEuroIcon, id: 'services_pricing' },
    { name: 'Setări Cont', href: '/nutritionists/settings', icon: Cog6ToothIcon, id: 'settings' },
  ]

  const handleLinkClick = (id: string) => {
    setActiveLink(id)
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    // router.push(href) // Navighează dacă nu ești pe pagina respectivă
  }

  return (
    <>
      <Head>
        <title>Dashboard Nutriționist - NutriConnect</title>
        <meta name="description" content="Panoul de control pentru nutriționiști NutriConnect." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <Link href="/">
                    <span className="text-2xl font-bold text-green-600 cursor-pointer">NutriConnect</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-500 hover:text-gray-700">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>
            <nav className="flex-grow px-4 py-6 space-y-2">
                {sidebarLinks.map((link) => (
                <a
                    key={link.id}
                    href={link.href} // Pentru demo, folosim href direct; pentru Next.js routing, folosește componenta Link și onClick
                    onClick={(e) => {
                        e.preventDefault(); // Previne navigarea standard dacă gestionezi prin router.push
                        handleLinkClick(link.id);
                        router.push(link.href); // Asigură-te că pagina există
                    }}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    activeLink === link.id
                        ? 'bg-green-600 text-white shadow-md scale-105'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                >
                    <link.icon />
                    <span className="ml-3 font-medium">{link.name}</span>
                </a>
                ))}
            </nav>
            <div className="px-6 py-4 border-t border-gray-200">
                <button 
                    onClick={() => { /* Logica de logout */ router.push('/nutritionists/login'); }}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors group"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                    <span className="ml-3 font-medium">Deconectare</span>
                </button>
            </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden text-gray-600 hover:text-gray-800">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <h1 className="text-2xl font-semibold text-gray-800 hidden md:block">Dashboard Profesional</h1>
                <div className="flex items-center">
                  <div className="mr-4 hidden sm:block">
                    <p className="text-sm text-gray-500">Bine ai venit,</p>
                    <p className="font-medium text-gray-800">{nutritionistData.name}</p>
                  </div>
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={nutritionistData.profilePhoto}
                    alt="Fotografie profil"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8">
            {/* Welcome Banner / Quick Tip */}
            <div className="bg-green-600 text-white rounded-xl shadow-lg p-6 mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Salut, {nutritionistData.name.split(' ')[1]}!</h2>
                    <p className="text-green-100">Iată o privire de ansamblu asupra activității tale.</p>
                </div>
                <Link href="/nutritionists/profile/edit">
                    <button className="bg-white text-green-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-green-50 transition-colors text-sm">
                        Actualizează Profilul
                    </button>
                </Link>
            </div>
            
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Vizualizări Profil"
                value={nutritionistData.metrics.profileViews.value}
                period={nutritionistData.metrics.profileViews.period}
                icon={<UsersIcon />}
                trend={nutritionistData.metrics.profileViews.trend as any}
                trendValue={nutritionistData.metrics.profileViews.trendValue}
                colorClass="bg-sky-500"
              />
              <MetricCard
                title="Rată Conversie"
                value={nutritionistData.metrics.conversionRate.value}
                period={nutritionistData.metrics.conversionRate.period}
                icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.329 4.329 7.006-7.006M21 7.5V12M21 7.5H16.5" /></svg>}
                trend={nutritionistData.metrics.conversionRate.trend as any}
                trendValue={nutritionistData.metrics.conversionRate.trendValue}
                colorClass="bg-purple-500"
              />
              <MetricCard
                title="Rating Mediu"
                value={nutritionistData.metrics.avgRating.value}
                period={nutritionistData.metrics.avgRating.period}
                icon={<StarIcon />}
                trend={nutritionistData.metrics.avgRating.trend as any}
                trendValue={nutritionistData.metrics.avgRating.trendValue}
                colorClass="bg-amber-500"
                actionLink="/nutritionists/reviews"
                actionText="Vezi Recenzii"
              />
              <MetricCard
                title="Venituri Lunare"
                value={nutritionistData.metrics.totalRevenue.value}
                period={nutritionistData.metrics.totalRevenue.period}
                icon={<CurrencyEuroIcon />}
                trend={nutritionistData.metrics.totalRevenue.trend as any}
                trendValue={nutritionistData.metrics.totalRevenue.trendValue}
                colorClass="bg-green-500"
                actionLink="/nutritionists/earnings"
                actionText="Detalii Venituri"
              />
            </div>

            {/* Sections: Appointments & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Upcoming Appointments */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Programări Viitoare</h3>
                    <Link href="/nutritionists/appointments">
                        <span className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors">
                            Vezi toate programările
                        </span>
                    </Link>
                </div>
                {mockAppointments.length > 0 ? (
                    <div className="space-y-4">
                    {mockAppointments.slice(0,3).map(app => (
                        <div key={app.id} className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                            <img src={app.avatarUrl || `https://ui-avatars.com/api/?name=${app.clientName.replace(' ', '+')}&background=random`} alt={app.clientName} className="w-10 h-10 rounded-full mr-4 object-cover"/>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800">{app.clientName}</p>
                                <p className="text-sm text-gray-500">{app.date}, {app.time} - {app.type}</p>
                            </div>
                            <button className="text-green-600 hover:text-green-700 text-sm font-medium p-2 rounded-md hover:bg-green-100 transition-colors">
                                Detalii
                            </button>
                        </div>
                    ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-4">Nu ai programări viitoare.</p>
                )}
              </div>

              {/* Quick Actions / Tips */}
              <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Acțiuni Rapide</h3>
                <div className="space-y-3">
                    <Link href="/nutritionists/availability/edit">
                        <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-all transform hover:scale-102">
                            <CalendarDaysIcon/> Actualizează Disponibilitatea
                        </button>
                    </Link>
                     <Link href="/nutritionists/services/new">
                        <button className="w-full flex items-center justify-center gap-2 bg-sky-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-sky-700 transition-all transform hover:scale-102">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                            Adaugă Serviciu Nou
                        </button>
                    </Link>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold text-gray-700 mb-2">💡 Sfat Pro:</h4>
                        <p className="text-sm text-gray-600">
                            Un profil complet și actualizat, cu o fotografie profesională, atrage mai mulți clienți. Verifică-ți periodic descrierea și specializările!
                        </p>
                    </div>
                </div>
              </div>
            </div>
            
            {/* Placeholder for Charts/Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Trend Venituri (Ultimele 6 luni)</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Aici va fi un grafic cu veniturile</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Comparație cu Media Specializării</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400">Aici va fi un grafic comparativ</p>
                    </div>
                </div>
            </div>

          </main>
        </div>
      </div>
    </>
  )
}
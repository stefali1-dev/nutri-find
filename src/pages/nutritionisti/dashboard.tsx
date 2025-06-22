import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '@/layouts/DashboardLayout'

interface Appointment {
  id: string
  clientName: string
  clientPhoto: string
  date: string
  time: string
  type: 'online' | 'in-person'
  status: 'confirmed' | 'pending' | 'completed'
  service: string
}

interface MetricCard {
  title: string
  value: string | number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  icon: string
  color: string
}

export default function NutritionistDashboard() {
  const router = useRouter()
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const [currentDate] = useState(new Date())

  // Mock data
  const nutritionistData = {
    name: 'Dr. Maria Popescu',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria&backgroundColor=b6e3f4',
    memberSince: 'Ianuarie 2024',
    plan: 'Professional',
    nextPayment: '15 Iunie 2024'
  }

  const todayAppointments: Appointment[] = [
    {
      id: '1',
      clientName: 'Ana Ionescu',
      clientPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana&backgroundColor=ffd5dc',
      date: 'Azi',
      time: '10:00',
      type: 'online',
      status: 'confirmed',
      service: 'Consultație inițială'
    },
    {
      id: '2',
      clientName: 'Mihai Popa',
      clientPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mihai&backgroundColor=c9f7f5',
      date: 'Azi',
      time: '11:30',
      type: 'in-person',
      status: 'confirmed',
      service: 'Monitorizare'
    },
    {
      id: '3',
      clientName: 'Elena Radu',
      clientPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=ffd9a6',
      date: 'Azi',
      time: '14:00',
      type: 'online',
      status: 'pending',
      service: 'Consultație nutriție sportivă'
    }
  ]

  const metrics: MetricCard[] = [
    {
      title: 'Vizualizări profil',
      value: '1,234',
      change: 12.5,
      changeType: 'increase',
      icon: '👁️',
      color: 'blue'
    },
    {
      title: 'Consultații această lună',
      value: '48',
      change: 8,
      changeType: 'increase',
      icon: '📅',
      color: 'green'
    },
    {
      title: 'Venit lunar',
      value: '12,400 RON',
      change: 15.3,
      changeType: 'increase',
      icon: '💰',
      color: 'emerald'
    },
    {
      title: 'Rating mediu',
      value: '4.9',
      change: 0.1,
      changeType: 'increase',
      icon: '⭐',
      color: 'yellow'
    }
  ]

  const chartData = {
    labels: ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'],
    consultations: [8, 12, 10, 14, 16, 9, 6],
    revenue: [2000, 3000, 2500, 3500, 4000, 2250, 1500]
  }

  const upcomingClients = [
    { name: 'Ana Ionescu', sessions: 12, nextSession: 'Azi, 10:00' },
    { name: 'Mihai Popa', sessions: 8, nextSession: 'Azi, 11:30' },
    { name: 'Elena Radu', sessions: 5, nextSession: 'Azi, 14:00' },
    { name: 'George Dumitrescu', sessions: 3, nextSession: 'Mâine, 09:00' }
  ]

  const getGreeting = () => {
    const hour = currentDate.getHours()
    if (hour < 12) return 'Bună dimineața'
    if (hour < 18) return 'Bună ziua'
    return 'Bună seara'
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - NutriFind Pro</title>
        <meta name="description" content="Gestionează-ți practica de nutriție cu ușurință" />
      </Head>

      <div className="min-h-screen bg-gray-50">

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getGreeting()}, {nutritionistData.name.split(' ')[1]}! 👋
            </h1>
            <p className="text-gray-600">
              Ai {todayAppointments.length} consultații programate azi. Să facem o zi productivă!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button className="bg-green-600 text-white p-4 rounded-xl hover:bg-green-700 transition-all transform hover:scale-105 flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="font-medium">Adaugă programare</span>
            </button>
            <button className="cursor-pointer bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-xl hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="font-medium">Client nou</span>
            </button>
            <button className="cursor-pointer bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-xl hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="font-medium">Plan alimentar</span>
            </button>
            <button className="cursor-pointer bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-xl hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Trimite mesaj</span>
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                  </div>
                  <span className="text-3xl">{metric.icon}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`flex items-center gap-1 text-sm font-medium ${metric.changeType === 'increase' ? 'text-green-600' :
                      metric.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                    {metric.changeType === 'increase' && '↑'}
                    {metric.changeType === 'decrease' && '↓'}
                    {Math.abs(metric.change)}%
                  </span>
                  <span className="text-sm text-gray-500">față de luna trecută</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Schedule */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Programul de azi</h2>
                  <Link href="/nutritionist/appointments">
                    <span className="text-green-600 hover:text-green-700 text-sm font-medium cursor-pointer">
                      Vezi toate →
                    </span>
                  </Link>
                </div>

                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={appointment.clientPhoto}
                          alt={appointment.clientName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{appointment.clientName}</p>
                          <p className="text-sm text-gray-600">{appointment.service}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{appointment.time}</p>
                          <p className="text-sm text-gray-600">
                            {appointment.type === 'online' ? 'Online' : 'La cabinet'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full ${appointment.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : appointment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                          {appointment.status === 'confirmed' ? 'Confirmat' :
                            appointment.status === 'pending' ? 'În așteptare' : 'Completat'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Chart */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Performanță săptămânală</h2>
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-green-500"
                  >
                    <option value="week">Ultima săptămână</option>
                    <option value="month">Ultima lună</option>
                    <option value="year">Ultimul an</option>
                  </select>
                </div>

                {/* Simple Chart Representation */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Consultații</span>
                      <span className="text-sm font-medium text-gray-900">85 total</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {chartData.consultations.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-green-500 rounded-t hover:bg-green-600 transition-colors relative group"
                          style={{ height: `${(value / Math.max(...chartData.consultations)) * 100}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2">
                      {chartData.labels.map((label, index) => (
                        <span key={index} className="text-xs text-gray-500 flex-1 text-center">
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Venituri</span>
                      <span className="text-sm font-medium text-gray-900">18,750 RON</span>
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {chartData.revenue.map((value, index) => (
                        <div
                          key={index}
                          className="flex-1 bg-emerald-500 rounded-t hover:bg-emerald-600 transition-colors relative group"
                          style={{ height: `${(value / Math.max(...chartData.revenue)) * 100}%` }}
                        >
                          <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            {value} RON
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Activity */}
              {/* <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Activitate recentă</h2>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <span className="text-2xl mt-1">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          {activity.description}
                          {activity.isNew && (
                            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              Nou
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Top Clients */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Clienți fideli</h2>
                <div className="space-y-4">
                  {upcomingClients.map((client, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{client.name}</p>
                        <p className="text-sm text-gray-600">{client.sessions} sesiuni</p>
                      </div>
                      <p className="text-sm text-gray-500">{client.nextSession}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Poziția ta în top</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">În categoria ta</span>
                    <span className="font-bold">#3 din 45</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">În orașul tău</span>
                    <span className="font-bold">#12 din 234</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-100">Rating general</span>
                    <span className="font-bold">Top 5%</span>
                  </div>
                </div>
                <button className="mt-4 w-full bg-white/20 hover:bg-white/30 backdrop-blur py-2 rounded-lg transition-colors text-sm font-medium">
                  Vezi clasament complet →
                </button>
              </div>
            </div>
          </div>
        </main>

        
      </div>
    </Layout>
  )
}
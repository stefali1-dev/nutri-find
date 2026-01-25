import { useState } from 'react'
import Link from 'next/link'

export default function LegalNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors">
                NutriFind
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#how-it-works">
              <span className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Cum funcționează
              </span>
            </Link>
            <Link href="/#benefits">
              <span className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">
                Beneficii
              </span>
            </Link>
            <Link href="/">
              <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 cursor-pointer">
                Găsește Nutriționist
              </button>
            </Link>
            <Link href="/nutritionisti/login">
              <button className="cursor-pointer bg-white text-green-600 border-2 border-green-600 px-6 py-2 rounded-full hover:bg-green-50 transition-all">
                Login
              </button>
            </Link>
          </div>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="text-gray-700 hover:text-green-600 focus:outline-none cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/#how-it-works">
              <span 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Cum funcționează
              </span>
            </Link>
            <Link href="/#benefits">
              <span 
                className="block px-3 py-2 text-gray-700 hover:text-green-600 cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Beneficii
              </span>
            </Link>
            <Link href="/">
              <button 
                className="w-full mt-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                Găsește Nutriționist
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface NavLink {
  href: string
  label: string
  onClick?: () => void
}

interface PublicNavbarProps {
  activePage?: 'home' | 'despre' | 'contact' | 'nutritionisti'
  navLinks?: NavLink[]
  ctaButton?: {
    label: string
    href: string
  }
  secondaryButton?: {
    label: string
    href: string
  }
  showLogo?: boolean
}

export default function PublicNavbar({ 
  activePage, 
  navLinks, 
  ctaButton,
  secondaryButton,
  showLogo = true 
}: PublicNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Default nav links for home page
  const defaultNavLinks: NavLink[] = [
    { href: '/#how-it-works', label: 'Cum funcționează' },
    { href: '/#benefits', label: 'Beneficii' },
    { href: '/#insights', label: 'Interviuri' }
  ]

  // Default CTA button
  const defaultCta = {
    label: 'Începe acum',
    href: '/cauta-nutritionist'
  }

  const links = navLinks || defaultNavLinks
  const cta = ctaButton || defaultCta

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showLogo && (
              <>
                <Link href="/">
                  <Image
                    src="/images/logo.png"
                    alt="NutriFind Logo"
                    width={40}
                    height={40}
                    className="w-8 h-8 sm:w-10 sm:h-10 mr-2 cursor-pointer"
                    priority
                  />
                </Link>
                <Link href="/">
                  <span className="text-xl sm:text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors">
                    NutriFind
                  </span>
                </Link>
              </>
            )}
            {!showLogo && (
              <Link href="/">
                <span className="text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors">
                  NutriFind
                </span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={link.onClick}
                className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <Link href={cta.href}>
              <button className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 cursor-pointer">
                {cta.label}
              </button>
            {secondaryButton && (
              <Link href={secondaryButton.href}>
                <button className="cursor-pointer bg-transparent text-green-600 border border-green-600 px-6 py-2 rounded-full hover:bg-green-600 hover:text-white transition-all transform hover:scale-105">
                  {secondaryButton.label}
                </button>
              </Link>
            )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none p-2 cursor-pointer"
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

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-lg cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false)
                  link.onClick?.()
                }}
              >
                {link.label}
              </a>
            ))}
            {secondaryButton && (
              <Link href={secondaryButton.href}>
                <button
                  className="w-full mt-2 bg-transparent text-green-600 border border-green-600 px-6 py-3 rounded-full hover:bg-green-600 hover:text-white transition-colors cursor-pointer"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {secondaryButton.label}
                </button>
              </Link>
            )}
            <Link href={cta.href}>
              <button
                className="w-full mt-2 bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 transition-colors cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                {cta.label}
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

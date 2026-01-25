import Link from 'next/link'

interface SimpleNavbarProps {
  rightLink?: {
    label: string
    href: string
    isButton?: boolean
  }
  rightText?: string
}

export default function SimpleNavbar({ rightLink, rightText }: SimpleNavbarProps) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <span className="text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors">
              NutriFind
            </span>
          </Link>
          <div className="flex items-center">
            {rightText && (
              <span className="text-sm text-gray-600 mr-2">{rightText}</span>
            )}
            {rightLink && (
              <Link href={rightLink.href}>
                {rightLink.isButton ? (
                  <button className="text-green-600 hover:text-green-700 font-medium transition-colors cursor-pointer">
                    {rightLink.label}
                  </button>
                ) : (
                  <button className="text-green-600 hover:text-green-700 font-medium transition-colors py-2 px-3 rounded-md cursor-pointer">
                    {rightLink.label}
                  </button>
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

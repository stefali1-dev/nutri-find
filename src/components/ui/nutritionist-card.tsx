import { cn, getSpecializationEmoji, getSpecializationLabel } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

interface Service {
  name: string
  price: string
  duration: string
}

interface NutritionistCardProps {
  id: string
  fullName: string
  profilePhotoUrl?: string
  yearsExperience: string | number
  location: string
  specializations: string[]
  bio: string
  consultationTypes: string[]
  languages: string[]
  certifications: any[]
  services: Service[]
  onBookClick: () => void
  onViewProfileClick: () => void
  className?: string
}

const NutritionistAvatar = ({ name, photoUrl }: { name: string; photoUrl?: string }) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2)
    : 'NN'

  if (photoUrl) {
    return (
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
        <Image
          src={photoUrl}
          alt={name}
          fill
          className="rounded-2xl object-cover border-2 border-gray-100"
        />
      </div>
    )
  }

  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-lg sm:text-xl font-bold border-2 border-gray-100 flex-shrink-0">
      {initials}
    </div>
  )
}

export function NutritionistCard({
  id,
  fullName,
  profilePhotoUrl,
  yearsExperience,
  location,
  specializations,
  bio,
  consultationTypes,
  languages,
  certifications,
  services,
  onBookClick,
  onViewProfileClick,
  className
}: NutritionistCardProps) {
  const lowestPrice = Math.min(...services.map(s => parseInt(s.price)))

  return (
    <Card className={cn(
      "overflow-hidden group hover:shadow-xl transition-all duration-300 hover:scale-[1.01] border-gray-100",
      className
    )}>
      <CardContent className="p-4 sm:p-6">
        {/* Mobile Layout */}
        <div className="lg:hidden space-y-4">
          {/* Header: Avatar + Name + Rating */}
          <div className="flex gap-3 items-start">
            <NutritionistAvatar name={fullName} photoUrl={profilePhotoUrl} />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-800 leading-tight line-clamp-2 mb-1">
                {fullName}
              </h3>
              <div className="flex items-center gap-3 text-xs text-gray-600 mt-2">
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{yearsExperience} ani</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate" title={location}>{location}</span>
                </div>
              </div>
            </div>
            {/* Price on mobile - top right */}
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gray-500">de la</div>
              <div className="text-xl font-bold text-green-600">{lowestPrice} RON</div>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5">
            {specializations.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs py-0.5 px-2">
                <span className="mr-1">{getSpecializationEmoji(spec)}</span>
                <span>{getSpecializationLabel(spec).split(' ')[0]}</span>
              </Badge>
            ))}
            {specializations.length > 3 && (
              <span className="text-gray-500 text-xs px-1.5 py-0.5">+{specializations.length - 3}</span>
            )}
          </div>

          {/* Bio */}
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{bio}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5">
            {consultationTypes.includes('online') && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs py-0.5 px-2">
                💻 Online
              </Badge>
            )}
            {consultationTypes.includes('in-person') && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs py-0.5 px-2">
                🏢 Cabinet
              </Badge>
            )}
            {languages.length > 1 && (
              <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 text-xs py-0.5 px-2">
                🌍 {languages.length} limbi
              </Badge>
            )}
            {certifications.length > 0 && (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs py-0.5 px-2">
                🏆 Certificat
              </Badge>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={onBookClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            >
              Programează
            </Button>
            <Button
              onClick={onViewProfileClick}
              variant="outline"
              className="flex-1 bg-white border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700 cursor-pointer"
            >
              Vezi profilul
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex gap-6">
          {/* Left: Avatar + Basic Info */}
          <div className="flex gap-4 w-72 flex-shrink-0 items-start">
            <NutritionistAvatar name={fullName} photoUrl={profilePhotoUrl} />
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-800 leading-tight mb-2">
                {fullName}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0h3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{yearsExperience} ani exp.</span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate" title={location}>{location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Content */}
          <div className="flex-1 border-l border-gray-100 pl-6 space-y-3">
            {/* Specializations */}
            <div className="flex flex-wrap gap-2">
              {specializations.slice(0, 3).map((spec) => (
                <Badge key={spec} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 text-sm">
                  <span className="mr-1">{getSpecializationEmoji(spec)}</span>
                  <span>{getSpecializationLabel(spec)}</span>
                </Badge>
              ))}
              {specializations.length > 3 && (
                <span className="text-gray-500 text-sm px-2 py-1">+{specializations.length - 3}</span>
              )}
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{bio}</p>

            {/* Features */}
            <div className="flex flex-wrap gap-2">
              {consultationTypes.includes('online') && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  💻 Consultații Online
                </Badge>
              )}
              {consultationTypes.includes('in-person') && (
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs">
                  🏢 Cabinet Fizic
                </Badge>
              )}
              {languages.length > 1 && (
                <Badge variant="outline" className="bg-gray-100 text-gray-700 border-gray-200 text-xs">
                  🌍 {languages.length} limbi
                </Badge>
              )}
              {certifications.length > 0 && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs">
                  🏆 Certificat
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Price + Actions */}
          <div className="w-40 flex-shrink-0 flex flex-col justify-between">
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">de la</div>
              <div className="text-2xl font-bold text-green-600 mb-4">{lowestPrice} RON</div>
            </div>
            <div className="space-y-2">
              <Button
                onClick={onBookClick}
                className="w-full bg-green-600 hover:bg-green-700 text-white cursor-pointer"
              >
                Programează
              </Button>
              <Button
                onClick={onViewProfileClick}
                variant="outline"
                className="w-full bg-white border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-700 cursor-pointer"
              >
                Vezi profilul
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

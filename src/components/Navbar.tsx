import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import NotificationsDropdown, { Activity } from "./NotificationsDropdown";

export default function Navbar() {

    const { nutritionist } = useAuth();

    if (!nutritionist) return null // or a loading skeleton

    const recentActivities: Activity[] = [
        {
            id: '1',
            type: 'booking',
            description: 'Programare nouă de la Alexandru Popescu pentru mâine',
            time: 'Acum 10 minute',
            isNew: true
        },
        {
            id: '2',
            type: 'review',
            description: 'Recenzie nouă 5★ de la Maria Georgescu',
            time: 'Acum 2 ore',
            isNew: true
        },
        {
            id: '3',
            type: 'message',
            description: 'Mesaj nou de la Elena Radu',
            time: 'Acum 3 ore',
            isNew: false
        },
        {
            id: '4',
            type: 'payment',
            description: 'Plată primită: 250 RON de la Ana Ionescu',
            time: 'Ieri',
            isNew: false
        }
    ]

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/">
                            <span className="text-2xl font-bold text-green-600 cursor-pointer hover:text-green-700 transition-colors">NutriFind</span>
                        </Link>
                        <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">PRO</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <Link href="/nutritionisti/dashboard">
                            <span className="text-gray-900 font-medium cursor-pointer hover:text-green-600 transition-colors">Dashboard</span>
                        </Link>
                        <Link href="/nutritionisti/dashboard">
                            <span className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">Programări</span>
                        </Link>
                        <Link href="/nutritionisti/dashboard">
                            <span className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">Clienți</span>
                        </Link>
                        <Link href={`/nutritionisti/${nutritionist.id}/edit`}>
                            <span className="text-gray-600 hover:text-gray-900 cursor-pointer transition-colors">Profil</span>
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={nutritionist.profilePhoto}
                                alt={nutritionist.fullName}
                                className="w-10 h-10 rounded-full"
                            />
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900">{nutritionist.profilePhoto}</p>
                                {/* <p className="text-xs text-gray-500">Plan {nutritionistData.plan}</p> */}
                            </div>
                        </div>

                        {/* notifications */}
                        <NotificationsDropdown notifications={recentActivities} />
                    </div>
                </div>
            </div>
        </header>)
}
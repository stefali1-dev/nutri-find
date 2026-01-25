import { useState } from "react"

export interface Activity {
    id: string
    type: 'booking' | 'review' | 'message' | 'payment'
    description: string
    time: string
    isNew: boolean
}

export default function NotificationsDropdown({ notifications }: { notifications: Activity[] }) {
    const [showNotifications, setShowNotifications] = useState(false)
    const unread = notifications.some((n) => !n.isNew)


    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'booking': return '📅'
            case 'review': return '⭐'
            case 'message': return '💬'
            case 'payment': return '💰'
            default: return '📌'
        }
    }

    return (
        <>
            <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
            >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unread && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
                <div className="absolute top-16 right-4 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900">Notificări</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.map((activity) => (
                            <div
                                key={activity.id}
                                className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0 ${activity.isNew ? 'bg-green-50' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <span className="text-xl">{getActivityIcon(activity.type)}</span>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-900">{activity.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                            Vezi toate notificările
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}

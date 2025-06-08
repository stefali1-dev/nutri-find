import { useState, useEffect } from 'react'
import { NutritionistData } from '@/lib/types/nutritionist'

interface BookingModalProps {
    nutritionist: NutritionistData
    onBook: (bookingData: BookingData) => void
}

export interface BookingData {
    nutritionistId: string
    date: Date
    time: string
    phone: string
    message: string
}

const BookingModal = ({ nutritionist, onBook }: BookingModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1) // 1: calendar, 2: contact details
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)

    // Get current date
    const today = new Date()
    const [currentMonth, setCurrentMonth] = useState(today.getMonth())
    const [currentYear, setCurrentYear] = useState(today.getFullYear())

    // Generate calendar days
    const getDaysInMonth = (month: number, year: number): number => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getFirstDayOfMonth = (month: number, year: number): number => {
        return new Date(year, month, 1).getDay()
    }

    const generateCalendarDays = (): (number | null)[] => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear)
        const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
        const days: (number | null)[] = []

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            days.push(null)
        }

        // Add days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i)
        }

        return days
    }

    const monthNames = [
        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
        'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
    ]

    const dayNames = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
        '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30'
    ]

    const isDateAvailable = (day: number | null): boolean => {
        if (!day) return false
        const date = new Date(currentYear, currentMonth, day)
        const dayOfWeek = date.getDay()

        // Check if it's a weekend (simplified - you can use nutritionist.work_days)
        if (dayOfWeek === 0 || dayOfWeek === 6) return false

        // Check if date is in the past
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        if (date < todayStart) return false

        return true
    }

    const handleDateSelect = (day: number | null) => {
        if (!day || !isDateAvailable(day)) return
        setSelectedDate(new Date(currentYear, currentMonth, day))
    }

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time)
    }

    const handleNext = () => {
        if (selectedDate && selectedTime) {
            setStep(2)
        }
    }

    const handleSubmit = async () => {
        if (!phone || phone.length < 10) {
            alert('Te rog introdu un număr de telefon valid')
            return
        }

        if (!selectedDate || !selectedTime || !nutritionist.id) {
            alert('Eroare: Lipsesc date necesare')
            return
        }

        setLoading(true)

        // Simulate API call
        setTimeout(() => {
            onBook({
                nutritionistId: nutritionist.id!,
                date: selectedDate,
                time: selectedTime,
                phone,
                message
            })
            setLoading(false)
            setIsOpen(false)
            // Reset form
            setStep(1)
            setSelectedDate(null)
            setSelectedTime(null)
            setPhone('')
            setMessage('')

            alert('Programare trimisă cu succes! Vei fi contactat în curând.')
        }, 1500)
    }

    const handleClose = () => {
        setIsOpen(false)
        setTimeout(() => {
            setStep(1)
            setSelectedDate(null)
            setSelectedTime(null)
            setPhone('')
            setMessage('')
        }, 300)
    }

    return (
        <>
            {/* Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-green-600 text-white px-4 lg:px-5 py-2.5 lg:py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm lg:text-base"
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 011 1v9a1 1 0 01-1 1H5a1 1 0 01-1-1V8a1 1 0 011-1h3z" />
                </svg>
                <span className="hidden sm:inline">Programează</span>
                <span className="sm:hidden">Program</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        {/* Background overlay */}
                        <div
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={handleClose}
                        />

                        {/* Modal panel */}
                        <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                            {/* Header */}
                            <div className="px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {step === 1 ? '📅 Alege data și ora' : '📞 Detalii contact'}
                                    </h3>
                                    <button
                                        onClick={handleClose}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">
                                    Programare consultație cu {nutritionist.full_name}
                                </p>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-4">
                                {step === 1 ? (
                                    <>
                                        {/* Calendar */}
                                        <div className="mb-6">
                                            {/* Month navigation */}
                                            <div className="flex items-center justify-between mb-4">
                                                <button
                                                    onClick={() => {
                                                        if (currentMonth === 0) {
                                                            setCurrentMonth(11)
                                                            setCurrentYear(currentYear - 1)
                                                        } else {
                                                            setCurrentMonth(currentMonth - 1)
                                                        }
                                                    }}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                    </svg>
                                                </button>
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    {monthNames[currentMonth]} {currentYear}
                                                </h4>
                                                <button
                                                    onClick={() => {
                                                        if (currentMonth === 11) {
                                                            setCurrentMonth(0)
                                                            setCurrentYear(currentYear + 1)
                                                        } else {
                                                            setCurrentMonth(currentMonth + 1)
                                                        }
                                                    }}
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Day names */}
                                            <div className="grid grid-cols-7 gap-1 mb-2">
                                                {dayNames.map((day, index) => (
                                                    <div
                                                        key={index}
                                                        className="text-center text-xs font-medium text-gray-500 py-2"
                                                    >
                                                        {day}
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Calendar days */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {generateCalendarDays().map((day, index) => (
                                                    <button
                                                        key={`${currentMonth}-${currentYear}-${index}`} // Unique key
                                                        onClick={() => handleDateSelect(day)}
                                                        disabled={!isDateAvailable(day)}
                                                        className={`
        h-10 rounded-lg font-medium text-sm transition-all duration-200
        ${!day ? 'invisible' : ''}
        ${isDateAvailable(day)
                                                                ? selectedDate?.getDate() === day &&
                                                                    selectedDate?.getMonth() === currentMonth &&
                                                                    selectedDate?.getFullYear() === currentYear
                                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                                    : 'hover:bg-green-50 text-gray-700'
                                                                : 'text-gray-300 cursor-not-allowed'
                                                            }
      `}
                                                    >
                                                        {day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Time slots */}
                                        {selectedDate && (
                                            <div className="animate-fadeIn">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Alege ora:</h4>
                                                <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                                    {timeSlots.map((time) => (
                                                        <button
                                                            key={time}
                                                            onClick={() => handleTimeSelect(time)}
                                                            className={`
                                py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                                ${selectedTime === time
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-green-50'
                                                                }
                              `}
                                                        >
                                                            {time}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Step 2: Contact details */
                                    <div className="space-y-4 animate-fadeIn">
                                        {/* Selected date/time summary */}
                                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                            <p className="text-sm text-green-800">
                                                <span className="font-semibold">📅 Data selectată:</span>{' '}
                                                {selectedDate?.toLocaleDateString('ro-RO', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}, ora {selectedTime}
                                            </p>
                                        </div>

                                        {/* Phone input */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Număr de telefon *
                                            </label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="07XX XXX XXX"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                            />
                                        </div>

                                        {/* Message textarea */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Mesaj (opțional)
                                            </label>
                                            <textarea
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Spune-i nutriționistului despre ce ai vrea să discutați..."
                                                rows={4}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                                            />
                                        </div>

                                        {/* Info message */}
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <p className="text-sm text-blue-800">
                                                💡 Nutriționistul te va contacta pentru a confirma programarea și pentru a discuta detaliile consultației.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <div className="flex gap-3">
                                    {step === 2 && (
                                        <button
                                            onClick={() => setStep(1)}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
                                        >
                                            Înapoi
                                        </button>
                                    )}

                                    {step === 1 ? (
                                        <button
                                            onClick={handleNext}
                                            disabled={!selectedDate || !selectedTime}
                                            className={`
                        flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200
                        ${selectedDate && selectedTime
                                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }
                      `}
                                        >
                                            Continuă
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading || !phone}
                                            className={`
                        flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${loading || !phone
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                }
                      `}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                                    Se trimite...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Trimite programarea
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </>
    )
}

export default BookingModal;
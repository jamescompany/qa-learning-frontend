import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../../components/common/Header';
import TestingGuide from '../../components/qa/TestingGuide';
import { useAuthStore } from '../../store/authStore';
import { createPlaceholderImage } from '../../utils/placeholderImage';
import { formatCurrency, convertCurrency } from '../../utils/currency';

interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
}

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
}

const BookingSystemPage = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleBookingId, setRescheduleBookingId] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState('');
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<any>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('week');
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [filterStaff, setFilterStaff] = useState('all');
  const [sortPrice, setSortPrice] = useState<'asc' | 'desc' | null>(null);

  // Convert prices based on locale
  const convertPrice = (usdPrice: number) => {
    return convertCurrency(usdPrice, 'en', i18n.language);
  };

  const services: Service[] = [
    { id: 'haircut', name: t('bookingSystem.services.haircut.name'), duration: '45 min', price: convertPrice(65), description: t('bookingSystem.services.haircut.description') },
    { id: 'color', name: t('bookingSystem.services.color.name'), duration: '2 hours', price: convertPrice(120), description: t('bookingSystem.services.color.description') },
    { id: 'highlights', name: t('bookingSystem.services.highlights.name'), duration: '2.5 hours', price: convertPrice(150), description: t('bookingSystem.services.highlights.description') },
    { id: 'treatment', name: t('bookingSystem.services.treatment.name'), duration: '30 min', price: convertPrice(45), description: t('bookingSystem.services.treatment.description') },
    { id: 'blowdry', name: t('bookingSystem.services.blowdry.name'), duration: '30 min', price: convertPrice(35), description: t('bookingSystem.services.blowdry.description') },
    { id: 'consultation', name: t('bookingSystem.services.consultation.name'), duration: '15 min', price: 0, description: t('bookingSystem.services.consultation.description') },
  ];

  const staff = [
    { id: '1', name: 'Emma Johnson', specialty: t('bookingSystem.staff.colorSpecialist'), rating: 4.9, image: createPlaceholderImage(60, 60, 'EJ') },
    { id: '2', name: 'Michael Chen', specialty: t('bookingSystem.staff.seniorStylist'), rating: 4.8, image: createPlaceholderImage(60, 60, 'MC') },
    { id: '3', name: 'Sarah Williams', specialty: t('bookingSystem.staff.hairDesigner'), rating: 4.7, image: createPlaceholderImage(60, 60, 'SW') },
    { id: '4', name: 'Any Available', specialty: t('bookingSystem.staff.anyAvailable'), rating: 0, image: createPlaceholderImage(60, 60, '?') },
  ];

  const addons = [
    { id: 'shampoo', name: t('bookingSystem.addons.shampoo'), price: convertPrice(10) },
    { id: 'massage', name: t('bookingSystem.addons.massage'), price: convertPrice(15) },
    { id: 'refreshment', name: t('bookingSystem.addons.refreshment'), price: 0 },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true, price: convertPrice(65) },
    { time: '09:30', available: true, price: convertPrice(65) },
    { time: '10:00', available: false, price: convertPrice(65) },
    { time: '10:30', available: true, price: convertPrice(65) },
    { time: '11:00', available: true, price: convertPrice(65) },
    { time: '11:30', available: false, price: convertPrice(65) },
    { time: '12:00', available: true, price: convertPrice(75) },
    { time: '12:30', available: true, price: convertPrice(75) },
    { time: '14:00', available: true, price: convertPrice(75) },
    { time: '14:30', available: false, price: convertPrice(75) },
    { time: '15:00', available: true, price: convertPrice(75) },
    { time: '15:30', available: true, price: convertPrice(75) },
    { time: '16:00', available: true, price: convertPrice(65) },
    { time: '16:30', available: false, price: convertPrice(65) },
    { time: '17:00', available: true, price: convertPrice(65) },
    { time: '17:30', available: true, price: convertPrice(65) },
  ];

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, '');
    // Check if it has at least 10 digits
    return digitsOnly.length >= 10;
  };

  const isStep4Valid = (): boolean => {
    return (
      customerName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      validateEmail(customerEmail) &&
      customerPhone.trim() !== '' &&
      validatePhone(customerPhone) &&
      termsAccepted
    );
  };

  const canProceedToNext = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!selectedService;
      case 2:
        return !!selectedDate && !!selectedTime;
      case 3:
        return !!selectedStaff;
      case 4:
        return isStep4Valid();
      default:
        return false;
    }
  };

  const getDaysInMonth = () => {
    const days = [];
    const startDate = viewMode === 'month' 
      ? new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      : new Date();
    const daysCount = viewMode === 'month' ? 30 : 14;
    
    for (let i = 0; i < daysCount; i++) {
      const date = new Date(startDate);
      if (viewMode === 'month') {
        date.setDate(i + 1);
      } else {
        date.setDate(startDate.getDate() + i);
      }
      days.push(date);
    }
    return days;
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const handleJoinWaitlist = () => {
    if (!waitlistEmail || !validateEmail(waitlistEmail)) {
      toast.error('Please enter a valid email');
      return;
    }
    toast.success('You\'ve been added to the waitlist. We\'ll notify you when a slot opens up!');
    setShowWaitlistModal(false);
    setWaitlistEmail('');
  };

  const getFilteredTimeSlots = () => {
    let slots = [...timeSlots];
    if (sortPrice === 'asc') {
      slots.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortPrice === 'desc') {
      slots.sort((a, b) => (b.price || 0) - (a.price || 0));
    }
    return slots;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedService) {
      toast.error(t('bookingSystem.validation.selectService'));
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      if (!selectedDate) {
        toast.error(t('bookingSystem.validation.selectDate'));
      } else if (!selectedTime) {
        toast.error(t('bookingSystem.validation.selectTime'));
      }
      return;
    }
    if (currentStep === 3 && !selectedStaff) {
      toast.error(t('bookingSystem.validation.selectSpecialist'));
      return;
    }
    if (currentStep === 4) {
      if (!customerName.trim()) {
        toast.error(t('bookingSystem.validation.enterName'));
        return;
      }
      if (!customerEmail.trim()) {
        toast.error(t('bookingSystem.validation.enterEmail'));
        return;
      }
      if (!validateEmail(customerEmail)) {
        toast.error(t('bookingSystem.validation.invalidEmail'));
        return;
      }
      if (!customerPhone.trim()) {
        toast.error(t('bookingSystem.validation.enterPhone'));
        return;
      }
      if (!validatePhone(customerPhone)) {
        toast.error(t('bookingSystem.validation.invalidPhone'));
        return;
      }
      if (!termsAccepted) {
        toast.error(t('bookingSystem.validation.acceptTerms'));
        return;
      }
      handleBookingSubmit();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = () => {
    const reference = `BK${Date.now().toString().slice(-6)}`;
    setBookingReference(reference);
    setShowConfirmModal(true);
  };

  const handleConfirmBooking = () => {
    // Save booking to localStorage
    const newBooking = {
      id: bookingReference,
      service: services.find(s => s.id === selectedService)?.name,
      date: selectedDate,
      time: selectedTime,
      staff: staff.find(s => s.id === selectedStaff)?.name,
      customerName,
      customerEmail,
      customerPhone,
      total: calculateTotal(),
      status: 'confirmed',
      addons: selectedAddons.map(id => addons.find(a => a.id === id)?.name).filter(Boolean),
      notes,
      createdAt: new Date().toISOString()
    };
    
    const existingBookings = JSON.parse(localStorage.getItem('qa-bookings') || '[]');
    localStorage.setItem('qa-bookings', JSON.stringify([...existingBookings, newBooking]));
    
    toast.success(t('bookingSystem.messages.bookingConfirmed', { reference: bookingReference }));
    setShowConfirmModal(false);
    // Reset form
    setCurrentStep(1);
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedStaff('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    setNotes('');
    setSelectedAddons([]);
    setTermsAccepted(false);
    setPromoCode('');
    setPromoDiscount(0);
  };

  const calculateTotal = () => {
    const service = services.find(s => s.id === selectedService);
    const basePrice = service?.price || 0;
    const addonPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    const subtotal = basePrice + addonPrice;
    const discount = subtotal * (promoDiscount / 100);
    return subtotal - discount;
  };

  const handleApplyPromoCode = () => {
    // Simulated promo codes
    const promoCodes: Record<string, number> = {
      'SAVE10': 10,
      'SAVE20': 20,
      'FIRSTTIME': 15,
      'WELCOME': 25
    };
    
    const discount = promoCodes[promoCode.toUpperCase()];
    if (discount) {
      setPromoDiscount(discount);
      toast.success(`Promo code applied! ${discount}% off`);
    } else {
      toast.error('Invalid promo code');
      setPromoDiscount(0);
    }
  };

  const handleReschedule = (bookingId: string) => {
    setRescheduleBookingId(bookingId);
    setShowRescheduleModal(true);
  };

  const confirmReschedule = () => {
    const bookings = JSON.parse(localStorage.getItem('qa-bookings') || '[]');
    const updatedBookings = bookings.map((b: any) => 
      b.id === rescheduleBookingId ? { ...b, status: 'rescheduled', date: selectedDate, time: selectedTime } : b
    );
    localStorage.setItem('qa-bookings', JSON.stringify(updatedBookings));
    setMyBookings(updatedBookings);
    toast.success('Appointment rescheduled successfully');
    setShowRescheduleModal(false);
    setRescheduleBookingId('');
  };

  const handleCancelBooking = (bookingId: string) => {
    setCancelBookingId(bookingId);
    setShowCancelModal(true);
  };

  const confirmCancellation = () => {
    const bookings = JSON.parse(localStorage.getItem('qa-bookings') || '[]');
    const updatedBookings = bookings.map((b: any) => 
      b.id === cancelBookingId ? { ...b, status: 'cancelled' } : b
    );
    localStorage.setItem('qa-bookings', JSON.stringify(updatedBookings));
    setMyBookings(updatedBookings);
    toast.success('Booking cancelled successfully');
    setShowCancelModal(false);
    setCancelBookingId('');
  };

  const handleShowReceipt = (booking: any) => {
    setCurrentReceipt(booking);
    setShowReceiptModal(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleEmailReceipt = () => {
    toast.success('Receipt has been emailed to ' + (currentReceipt?.customerEmail || customerEmail));
  };

  const toggleAddon = (addonId: string) => {
    setSelectedAddons(prev => 
      prev.includes(addonId) 
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Common Header */}
      <Header 
        isAuthenticated={isAuthenticated}
        userName={user?.full_name || user?.username || user?.email}
        onLogout={logout}
      />
      
      {/* Booking Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700" data-testid="booking-header">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('bookingSystem.header.title')}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('bookingSystem.header.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  // Load saved bookings from localStorage
                  const savedBookings = JSON.parse(localStorage.getItem('qa-bookings') || '[]');
                  setMyBookings(savedBookings);
                  setShowMyBookings(true);
                }}
                className="text-blue-600 dark:text-blue-400 hover:underline" 
                data-testid="view-bookings-btn"
              >
                {t('bookingSystem.header.myBookings')}
              </button>
              <button 
                onClick={() => setShowHelpModal(true)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" 
                data-testid="help-btn"
              >
                {t('bookingSystem.header.help')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Testing Guide */}
        <TestingGuide
          title={t('bookingSystem.testingGuide.title')}
          description={t('bookingSystem.testingGuide.description')}
          scenarios={[
            {
              id: 'multi-step-flow',
              title: t('bookingSystem.scenarios.multiStepFlow.title'),
              description: t('bookingSystem.scenarios.multiStepFlow.description'),
              steps: t('bookingSystem.scenarios.multiStepFlow.steps', { returnObjects: true }) as string[],
              expectedResult: t('bookingSystem.scenarios.multiStepFlow.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'calendar-navigation',
              title: t('bookingSystem.scenarios.calendarNavigation.title'),
              description: t('bookingSystem.scenarios.calendarNavigation.description'),
              steps: t('bookingSystem.scenarios.calendarNavigation.steps', { returnObjects: true }) as string[],
              expectedResult: t('bookingSystem.scenarios.calendarNavigation.expectedResult'),
              difficulty: 'easy'
            },
            {
              id: 'time-slot-availability',
              title: t('bookingSystem.scenarios.timeSlotAvailability.title'),
              description: t('bookingSystem.scenarios.timeSlotAvailability.description'),
              steps: t('bookingSystem.scenarios.timeSlotAvailability.steps', { returnObjects: true }) as string[],
              expectedResult: t('bookingSystem.scenarios.timeSlotAvailability.expectedResult'),
              difficulty: 'easy'
            },
            {
              id: 'form-validation',
              title: t('bookingSystem.scenarios.formValidation.title'),
              description: t('bookingSystem.scenarios.formValidation.description'),
              steps: t('bookingSystem.scenarios.formValidation.steps', { returnObjects: true }) as string[],
              expectedResult: t('bookingSystem.scenarios.formValidation.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'step-navigation',
              title: t('bookingSystem.scenarios.stepNavigation.title'),
              description: t('bookingSystem.scenarios.stepNavigation.description'),
              steps: t('bookingSystem.scenarios.stepNavigation.steps', { returnObjects: true }) as string[],
              expectedResult: t('bookingSystem.scenarios.stepNavigation.expectedResult'),
              difficulty: 'medium'
            },
            {
              id: 'addon-selection',
              title: t('bookingSystem.scenarios.addonSelection.title'),
              description: t('bookingSystem.scenarios.addonSelection.description'),
              steps: t('bookingSystem.scenarios.addonSelection.steps', { returnObjects: true }) as string[],
              expectedResult: t('bookingSystem.scenarios.addonSelection.expectedResult'),
              difficulty: 'hard'
            }
          ]}
          tips={t('bookingSystem.tips', { returnObjects: true }) as string[]}
          dataTestIds={t('bookingSystem.testIds', { returnObjects: true }) as Array<{ element: string; description: string }>}
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/qa')}
          className="mb-6 inline-flex items-center px-5 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-md hover:from-purple-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          data-testid="back-to-qa-hub"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('bookingSystem.backButton')}
        </button>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    currentStep >= step
                      ? 'bg-blue-600 dark:bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                  data-testid={`step-${step}`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`w-20 h-1 ${
                      currentStep > step ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 text-sm">
            <div className="flex space-x-16">
              <span className={currentStep >= 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>{t('bookingSystem.steps.service')}</span>
              <span className={currentStep >= 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>{t('bookingSystem.steps.dateTime')}</span>
              <span className={currentStep >= 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>{t('bookingSystem.steps.staff')}</span>
              <span className={currentStep >= 4 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>{t('bookingSystem.steps.details')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              {/* Step 1: Select Service */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('bookingSystem.serviceSelection.title')}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedService === service.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                        }`}
                        data-testid={`service-${service.id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className={`font-semibold ${
                            selectedService === service.id 
                              ? 'text-blue-700 dark:text-blue-300' 
                              : 'text-gray-900 dark:text-gray-100'
                          }`}>{service.name}</h3>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {service.price === 0 ? t('bookingSystem.serviceSelection.free') : formatCurrency(service.price, i18n.language)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{service.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('bookingSystem.serviceSelection.duration')}: {service.duration}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add-ons */}
                  {selectedService && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('bookingSystem.serviceSelection.optionalAddons')}</h3>
                      <div className="space-y-2">
                        {addons.map((addon) => (
                          <label
                            key={addon.id}
                            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                            data-testid={`addon-${addon.id}`}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedAddons.includes(addon.id)}
                                onChange={() => toggleAddon(addon.id)}
                                className="mr-3 w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
                              />
                              <span className="text-gray-900 dark:text-gray-100">{addon.name}</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {addon.price === 0 ? t('bookingSystem.serviceSelection.free') : `+${formatCurrency(addon.price, i18n.language)}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Select Date & Time */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('bookingSystem.dateTimeSelection.title')}</h2>
                  
                  {/* Calendar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('bookingSystem.dateTimeSelection.chooseDate')}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewMode(viewMode === 'week' ? 'month' : 'week')}
                          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                          data-testid="view-mode-toggle"
                        >
                          {viewMode === 'week' ? 'Month View' : 'Week View'}
                        </button>
                        {viewMode === 'month' && (
                          <>
                            <button
                              onClick={() => handleMonthChange('prev')}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              data-testid="prev-month"
                            >
                              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                              </svg>
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                            <button
                              onClick={() => handleMonthChange('next')}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                              data-testid="next-month"
                            >
                              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {viewMode === 'week' && (
                        <>
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                              {day}
                            </div>
                          ))}
                        </>
                      )}
                      {getDaysInMonth().map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const isSelected = selectedDate === dateStr;
                        const isSunday = date.getDay() === 0;
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(dateStr)}
                            className={`p-2 rounded-lg text-center transition-all ${
                              isSelected
                                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                            data-testid={`date-${index}`}
                          >
                            <div className={`text-xs ${
                              isSelected
                                ? 'text-white'
                                : isSunday
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                            <div className={`font-semibold ${
                              isSelected
                                ? 'text-white'
                                : isSunday
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>{date.getDate()}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">{t('bookingSystem.dateTimeSelection.availableTimeSlots')}</h3>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSortPrice(sortPrice === 'asc' ? 'desc' : sortPrice === 'desc' ? null : 'asc')}
                            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100"
                            data-testid="sort-price"
                          >
                            Price {sortPrice === 'asc' ? '↑' : sortPrice === 'desc' ? '↓' : '↕'}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {getFilteredTimeSlots().map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => {
                              if (slot.available) {
                                setSelectedTime(slot.time);
                                // Calculate duration based on selected service
                                const service = services.find(s => s.id === selectedService);
                                if (service) {
                                  const duration = parseInt(service.duration) || 30;
                                  setSelectedDuration(duration);
                                }
                              } else {
                                setShowWaitlistModal(true);
                              }
                            }}
                            disabled={false}
                            className={`p-2 rounded-lg text-sm transition-all ${
                              selectedTime === slot.time
                                ? 'bg-blue-600 dark:bg-blue-500 text-white'
                                : slot.available
                                ? 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                            data-testid={`time-${slot.time}`}
                          >
                            <div className={selectedTime === slot.time ? 'text-white' : 'text-gray-900 dark:text-gray-100'}>{slot.time}</div>
                            {slot.price && slot.available && (
                              <div className={`text-xs mt-1 ${
                                selectedTime === slot.time 
                                  ? 'text-white' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>{formatCurrency(slot.price || 0, i18n.language)}</div>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        {t('bookingSystem.dateTimeSelection.peakHoursPricing')}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Select Staff */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('bookingSystem.staffSelection.title')}</h2>
                  <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">Filter by specialty:</label>
                    <select
                      value={filterStaff}
                      onChange={(e) => setFilterStaff(e.target.value)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      data-testid="filter-staff"
                    >
                      <option value="all">All Specialists</option>
                      <option value="color">Color Specialist</option>
                      <option value="senior">Senior Stylist</option>
                      <option value="designer">Hair Designer</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff
                      .filter(member => {
                        if (filterStaff === 'all') return true;
                        if (filterStaff === 'color') return member.specialty.includes('Color');
                        if (filterStaff === 'senior') return member.specialty.includes('Senior');
                        if (filterStaff === 'designer') return member.specialty.includes('Designer');
                        return true;
                      })
                      .map((member) => (
                      <div
                        key={member.id}
                        onClick={() => setSelectedStaff(member.id)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedStaff === member.id
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 bg-white dark:bg-gray-800'
                        }`}
                        data-testid={`staff-${member.id}`}
                      >
                        <div className="flex items-center space-x-3">
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1">
                            <h3 className={`font-semibold ${
                              selectedStaff === member.id 
                                ? 'text-blue-700 dark:text-blue-300' 
                                : 'text-gray-900 dark:text-gray-100'
                            }`}>{member.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{member.specialty}</p>
                            {member.rating > 0 && (
                              <div className="flex items-center mt-1">
                                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm ml-1 text-gray-900 dark:text-gray-100">{member.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Contact Details */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('bookingSystem.customerDetails.title')}</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('bookingSystem.customerDetails.fullName')}
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                          customerName && !customerName.trim()
                            ? 'border-red-500 dark:border-red-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('bookingSystem.customerDetails.placeholders.name')}
                        data-testid="customer-name"
                      />
                      {customerName && !customerName.trim() && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{t('bookingSystem.validation.nameRequired')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('bookingSystem.customerDetails.email')}
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                          customerEmail && !validateEmail(customerEmail)
                            ? 'border-red-500 dark:border-red-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('bookingSystem.customerDetails.placeholders.email')}
                        data-testid="customer-email"
                      />
                      {customerEmail && !validateEmail(customerEmail) && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{t('bookingSystem.validation.emailRequired')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('bookingSystem.customerDetails.phone')}
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                          customerPhone && !validatePhone(customerPhone)
                            ? 'border-red-500 dark:border-red-400'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={t('bookingSystem.customerDetails.placeholders.phone')}
                        data-testid="customer-phone"
                      />
                      {customerPhone && !validatePhone(customerPhone) && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-1">{t('bookingSystem.validation.phoneRequired')}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('bookingSystem.customerDetails.guestCount')}
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        data-testid="guest-count"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? t('bookingSystem.customerDetails.person') : t('bookingSystem.customerDetails.people')}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('bookingSystem.customerDetails.specialRequests')}
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        rows={3}
                        placeholder={t('bookingSystem.customerDetails.placeholders.requests')}
                        data-testid="special-requests"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('bookingSystem.customerDetails.paymentMethod') || 'Payment Method'}
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        data-testid="payment-method"
                      >
                        <option value="credit">Credit Card</option>
                        <option value="debit">Debit Card</option>
                        <option value="paypal">PayPal</option>
                        <option value="cash">Pay at Venue</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Promo Code
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Enter promo code"
                          data-testid="promo-code"
                        />
                        <button
                          onClick={handleApplyPromoCode}
                          className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
                          data-testid="apply-promo-btn"
                        >
                          Apply
                        </button>
                      </div>
                      {promoDiscount > 0 && (
                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                          {promoDiscount}% discount applied!
                        </p>
                      )}
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="reminder"
                        checked={reminderEnabled}
                        onChange={(e) => setReminderEnabled(e.target.checked)}
                        className="mt-1 mr-2 w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
                        data-testid="reminder-checkbox"
                      />
                      <label htmlFor="reminder" className="text-sm text-gray-600 dark:text-gray-400">
                        Send me appointment reminders via email and SMS
                      </label>
                    </div>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="mt-1 mr-2 w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2"
                        data-testid="terms-checkbox"
                      />
                      <label htmlFor="terms" className={`text-sm ${termsAccepted ? 'text-gray-600 dark:text-gray-400' : 'text-red-500 dark:text-red-400'}`.trim()}>
                        {t('bookingSystem.customerDetails.termsAndConditions')}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-2 rounded-lg ${
                    currentStep === 1
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'bg-gray-600 dark:bg-gray-500 text-white hover:bg-gray-700 dark:hover:bg-gray-600'
                  }`}
                  data-testid="previous-btn"
                >
                  {t('bookingSystem.navigation.previous')}
                </button>
                <button
                  onClick={handleNextStep}
                  disabled={!canProceedToNext()}
                  className={`px-6 py-2 rounded-lg text-white transition-all ${
                    canProceedToNext()
                      ? 'bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer'
                      : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-60'
                  }`}
                  data-testid="next-btn"
                >
                  {currentStep === 4 ? t('bookingSystem.navigation.bookAppointment') : t('bookingSystem.navigation.next')}
                </button>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('bookingSystem.summary.title')}</h3>
              
              {selectedService && (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">{t('bookingSystem.summary.service')}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {services.find(s => s.id === selectedService)?.name}
                    </p>
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">{t('bookingSystem.summary.date')}</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(new Date(selectedDate))}
                      </p>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">{t('bookingSystem.summary.time')}</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{selectedTime}</p>
                    </div>
                  )}
                  
                  {selectedStaff && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">{t('bookingSystem.summary.specialist')}</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {staff.find(s => s.id === selectedStaff)?.name}
                      </p>
                    </div>
                  )}

                  {selectedAddons.length > 0 && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">{t('bookingSystem.summary.addons')}</p>
                      {selectedAddons.map(addonId => {
                        const addon = addons.find(a => a.id === addonId);
                        return addon ? (
                          <p key={addonId} className="font-medium text-gray-900 dark:text-gray-100">
                            {addon.name} {addon.price > 0 && `(+$${addon.price})`}
                          </p>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  <div className="border-t dark:border-gray-600 pt-3">
                    {promoDiscount > 0 && (
                      <>
                        <div className="flex justify-between text-sm mb-2">
                          <p className="text-gray-500 dark:text-gray-400">Subtotal</p>
                          <p className="text-gray-900 dark:text-gray-100">
                            {formatCurrency((services.find(s => s.id === selectedService)?.price || 0) + selectedAddons.reduce((sum, id) => sum + (addons.find(a => a.id === id)?.price || 0), 0), i18n.language)}
                          </p>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                          <p className="text-green-600 dark:text-green-400">Discount ({promoDiscount}%)</p>
                          <p className="text-green-600 dark:text-green-400">
                            -{formatCurrency(((services.find(s => s.id === selectedService)?.price || 0) + selectedAddons.reduce((sum, id) => sum + (addons.find(a => a.id === id)?.price || 0), 0)) * (promoDiscount / 100), i18n.language)}
                          </p>
                        </div>
                      </>
                    )}
                    <div className="flex justify-between">
                      <p className="text-gray-500 dark:text-gray-400">{t('bookingSystem.summary.total')}</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {formatCurrency(calculateTotal(), i18n.language)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!selectedService && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {t('bookingSystem.summary.selectService')}
                </p>
              )}

              {/* Policies */}
              <div className="mt-6 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <p>✓ {t('bookingSystem.summary.policies.cancellation')}</p>
                <p>✓ {t('bookingSystem.summary.policies.confirmation')}</p>
                <p>✓ {t('bookingSystem.summary.policies.payment')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Bookings Modal */}
      {showMyBookings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto" data-testid="my-bookings-modal">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Bookings</h3>
              <button
                onClick={() => setShowMyBookings(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {myBookings.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No bookings found</p>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => (
                  <div key={booking.id} className="border dark:border-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                          {booking.service}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          with {booking.staff}
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-1">
                          Total: {formatCurrency(booking.total, i18n.language)}
                        </p>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <span className={`px-2 py-1 text-xs rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
                          {booking.status}
                        </span>
                        {booking.status === 'confirmed' && (
                          <>
                            <button
                              onClick={() => handleReschedule(booking.id)}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              data-testid={`reschedule-${booking.id}`}
                            >
                              Reschedule
                            </button>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="text-sm text-red-600 dark:text-red-400 hover:underline"
                              data-testid={`cancel-${booking.id}`}
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleShowReceipt(booking)}
                          className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                          data-testid={`receipt-${booking.id}`}
                        >
                          View Receipt
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowMyBookings(false)}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="help-modal">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Help & Support</h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Frequently Asked Questions</h4>
                <div className="space-y-2 text-sm">
                  <details className="cursor-pointer">
                    <summary className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">How do I cancel my booking?</summary>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 pl-4">You can cancel your booking up to 24 hours before your appointment through the "My Bookings" section.</p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">Can I reschedule my appointment?</summary>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 pl-4">Yes, you can reschedule your appointment anytime through the "My Bookings" section.</p>
                  </details>
                  <details className="cursor-pointer">
                    <summary className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100">What payment methods are accepted?</summary>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 pl-4">We accept credit cards, debit cards, PayPal, and cash payments at the venue.</p>
                  </details>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Contact Us</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phone: 1-800-BOOKING<br />
                  Email: support@bookingsystem.com<br />
                  Live Chat: Available 24/7
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  toast.success('Live chat opened');
                  setShowHelpModal(false);
                }}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                data-testid="live-chat-btn"
              >
                Start Live Chat
              </button>
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="reschedule-modal">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Reschedule Appointment</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Please select a new date and time for your appointment.
            </p>
            <div className="space-y-4">
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                min={new Date().toISOString().split('T')[0]}
              />
              <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                <option>Select time</option>
                {timeSlots.filter(s => s.available).map(slot => (
                  <option key={slot.time} value={slot.time}>{slot.time}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                data-testid="confirm-reschedule"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Booking Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="cancel-modal">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                ⚠️ Cancellation Policy: Free cancellation up to 24 hours before appointment. Late cancellations may incur a fee.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Keep Booking
              </button>
              <button
                onClick={confirmCancellation}
                className="px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
                data-testid="confirm-cancel"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && currentReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="receipt-modal">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Booking Receipt</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reference: {currentReceipt.id}</p>
            </div>
            
            <div className="border-t border-b dark:border-gray-700 py-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Service:</span>
                <span className="text-gray-900 dark:text-gray-100">{currentReceipt.service}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="text-gray-900 dark:text-gray-100">{new Date(currentReceipt.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Time:</span>
                <span className="text-gray-900 dark:text-gray-100">{currentReceipt.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Specialist:</span>
                <span className="text-gray-900 dark:text-gray-100">{currentReceipt.staff}</span>
              </div>
              {currentReceipt.addons && currentReceipt.addons.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Add-ons:</span>
                  <span className="text-gray-900 dark:text-gray-100">{currentReceipt.addons.join(', ')}</span>
                </div>
              )}
            </div>
            
            <div className="py-4">
              <div className="flex justify-between font-bold">
                <span className="text-gray-900 dark:text-gray-100">Total Paid:</span>
                <span className="text-blue-600 dark:text-blue-400">{formatCurrency(currentReceipt.total, i18n.language)}</span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleEmailReceipt}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                data-testid="email-receipt"
              >
                Email Receipt
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                data-testid="print-receipt"
              >
                Print
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2 bg-gray-600 dark:bg-gray-500 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="confirm-modal">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('bookingSystem.confirmationModal.title')}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('bookingSystem.confirmationModal.message')}
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('bookingSystem.confirmationModal.reference')}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100" data-testid="booking-reference">
                  {bookingReference}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {t('bookingSystem.confirmationModal.emailSent', { email: customerEmail })}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                  data-testid="confirm-ok"
                >
                  {t('bookingSystem.confirmationModal.ok')}
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  data-testid="print-btn"
                >
                  {t('bookingSystem.confirmationModal.print')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full" data-testid="waitlist-modal">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Join Waitlist</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This time slot is currently unavailable. Join our waitlist and we'll notify you if it becomes available.
            </p>
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 mb-4"
              data-testid="waitlist-email"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowWaitlistModal(false);
                  setWaitlistEmail('');
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleJoinWaitlist}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                data-testid="join-waitlist"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystemPage;
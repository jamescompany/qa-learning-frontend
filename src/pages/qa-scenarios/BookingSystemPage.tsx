import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import TestingGuide from '../../components/qa/TestingGuide';
import { useAuthStore } from '../../store/authStore';
import { createPlaceholderImage } from '../../utils/placeholderImage';

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

  const services: Service[] = [
    { id: 'haircut', name: 'Haircut & Style', duration: '45 min', price: 65, description: 'Professional haircut with styling' },
    { id: 'color', name: 'Hair Color', duration: '2 hours', price: 120, description: 'Full color treatment' },
    { id: 'highlights', name: 'Highlights', duration: '2.5 hours', price: 150, description: 'Partial or full highlights' },
    { id: 'treatment', name: 'Deep Treatment', duration: '30 min', price: 45, description: 'Nourishing hair treatment' },
    { id: 'blowdry', name: 'Blow Dry', duration: '30 min', price: 35, description: 'Professional blow dry and style' },
    { id: 'consultation', name: 'Consultation', duration: '15 min', price: 0, description: 'Free consultation' },
  ];

  const staff = [
    { id: '1', name: 'Emma Johnson', specialty: 'Color Specialist', rating: 4.9, image: createPlaceholderImage(60, 60, 'EJ') },
    { id: '2', name: 'Michael Chen', specialty: 'Senior Stylist', rating: 4.8, image: createPlaceholderImage(60, 60, 'MC') },
    { id: '3', name: 'Sarah Williams', specialty: 'Hair Designer', rating: 4.7, image: createPlaceholderImage(60, 60, 'SW') },
    { id: '4', name: 'Any Available', specialty: 'First Available', rating: 0, image: createPlaceholderImage(60, 60, '?') },
  ];

  const addons = [
    { id: 'shampoo', name: 'Premium Shampoo', price: 10 },
    { id: 'massage', name: 'Scalp Massage', price: 15 },
    { id: 'refreshment', name: 'Complimentary Refreshments', price: 0 },
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true, price: 65 },
    { time: '09:30', available: true, price: 65 },
    { time: '10:00', available: false, price: 65 },
    { time: '10:30', available: true, price: 65 },
    { time: '11:00', available: true, price: 65 },
    { time: '11:30', available: false, price: 65 },
    { time: '12:00', available: true, price: 75 },
    { time: '12:30', available: true, price: 75 },
    { time: '14:00', available: true, price: 75 },
    { time: '14:30', available: false, price: 75 },
    { time: '15:00', available: true, price: 75 },
    { time: '15:30', available: true, price: 75 },
    { time: '16:00', available: true, price: 65 },
    { time: '16:30', available: false, price: 65 },
    { time: '17:00', available: true, price: 65 },
    { time: '17:30', available: true, price: 65 },
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
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && !selectedService) {
      toast.error('Please select a service');
      return;
    }
    if (currentStep === 2 && (!selectedDate || !selectedTime)) {
      if (!selectedDate) {
        toast.error('Please select a date');
      } else if (!selectedTime) {
        toast.error('Please select a time');
      }
      return;
    }
    if (currentStep === 3 && !selectedStaff) {
      toast.error('Please select a specialist');
      return;
    }
    if (currentStep === 4) {
      if (!customerName.trim()) {
        toast.error('Please enter your name');
        return;
      }
      if (!customerEmail.trim()) {
        toast.error('Please enter your email');
        return;
      }
      if (!validateEmail(customerEmail)) {
        toast.error('Please enter a valid email address');
        return;
      }
      if (!customerPhone.trim()) {
        toast.error('Please enter your phone number');
        return;
      }
      if (!validatePhone(customerPhone)) {
        toast.error('Please enter a valid phone number (at least 10 digits)');
        return;
      }
      if (!termsAccepted) {
        toast.error('Please accept the terms and conditions');
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
    toast.success(`Booking confirmed! Reference: ${bookingReference}`);
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
  };

  const calculateTotal = () => {
    const service = services.find(s => s.id === selectedService);
    const basePrice = service?.price || 0;
    const addonPrice = selectedAddons.reduce((sum, addonId) => {
      const addon = addons.find(a => a.id === addonId);
      return sum + (addon?.price || 0);
    }, 0);
    return basePrice + addonPrice;
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Luxury Salon & Spa</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Book your appointment online</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 dark:text-blue-400 hover:underline" data-testid="view-bookings-btn">
                My Bookings
              </button>
              <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" data-testid="help-btn">
                Help
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Testing Guide */}
        <TestingGuide
          title="Booking System Testing Guide"
          description="Test multi-step booking flows, calendar interactions, and validation logic"
          scenarios={[
            {
              id: 'multi-step-flow',
              title: 'Complete Booking Flow',
              description: 'Test the entire multi-step booking process',
              steps: [
                'Select a service (e.g., Haircut & Style)',
                'Click Next to proceed to step 2',
                'Select a date from calendar',
                'Choose an available time slot',
                'Click Next to step 3',
                'Select a staff member',
                'Click Next to step 4',
                'Fill in customer details',
                'Submit booking',
                'Verify confirmation and booking reference'
              ],
              expectedResult: 'Booking completes with confirmation number',
              difficulty: 'medium'
            },
            {
              id: 'calendar-navigation',
              title: 'Calendar Date Selection',
              description: 'Test calendar navigation and date restrictions',
              steps: [
                'Navigate to calendar step',
                'Try selecting past date',
                'Verify past dates are disabled',
                'Navigate to next month',
                'Select a weekend date',
                'Check if weekends have different availability',
                'Select a valid future date'
              ],
              expectedResult: 'Only valid future dates can be selected',
              difficulty: 'easy'
            },
            {
              id: 'time-slot-availability',
              title: 'Time Slot Management',
              description: 'Test time slot selection and availability',
              steps: [
                'Select a date',
                'View available time slots',
                'Try selecting unavailable slot (grayed out)',
                'Verify it cannot be selected',
                'Select available slot',
                'Change date',
                'Verify time slot resets'
              ],
              expectedResult: 'Only available slots can be selected',
              difficulty: 'easy'
            },
            {
              id: 'form-validation',
              title: 'Customer Information Validation',
              description: 'Test form field validations',
              steps: [
                'Navigate to customer info step',
                'Try submitting empty form',
                'Verify required field errors',
                'Enter invalid email format',
                'Verify email validation error',
                'Enter invalid phone number',
                'Verify phone validation',
                'Fill all fields correctly',
                'Submit successfully'
              ],
              expectedResult: 'Form validates all inputs correctly',
              difficulty: 'medium'
            },
            {
              id: 'step-navigation',
              title: 'Step Navigation Control',
              description: 'Test moving between booking steps',
              steps: [
                'Complete step 1',
                'Click Next',
                'Click Back button',
                'Verify data persists',
                'Try skipping to step 3',
                'Verify cannot skip steps',
                'Complete all steps in order'
              ],
              expectedResult: 'Steps must be completed in order',
              difficulty: 'medium'
            },
            {
              id: 'addon-selection',
              title: 'Service Add-ons',
              description: 'Test adding additional services',
              steps: [
                'Select main service',
                'Check available add-ons',
                'Select multiple add-ons',
                'Verify price updates',
                'Verify duration updates',
                'Remove an add-on',
                'Verify price recalculation'
              ],
              expectedResult: 'Add-ons correctly update price and duration',
              difficulty: 'hard'
            }
          ]}
          tips={[
            'Test with different time zones if applicable',
            'Verify booking confirmation email format',
            'Check calendar for holidays and special hours',
            'Test maximum booking limits per day',
            'Verify cancellation and rescheduling options',
            'Test with various guest counts for group bookings'
          ]}
          dataTestIds={[
            { element: 'service-card', description: 'Service selection cards' },
            { element: 'calendar-date', description: 'Calendar date cells' },
            { element: 'time-slot', description: 'Time slot buttons' },
            { element: 'staff-card', description: 'Staff member cards' },
            { element: 'next-step-btn', description: 'Next step button' },
            { element: 'back-step-btn', description: 'Previous step button' },
            { element: 'submit-booking', description: 'Final submit button' },
            { element: 'booking-reference', description: 'Confirmation number' }
          ]}
        />
        
        {/* Back Button */}
        <button
          onClick={() => navigate('/qa')}
          className="mb-6 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          data-testid="back-to-qa-hub"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to QA Testing Playground
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
              <span className={currentStep >= 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>Service</span>
              <span className={currentStep >= 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>Date & Time</span>
              <span className={currentStep >= 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>Staff</span>
              <span className={currentStep >= 4 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'}>Details</span>
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Select a Service</h2>
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
                            {service.price === 0 ? 'Free' : `$${service.price}`}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{service.description}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Duration: {service.duration}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add-ons */}
                  {selectedService && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Optional Add-ons</h3>
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
                              {addon.price === 0 ? 'Free' : `+$${addon.price}`}
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Select Date & Time</h2>
                  
                  {/* Calendar */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Choose a Date</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {getDaysInMonth().slice(0, 14).map((date, index) => {
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
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Available Time Slots</h3>
                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => slot.available && setSelectedTime(slot.time)}
                            disabled={!slot.available}
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
                              }`}>${slot.price}</div>
                            )}
                          </button>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                        Peak hours (12:00-15:00) have premium pricing
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Select Staff */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Choose Your Specialist</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map((member) => (
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
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Your Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Full Name *
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
                        placeholder="John Doe"
                        data-testid="customer-name"
                      />
                      {customerName && !customerName.trim() && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-1">Name is required</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Address *
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
                        placeholder="john@example.com"
                        data-testid="customer-email"
                      />
                      {customerEmail && !validateEmail(customerEmail) && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-1">Please enter a valid email address</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number *
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
                        placeholder="+1 (555) 000-0000"
                        data-testid="customer-phone"
                      />
                      {customerPhone && !validatePhone(customerPhone) && (
                        <p className="text-sm text-red-500 dark:text-red-400 mt-1">Please enter at least 10 digits</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Number of Guests
                      </label>
                      <select
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        data-testid="guest-count"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Person' : 'People'}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        rows={3}
                        placeholder="Any special requirements or preferences..."
                        data-testid="special-requests"
                      />
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
                        I agree to the terms and conditions and cancellation policy *
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
                  Previous
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
                  {currentStep === 4 ? 'Book Appointment' : 'Next'}
                </button>
              </div>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Booking Summary</h3>
              
              {selectedService && (
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Service</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {services.find(s => s.id === selectedService)?.name}
                    </p>
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Date</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatDate(new Date(selectedDate))}
                      </p>
                    </div>
                  )}
                  
                  {selectedTime && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Time</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{selectedTime}</p>
                    </div>
                  )}
                  
                  {selectedStaff && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Specialist</p>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {staff.find(s => s.id === selectedStaff)?.name}
                      </p>
                    </div>
                  )}

                  {selectedAddons.length > 0 && (
                    <div>
                      <p className="text-gray-500 dark:text-gray-400">Add-ons</p>
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
                    <div className="flex justify-between">
                      <p className="text-gray-500 dark:text-gray-400">Total</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        ${calculateTotal()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!selectedService && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Select a service to see booking details
                </p>
              )}

              {/* Policies */}
              <div className="mt-6 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <p>✓ Free cancellation up to 24 hours before</p>
                <p>✓ Instant confirmation via email</p>
                <p>✓ Secure payment processing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your appointment has been successfully booked.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Booking Reference</p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100" data-testid="booking-reference">
                  {bookingReference}
                </p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                A confirmation email has been sent to {customerEmail}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600"
                  data-testid="confirm-ok"
                >
                  OK
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
                  data-testid="print-btn"
                >
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystemPage;
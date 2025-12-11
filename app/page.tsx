"use client";
import React, { useState, useMemo, useCallback } from "react";
import {
  Calendar,
  Clock,
  User,
  Users,
  BarChart3,
  Check,
  ChevronLeft,
  Search,
  Activity,
  Stethoscope,
  Star,
} from "lucide-react";

// -------------------- Static Data --------------------
const SERVICES = [
  {
    id: 1,
    name: "General Consultation",
    duration: 30,
    price: 150,
    category: "General",
    description: "Comprehensive health checkup and consultation",
    icon: "Stethoscope",
  },
  {
    id: 2,
    name: "Cardiology Consultation",
    duration: 45,
    price: 250,
    category: "Cardiology",
    description: "Heart health assessment and treatment",
    icon: "Heart",
  },
  {
    id: 3,
    name: "Dental Checkup",
    duration: 30,
    price: 120,
    category: "Dental",
    description: "Complete oral examination and cleaning",
    icon: "Activity",
  },
  {
    id: 4,
    name: "Pediatric Consultation",
    duration: 30,
    price: 180,
    category: "Pediatrics",
    description: "Child health assessment and care",
    icon: "Users",
  },
  {
    id: 5,
    name: "Dermatology Consultation",
    duration: 30,
    price: 200,
    category: "Dermatology",
    description: "Skin conditions diagnosis and treatment",
    icon: "User",
  },
  {
    id: 6,
    name: "Blood Test",
    duration: 15,
    price: 80,
    category: "Laboratory",
    description: "Complete blood count and analysis",
    icon: "Activity",
  },
  {
    id: 7,
    name: "X-Ray",
    duration: 20,
    price: 100,
    category: "Radiology",
    description: "Digital X-ray imaging",
    icon: "FileText",
  },
  {
    id: 8,
    name: "Physical Therapy",
    duration: 60,
    price: 150,
    category: "Therapy",
    description: "Rehabilitation and physical therapy session",
    icon: "Activity",
  },
];

const DOCTORS = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialties: [1, 2],
    qualification: "MD, Cardiology",
    experience: "15 years",
    rating: 4.9,
    patients: 2500,
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: false,
    },
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialties: [1, 5],
    qualification: "MD, Dermatology",
    experience: "12 years",
    rating: 4.8,
    patients: 1800,
    availability: {
      mon: true,
      tue: true,
      wed: false,
      thu: true,
      fri: true,
      sat: true,
      sun: false,
    },
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialties: [3],
    qualification: "DDS, Dentistry",
    experience: "10 years",
    rating: 4.9,
    patients: 2100,
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: false,
      sun: false,
    },
  },
  {
    id: 4,
    name: "Dr. David Kim",
    specialties: [4],
    qualification: "MD, Pediatrics",
    experience: "18 years",
    rating: 5.0,
    patients: 3200,
    availability: {
      mon: false,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: true,
      sun: true,
    },
  },
  {
    id: 5,
    name: "Dr. Lisa Anderson",
    specialties: [8],
    qualification: "PT, DPT",
    experience: "8 years",
    rating: 4.7,
    patients: 1200,
    availability: {
      mon: true,
      tue: true,
      wed: true,
      thu: true,
      fri: true,
      sat: false,
      sun: false,
    },
  },
];

const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    serviceId: 1,
    doctorId: 1,
    date: "2024-12-11",
    time: "10:00",
    patientName: "John Doe",
    patientEmail: "john@example.com",
    patientPhone: "555-0100",
    patientAge: 35,
    patientGender: "Male",
    status: "confirmed",
    symptoms: "Regular checkup",
    notes: "",
  },
  {
    id: 2,
    serviceId: 2,
    doctorId: 1,
    date: "2024-12-11",
    time: "14:00",
    patientName: "Jane Smith",
    patientEmail: "jane@example.com",
    patientPhone: "555-0101",
    patientAge: 42,
    patientGender: "Female",
    status: "confirmed",
    symptoms: "Chest pain",
    notes: "First time patient",
  },
  {
    id: 3,
    serviceId: 3,
    doctorId: 3,
    date: "2024-12-12",
    time: "11:00",
    patientName: "Bob Wilson",
    patientEmail: "bob@example.com",
    patientPhone: "555-0102",
    patientAge: 28,
    patientGender: "Male",
    status: "confirmed",
    symptoms: "Tooth pain",
    notes: "",
  },
  {
    id: 4,
    serviceId: 4,
    doctorId: 4,
    date: "2024-12-12",
    time: "15:30",
    patientName: "Emma Davis",
    patientEmail: "emma@example.com",
    patientPhone: "555-0103",
    patientAge: 8,
    patientGender: "Female",
    status: "completed",
    symptoms: "Fever and cough",
    notes: "",
  },
];

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
];

// -------------------- Types --------------------
interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
  category: string;
  description: string;
  icon: string;
}

interface Doctor {
  id: number;
  name: string;
  specialties: number[];
  qualification: string;
  experience: string;
  rating: number;
  patients: number;
  availability: {
    mon: boolean;
    tue: boolean;
    wed: boolean;
    thu: boolean;
    fri: boolean;
    sat: boolean;
    sun: boolean;
  };
}

// -------------------- Component --------------------
const MedicalAppointmentApp = () => {
  const [currentView, setCurrentView] = useState<"patient" | "admin">(
    "patient"
  );
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);

  // Booking form state
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    symptoms: "",
    notes: "",
  });
  const [bookingStep, setBookingStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Generate dates for calendar (3-week view)
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 21; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const calendarDates = generateCalendarDates();

  // Check if time slot is available
  const isTimeSlotAvailable = useCallback(
    (date: Date, time: string, doctorId: number) => {
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
        date.getDay()
      ] as keyof Doctor["availability"];

      const doctor = DOCTORS.find((d) => d.id === doctorId);
      if (!doctor || !doctor.availability[dayOfWeek]) return false;

      return !appointments.some(
        (a) =>
          a.doctorId === doctorId &&
          a.date === dateStr &&
          a.time === time &&
          a.status !== "cancelled"
      );
    },
    [appointments]
  );

  // Filter services
  const filteredServices = useMemo(() => {
    return SERVICES.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || service.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, filterCategory]);

  // Get available doctors for selected service
  const availableDoctors = selectedService
    ? DOCTORS.filter((d) => d.specialties.includes(selectedService.id))
    : [];

  // Get available time slots
  const availableTimeSlots = useMemo(() => {
    if (!selectedDoctor || !selectedDate) return [];
    return TIME_SLOTS.filter((time) =>
      isTimeSlotAvailable(selectedDate, time, selectedDoctor.id)
    );
  }, [selectedDoctor, selectedDate, isTimeSlotAvailable]);

  // Handle booking submission
  const handleBookingSubmit = () => {
    if (!selectedService || !selectedDoctor || !selectedTime) return;

    const newAppointment = {
      id: appointments.length + 1,
      serviceId: selectedService.id,
      doctorId: selectedDoctor.id,
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
      patientName: patientInfo.name,
      patientEmail: patientInfo.email,
      patientPhone: patientInfo.phone,
      patientAge: parseInt(patientInfo.age || "0"),
      patientGender: patientInfo.gender,
      status: "confirmed",
      symptoms: patientInfo.symptoms,
      notes: patientInfo.notes,
    };

    setAppointments((prev) => [...prev, newAppointment]);

    // Show success then reset
    setBookingStep(5);
    setTimeout(() => {
      setBookingStep(1);
      setSelectedService(null);
      setSelectedDoctor(null);
      setSelectedTime(null);
      setPatientInfo({
        name: "",
        email: "",
        phone: "",
        age: "",
        gender: "",
        symptoms: "",
        notes: "",
      });
    }, 2500);
  };

  // Cancel appointment
  const handleCancelAppointment = (appointmentId: number) => {
    setAppointments(
      appointments.map((a) =>
        a.id === appointmentId ? { ...a, status: "cancelled" } : a
      )
    );
  };

  // Get categories
  const categories = ["all", ...new Set(SERVICES.map((s) => s.category))];

  // -------------------- Patient Booking Flow --------------------
  const renderPatientBooking = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Hero Section */}
      {bookingStep === 1 && (
        <div className="mb-8 sm:mb-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full mb-4">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Book Your Appointment
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Expert medical care at your convenience
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mt-6 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-teal-500" />
              <span>Experienced Doctors</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-teal-500" />
              <span>Easy Scheduling</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-teal-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      {bookingStep <= 4 && (
        <div className="mb-12">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full font-semibold text-sm sm:text-base transition-all ${
                    bookingStep >= step
                      ? "bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {bookingStep > step ? (
                    <Check className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`w-10 sm:w-20 h-1 transition-all ${
                      bookingStep > step
                        ? "bg-gradient-to-r from-teal-400 to-cyan-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3 gap-2 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto px-2">
            <span
              className={bookingStep >= 1 ? "text-teal-600" : "text-gray-500"}
            >
              Service
            </span>
            <span
              className={bookingStep >= 2 ? "text-teal-600" : "text-gray-500"}
            >
              Doctor
            </span>
            <span
              className={bookingStep >= 3 ? "text-teal-600" : "text-gray-500"}
            >
              Schedule
            </span>
            <span
              className={bookingStep >= 4 ? "text-teal-600" : "text-gray-500"}
            >
              Details
            </span>
          </div>
        </div>
      )}

      {/* Step 1: Select Service */}
      {bookingStep === 1 && (
        <div>
          <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medical services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-black"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white font-medium text-black"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Specialties" : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedService(service);
                  setBookingStep(2);
                }}
                className={`group p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedService?.id === service.id
                    ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg"
                    : "border-gray-200 hover:border-teal-300 bg-white"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl transition-all ${
                      selectedService?.id === service.id
                        ? "bg-gradient-to-br from-teal-400 to-cyan-500"
                        : "bg-gray-100 group-hover:bg-teal-100"
                    }`}
                  >
                    <Activity
                      className={`w-6 h-6 ${
                        selectedService?.id === service.id
                          ? "text-white"
                          : "text-gray-600 group-hover:text-teal-600"
                      }`}
                    />
                  </div>
                  <span className="text-teal-600 font-bold text-xl">
                    ${service.price}
                  </span>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-900">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {service.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.duration} min
                  </div>
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                    {service.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Select Doctor */}
      {bookingStep === 2 && (
        <div>
          <button
            onClick={() => setBookingStep(1)}
            className="mb-6 flex items-center text-teal-600 hover:text-teal-700 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Services
          </button>

          <div className="mb-8 p-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-200">
            <p className="text-sm text-gray-600 mb-1">Selected Service</p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-2xl text-gray-900">
                {selectedService?.name}
              </p>
              <p className="text-teal-600 font-bold text-2xl">
                ${selectedService?.price}
              </p>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {selectedService?.description}
            </p>
          </div>

          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Choose Your Doctor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableDoctors.map((doctor) => (
              <div
                key={doctor.id}
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setBookingStep(3);
                }}
                className={`group p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedDoctor?.id === doctor.id
                    ? "border-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-lg"
                    : "border-gray-200 hover:border-teal-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1 text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {doctor.qualification}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-semibold">{doctor.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{doctor.patients}+ patients</span>
                      </div>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold">
                      {doctor.experience} experience
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Select Date & Time */}
      {bookingStep === 3 && (
        <div>
          <button
            onClick={() => setBookingStep(2)}
            className="mb-6 flex items-center text-teal-600 hover:text-teal-700 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Doctors
          </button>

          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Choose Date & Time
          </h2>

          {/* Date Selection */}
          <div className="mb-8">
            <h3 className="font-bold text-lg mb-4 text-gray-900">
              Select Date
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
              {calendarDates.map((date) => {
                const isSelected =
                  selectedDate?.toDateString() === date.toDateString();
                const dayOfWeek = [
                  "sun",
                  "mon",
                  "tue",
                  "wed",
                  "thu",
                  "fri",
                  "sat",
                ][date.getDay()] as keyof Doctor["availability"];
                const isAvailable = selectedDoctor?.availability[dayOfWeek];
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => isAvailable && setSelectedDate(date)}
                    disabled={!isAvailable}
                    className={`p-4 rounded-xl text-center transition-all duration-300 ${
                      isSelected
                        ? "bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg transform scale-105"
                        : isAvailable
                        ? "bg-white border-2 border-gray-200 hover:border-teal-300 hover:shadow-md"
                        : "bg-gray-50 text-gray-400 cursor-not-allowed border-2 border-gray-100"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1">
                      {date.toLocaleDateString("en", { weekday: "short" })}
                    </div>
                    <div className="text-2xl font-bold">{date.getDate()}</div>
                    {isToday && (
                      <div className="text-xs mt-1 opacity-75">Today</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Selection */}
          {selectedDate && (
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">
                Select Time
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-3">
                {availableTimeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setBookingStep(4);
                    }}
                    className={`p-4 rounded-xl transition-all duration-300 font-semibold ${
                      selectedTime === time
                        ? "bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg transform scale-105"
                        : "bg-white border-2 border-gray-200 hover:border-teal-300 hover:shadow-md text-gray-700"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
              {availableTimeSlots.length === 0 && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-gray-200">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">
                    No available time slots for this date
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Please select another date
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Step 4: Patient Details */}
      {bookingStep === 4 && (
        <div>
          <button
            onClick={() => setBookingStep(3)}
            className="mb-6 flex items-center text-teal-600 hover:text-teal-700 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" /> Back to Schedule
          </button>

          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Patient Information
          </h2>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={patientInfo.name}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={patientInfo.email}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={patientInfo.phone}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, phone: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-700">
                  Age *
                </label>
                <input
                  type="number"
                  value={patientInfo.age}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, age: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Gender *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["Male", "Female", "Other"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setPatientInfo({ ...patientInfo, gender })}
                    className={`p-3 rounded-xl font-semibold transition-all ${
                      patientInfo.gender === gender
                        ? "bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg"
                        : "bg-white border-2 border-gray-200 hover:border-teal-300 text-gray-700"
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Symptoms / Reason for Visit *
              </label>
              <textarea
                value={patientInfo.symptoms}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, symptoms: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Additional Notes (Optional)
              </label>
              <textarea
                value={patientInfo.notes}
                onChange={(e) =>
                  setPatientInfo({ ...patientInfo, notes: e.target.value })
                }
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-black"
              />
            </div>

            {/* Appointment Summary */}
            <div className="mt-8 p-8 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border-2 border-teal-200">
              <h3 className="font-bold text-xl mb-4 text-gray-900">
                Appointment Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <div className="font-semibold">Service</div>
                  <div>
                    {selectedService?.name} • {selectedService?.duration} min
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Doctor</div>
                  <div>
                    {selectedDoctor?.name} • {selectedDoctor?.qualification}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Date</div>
                  <div>{new Date(selectedDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="font-semibold">Time</div>
                  <div>{selectedTime}</div>
                </div>
                <div className="col-span-2 pt-2 border-t mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Total</div>
                    <div className="font-bold text-lg text-teal-600">
                      ${selectedService?.price}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleBookingSubmit}
                  disabled={
                    !patientInfo.name ||
                    !patientInfo.email ||
                    !patientInfo.phone ||
                    !patientInfo.age
                  }
                  className="w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-teal-400 to-cyan-500 text-white"
                >
                  Confirm Appointment
                </button>

                <button
                  onClick={() => setBookingStep(3)}
                  className="w-full py-3 rounded-xl font-semibold border-2 border-gray-200 bg-white"
                >
                  Back to Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Success */}
      {bookingStep === 5 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Appointment Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Your appointment has been successfully scheduled.
          </p>
          <div className="max-w-md mx-auto bg-gray-50 p-6 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              A confirmation email will be sent to:
            </p>
            <p className="font-semibold">{patientInfo.email || "—"}</p>
          </div>
        </div>
      )}
    </div>
  );

  // -------------------- Admin Dashboard --------------------
  const renderAdminDashboard = () => {
    const today = new Date().toISOString().split("T")[0];

    const todayAppointments = appointments.filter(
      (a) => a.date === today && a.status === "confirmed"
    );
    const totalRevenue = appointments
      .filter((a) => a.status === "confirmed")
      .reduce((sum, a) => {
        const svc = SERVICES.find((s) => s.id === a.serviceId);
        return sum + (svc?.price || 0);
      }, 0);

    return (
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
          Admin Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Today&apos;s Appointments</h3>
              <Calendar className="w-5 h-5 text-teal-600" />
            </div>
            <p className="text-3xl font-bold">{todayAppointments.length}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Total Appointments</h3>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold">
              {appointments.filter((a) => a.status === "confirmed").length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Total Revenue</h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold">${totalRevenue}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-600">Active Doctors</h3>
              <User className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold">{DOCTORS.length}</p>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-bold">All Appointments</h2>
            <div className="flex items-center gap-3">
              <button className="px-3 py-2 rounded-lg border">
                Notifications
              </button>
              <button className="px-3 py-2 rounded-lg bg-teal-500 text-white">
                New Appointment
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Time
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((appt) => {
                  const svc = SERVICES.find((s) => s.id === appt.serviceId);
                  const doc = DOCTORS.find((d) => d.id === appt.doctorId);
                  return (
                    <tr key={appt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold">{appt.patientName}</div>
                        <div className="text-sm text-gray-600">
                          {appt.patientEmail}
                        </div>
                      </td>
                      <td className="px-6 py-4">{svc?.name}</td>
                      <td className="px-6 py-4">{doc?.name}</td>
                      <td className="px-6 py-4">
                        {new Date(appt.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{appt.time}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            appt.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : appt.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {appt.status === "confirmed" && (
                          <button
                            onClick={() => handleCancelAppointment(appt.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-semibold"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-teal-600">
              MediBook
            </h1>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => setCurrentView("patient")}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                  currentView === "patient"
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="hidden sm:inline">Patient View</span>
                <span className="sm:hidden">Patient</span>
              </button>
              <button
                onClick={() => setCurrentView("admin")}
                className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-semibold transition-colors ${
                  currentView === "admin"
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span className="hidden sm:inline">Admin View</span>
                <span className="sm:hidden">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {currentView === "patient"
        ? renderPatientBooking()
        : renderAdminDashboard()}
    </div>
  );
};

export default MedicalAppointmentApp;

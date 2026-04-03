'use client';

import { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  RefreshCw,
  X,
  UserCheck,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Badge,
  Modal,
  Select,
} from '@/components/ui';

interface AppointmentItem {
  id: string;
  appointmentNo: string;
  patientId: string;
  patientName: string;
  doctor: string;
  doctorId: string;
  department: string;
  date: string;
  time: string;
  token: number;
  status: string;
  type: string;
}

interface DoctorItem {
  id: string;
  name: string;
  department: string;
  status: string;
}

interface PatientSearchItem {
  id: string;
  name: string;
  gender?: string;
  phone?: string;
}

const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
];

export default function AppointmentsPage() {
  const today = new Date().toISOString().split('T')[0];
  const [showBook, setShowBook] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [doctors, setDoctors] = useState<DoctorItem[]>([]);
  const [allPatients, setAllPatients] = useState<PatientSearchItem[]>([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [isPatientSearchLoading, setIsPatientSearchLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookError, setBookError] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({
    patientId: '',
    department: '',
    doctorId: '',
    date: today,
    time: '',
    visitType: 'New Visit',
  });

  const todayAppointments = appointments;
  const filteredDoctors = bookForm.department
    ? doctors.filter((d) => d.department === bookForm.department)
    : doctors;
  const filteredPatientResults = patientSearch.trim()
    ? allPatients
      .filter((patient) => {
        const query = patientSearch.trim().toLowerCase();
        return (
          patient.name.toLowerCase().includes(query) ||
          patient.id.toLowerCase().includes(query)
        );
      })
      .slice(0, 8)
    : [];

  const fetchAppointments = async (date: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/appointments?date=${encodeURIComponent(date)}`);
      if (!res.ok) {
        throw new Error('Failed to load appointments');
      }

      const data = await res.json();
      setAppointments(data.data || []);
      setDoctors(data.doctors || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!showBook || allPatients.length > 0) {
      return;
    }

    const controller = new AbortController();

    const fetchPatientsOnce = async () => {
      setIsPatientSearchLoading(true);
      try {
        const params = new URLSearchParams({
          search: '',
          status: 'All',
          department: 'All',
          page: '1',
          pageSize: '100',
        });

        const res = await fetch(`/api/patients?${params.toString()}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error('Failed to load patients');
        }

        const data = await res.json();
        setAllPatients(data.data || []);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setAllPatients([]);
        }
      } finally {
        setIsPatientSearchLoading(false);
      }
    };

    fetchPatientsOnce();

    return () => {
      controller.abort();
    };
  }, [showBook, allPatients.length]);

  const statusVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'in progress':
        return 'info';
      case 'waiting':
        return 'warning';
      case 'confirmed':
        return 'success';
      case 'scheduled':
        return 'neutral';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const resetBookForm = () => {
    setBookForm({
      patientId: '',
      department: '',
      doctorId: '',
      date: selectedDate,
      time: '',
      visitType: 'New Visit',
    });
    setPatientSearch('');
    setBookError(null);
  };

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookError(null);

    if (
      !bookForm.patientId ||
      !bookForm.doctorId ||
      !bookForm.date ||
      !bookForm.time ||
      !bookForm.visitType
    ) {
      setBookError('Please fill all required fields.');
      return;
    }

    setIsBooking(true);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: bookForm.patientId,
          doctorId: bookForm.doctorId,
          date: bookForm.date,
          time: bookForm.time,
          visitType: bookForm.visitType,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setBookError(data.message || 'Failed to book appointment');
        return;
      }

      setShowBook(false);
      resetBookForm();
      setSelectedDate(bookForm.date);
      await fetchAppointments(bookForm.date);
    } catch {
      setBookError('Failed to book appointment');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Appointment Scheduling"
        subtitle="OPD appointment management & token system"
        actions={
          <>
            <Button variant="outline" icon={RefreshCw} size="sm">
              Reschedule
            </Button>
            <Button icon={Plus} size="sm" onClick={() => setShowBook(true)}>
              Book Appointment
            </Button>
          </>
        }
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1">
          <div className="flex items-center gap-3">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              icon={Calendar}
            />
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${view === 'list' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
              >
                List
              </button>
              <button
                onClick={() => setView('calendar')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${view === 'calendar' ? 'bg-white shadow-sm text-brand-600' : 'text-gray-500'}`}
              >
                Calendar
              </button>
            </div>
          </div>
        </Card>
        <Card className="sm:w-48 text-center">
          <p className="text-xs text-gray-500">Today&apos;s Queue</p>
          <p className="text-3xl font-bold text-brand-600">
            {todayAppointments.length}
          </p>
          <p className="text-xs text-gray-400">Appointments</p>
        </Card>
      </div>

      {/* Doctor Availability */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">
          Doctor Availability
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {doctors.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs">
                  {doc.name.split(' ').pop()?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">{doc.department}</p>
                </div>
              </div>
              <Badge
                variant={
                  doc.status === 'Available'
                    ? 'success'
                    : doc.status === 'In Consultation'
                      ? 'info'
                      : 'warning'
                }
                size="sm"
              >
                {doc.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Token Queue */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Token Queue — {selectedDate}
          </h3>
          <Badge>{todayAppointments.length} patients</Badge>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-center text-gray-400 py-8">Loading appointments...</p>
        ) : todayAppointments.length > 0 ? (
          <div className="space-y-2">
            {todayAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-600 text-white flex items-center justify-center text-lg font-bold shrink-0">
                  {apt.token}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">
                      {apt.patientName}
                    </p>
                    <span className="text-xs text-gray-400">
                      ({apt.patientId})
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {apt.doctor} · {apt.department}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{apt.time}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{apt.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant(apt.status)}>
                    {apt.status}
                  </Badge>
                  <div className="flex gap-1">
                    <button
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
                      title="Check In"
                    >
                      <UserCheck size={14} />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Reschedule"
                    >
                      <RefreshCw size={14} />
                    </button>
                    <button
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-8">
            No appointments for this date
          </p>
        )}
      </Card>

      {/* Booking Modal */}
      <Modal
        open={showBook}
        onClose={() => {
          setShowBook(false);
          resetBookForm();
        }}
        title="Book New Appointment"
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleBookAppointment}>
          <div className="relative">
            <Input
              label="Patient"
              placeholder="Search by patient name or MRN"
              icon={Search}
              value={patientSearch}
              onChange={(e) => {
                const value = e.target.value;
                setPatientSearch(value);
                setBookForm((prev) => ({ ...prev, patientId: value }));
              }}
              required
            />

            {isPatientSearchLoading && (
              <p className="mt-1 text-xs text-gray-500">Searching patients...</p>
            )}

            {!isPatientSearchLoading &&
              patientSearch.trim().length > 0 &&
              filteredPatientResults.length > 0 && (
                <div className="absolute z-30 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {filteredPatientResults.map((patient) => (
                    <button
                      key={patient.id}
                      type="button"
                      onClick={() => {
                        setBookForm((prev) => ({ ...prev, patientId: patient.id }));
                        setPatientSearch(`${patient.name} (${patient.id})`);
                      }}
                      className="flex w-full items-start justify-between gap-3 px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-800">{patient.name}</p>
                        <p className="text-xs text-gray-500">{patient.id}</p>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {patient.gender && <p>{patient.gender}</p>}
                        {patient.phone && <p>{patient.phone}</p>}
                      </div>
                    </button>
                  ))}
                </div>
              )}

            {!isPatientSearchLoading &&
              patientSearch.trim().length > 0 &&
              filteredPatientResults.length === 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  No patient found. You can keep typing MRN or full name.
                </p>
              )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={bookForm.department}
              onChange={(e) =>
                setBookForm((prev) => ({
                  ...prev,
                  department: e.target.value,
                  doctorId: '',
                }))
              }
              options={[
                { value: '', label: 'Select Department' },
                ...Array.from(new Set(doctors.map((d) => d.department))).map(
                  (department) => ({
                    value: department,
                    label: department,
                  })
                ),
              ]}
            />
            <Select
              label="Doctor"
              value={bookForm.doctorId}
              onChange={(e) =>
                setBookForm((prev) => ({ ...prev, doctorId: e.target.value }))
              }
              options={[
                { value: '', label: 'Select Doctor' },
                ...filteredDoctors.map((d) => ({ value: d.id, label: d.name })),
              ]}
              required
            />
          </div>
          <Input
            label="Date"
            type="date"
            value={bookForm.date}
            onChange={(e) =>
              setBookForm((prev) => ({ ...prev, date: e.target.value }))
            }
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Slots
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() =>
                    setBookForm((prev) => ({ ...prev, time: slot }))
                  }
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all cursor-pointer ${bookForm.time === slot
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700'
                    }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <Select
            label="Visit Type"
            value={bookForm.visitType}
            onChange={(e) =>
              setBookForm((prev) => ({ ...prev, visitType: e.target.value }))
            }
            options={[
              { value: 'New Visit', label: 'New Visit' },
              { value: 'Follow-up', label: 'Follow-up' },
              { value: 'Consultation', label: 'Consultation' },
              { value: 'Pre-Surgery', label: 'Pre-Surgery' },
            ]}
          />

          {bookError && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
              {bookError}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowBook(false);
                resetBookForm();
              }}
              disabled={isBooking}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isBooking}>
              {isBooking ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

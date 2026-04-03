'use client';

import { useState } from 'react';
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
import { appointments, doctors } from '@/lib/mock-data';

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
  const [showBook, setShowBook] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2024-03-25');
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const todayAppointments = appointments.filter((a) => a.date === selectedDate);
  const statusVariant = (s: string) => {
    switch (s) {
      case 'In Progress':
        return 'info';
      case 'Waiting':
        return 'warning';
      case 'Confirmed':
        return 'success';
      case 'Scheduled':
        return 'neutral';
      default:
        return 'default';
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
                      : doc.status === 'On Leave'
                        ? 'error'
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
            Token Queue â€” {selectedDate}
          </h3>
          <Badge>{todayAppointments.length} patients</Badge>
        </div>

        {todayAppointments.length > 0 ? (
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
                    {apt.doctor} Â· {apt.department}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{apt.time}</span>
                    <span className="text-xs text-gray-300">Â·</span>
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
        onClose={() => setShowBook(false)}
        title="Book New Appointment"
        size="lg"
      >
        <form className="space-y-4">
          <Input
            label="Patient ID"
            placeholder="Enter Patient ID or search by name"
            icon={Search}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              options={[
                { value: '', label: 'Select Department' },
                ...doctors.map((d) => ({
                  value: d.department,
                  label: d.department,
                })),
              ]}
            />
            <Select
              label="Doctor"
              options={[
                { value: '', label: 'Select Doctor' },
                ...doctors.map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
          </div>
          <Input label="Date" type="date" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Slots
            </label>
            <div className="grid grid-cols-4 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="py-2 px-3 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 transition-all cursor-pointer"
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
          <Select
            label="Visit Type"
            options={[
              { value: 'New Visit', label: 'New Visit' },
              { value: 'Follow-up', label: 'Follow-up' },
              { value: 'Consultation', label: 'Consultation' },
              { value: 'Pre-Surgery', label: 'Pre-Surgery' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowBook(false)}>
              Cancel
            </Button>
            <Button variant="primary">Book Appointment</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

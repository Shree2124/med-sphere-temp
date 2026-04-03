'use client';

import { useState } from 'react';
import {
  Scissors,
  Calendar,
  Users,
  Clock,
  Plus,
  FileText,
  AlertCircle,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Input,
  Select,
  StatCard,
  TabNav,
  Textarea,
  Modal,
} from '@/components/ui';
import { surgeries, doctors } from '@/lib/mock-data';

const otRooms = [
  {
    id: 'OT-1',
    name: 'Operation Theatre 1',
    status: 'Occupied',
    currentSurgery: 'SUR-002',
    equipment: ['Laparoscopic Unit', 'Anesthesia Machine', 'Patient Monitor'],
  },
  {
    id: 'OT-2',
    name: 'Operation Theatre 2',
    status: 'Available',
    currentSurgery: null,
    equipment: ['C-Arm', 'Anesthesia Machine', 'Electrosurgical Unit'],
  },
  {
    id: 'OT-3',
    name: 'Minor OT',
    status: 'Under Sterilization',
    currentSurgery: null,
    equipment: ['Basic Kit', 'Patient Monitor'],
  },
];

export default function OTPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [showSchedule, setShowSchedule] = useState(false);

  const tabs = [
    {
      id: 'schedule',
      label: 'Surgery Schedule',
      icon: Calendar,
      count: surgeries.length,
    },
    {
      id: 'ot-rooms',
      label: 'OT Rooms',
      icon: Scissors,
      count: otRooms.length,
    },
    { id: 'notes', label: 'Pre-op / Post-op Notes', icon: FileText },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="OT Management"
        subtitle="Operation theatre scheduling, rooms & surgical notes"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowSchedule(true)}>
            Schedule Surgery
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Surgeries Today"
          value={
            surgeries.filter(
              (s) => s.date === '2024-03-25' || s.date === '2024-03-26'
            ).length
          }
          icon={Scissors}
          color="teal"
        />
        <StatCard
          title="OTs Available"
          value={otRooms.filter((r) => r.status === 'Available').length}
          icon={Scissors}
          color="green"
        />
        <StatCard
          title="In Progress"
          value={surgeries.filter((s) => s.status === 'In Progress').length}
          icon={Clock}
          color="amber"
        />
        <StatCard title="Surgical Team" value={5} icon={Users} color="blue" />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Surgery Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-3">
          {surgeries.map((s) => (
            <Card
              key={s.id}
              className={`border-l-4 ${s.status === 'In Progress' ? 'border-l-amber-500' : 'border-l-brand-500'}`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      s.status === 'In Progress'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-brand-100 text-brand-600'
                    }`}
                  >
                    <Scissors size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">{s.type}</p>
                      <Badge
                        variant={
                          s.status === 'In Progress' ? 'warning' : 'default'
                        }
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Patient: {s.patientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.surgeon} Â· Anesthesia: {s.anesthetist}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">OT</p>
                    <p className="font-bold text-brand-600">{s.ot}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="font-medium">{s.date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Time</p>
                    <p className="font-medium">{s.time}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium">{s.estimatedDuration}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* OT Rooms */}
      {activeTab === 'ot-rooms' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {otRooms.map((room) => (
            <Card
              key={room.id}
              hover
              className={`border-t-4 ${
                room.status === 'Available'
                  ? 'border-t-green-500'
                  : room.status === 'Occupied'
                    ? 'border-t-red-500'
                    : 'border-t-amber-500'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{room.name}</h4>
                <Badge
                  variant={
                    room.status === 'Available'
                      ? 'success'
                      : room.status === 'Occupied'
                        ? 'error'
                        : 'warning'
                  }
                >
                  {room.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mb-3">ID: {room.id}</p>
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Equipment:
                </p>
                <div className="flex flex-wrap gap-1">
                  {room.equipment.map((eq) => (
                    <Badge key={eq} variant="neutral" size="sm">
                      {eq}
                    </Badge>
                  ))}
                </div>
              </div>
              {room.currentSurgery && (
                <div className="mt-3 p-2 bg-red-50 rounded-lg">
                  <p className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> Surgery in progress:{' '}
                    {room.currentSurgery}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Pre-op / Post-op Notes */}
      {activeTab === 'notes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">
              Pre-operative Notes
            </h4>
            <form className="space-y-3">
              <Select
                label="Surgery"
                options={[
                  { value: '', label: 'Select Surgery' },
                  ...surgeries.map((s) => ({
                    value: s.id,
                    label: `${s.type} - ${s.patientName}`,
                  })),
                ]}
              />
              <Textarea
                label="Pre-op Assessment"
                placeholder="Patient condition, fitness for surgery..."
              />
              <Textarea
                label="Anesthesia Plan"
                placeholder="Type of anesthesia, considerations..."
              />
              <Input
                label="Consent Status"
                placeholder="Written consent obtained"
              />
              <div className="flex justify-end">
                <Button variant="primary" size="sm">
                  Save Pre-op Notes
                </Button>
              </div>
            </form>
          </Card>
          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">
              Post-operative Notes
            </h4>
            <form className="space-y-3">
              <Select
                label="Surgery"
                options={[
                  { value: '', label: 'Select Surgery' },
                  ...surgeries.map((s) => ({
                    value: s.id,
                    label: `${s.type} - ${s.patientName}`,
                  })),
                ]}
              />
              <Textarea
                label="Procedure Summary"
                placeholder="Summary of the procedure performed..."
              />
              <Textarea
                label="Findings"
                placeholder="Intra-operative findings..."
              />
              <Textarea
                label="Post-op Instructions"
                placeholder="Recovery instructions, medications..."
              />
              <div className="flex justify-end">
                <Button variant="primary" size="sm">
                  Save Post-op Notes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Schedule Surgery Modal */}
      <Modal
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
        title="Schedule Surgery"
        size="lg"
      >
        <form className="space-y-4">
          <Input label="Patient" placeholder="Search patient..." />
          <Input label="Surgery Type" placeholder="e.g., Knee Replacement" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Surgeon"
              options={[
                { value: '', label: 'Select Surgeon' },
                ...doctors
                  .filter(
                    (d) =>
                      d.department === 'General Surgery' ||
                      d.department === 'Orthopedics'
                  )
                  .map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
            <Select
              label="Anesthetist"
              options={[
                { value: '', label: 'Select Anesthetist' },
                { value: 'dr-vinod', label: 'Dr. Vinod' },
                { value: 'dr-meena', label: 'Dr. Meena' },
              ]}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="OT Room"
              options={[
                { value: '', label: 'Select OT' },
                ...otRooms
                  .filter((r) => r.status === 'Available')
                  .map((r) => ({ value: r.id, label: r.name })),
              ]}
            />
            <Input label="Date" type="date" />
            <Input label="Time" type="time" />
          </div>
          <Input label="Estimated Duration" placeholder="e.g., 3 hours" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowSchedule(false)}>
              Cancel
            </Button>
            <Button variant="primary">Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

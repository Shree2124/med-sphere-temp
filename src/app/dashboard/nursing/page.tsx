'use client';

import { useState } from 'react';
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  Clock,
  Plus,
  ClipboardList,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Input,
  StatCard,
  TabNav,
  Textarea,
} from '@/components/ui';
import { nurseVitals } from '@/lib/mock-data';

const shiftLogs = [
  {
    id: 'SL-001',
    nurse: 'Nurse Priya',
    shift: 'Morning (6AM-2PM)',
    date: '2024-03-25',
    patientsHandled: 12,
    notes:
      'All vitals recorded. Patient B-203 (Suresh Patel) showing slight improvement. Notified Dr. Fatima.',
    status: 'Completed',
  },
  {
    id: 'SL-002',
    nurse: 'Nurse Kavita',
    shift: 'Morning (6AM-2PM)',
    date: '2024-03-25',
    patientsHandled: 8,
    notes:
      'Administered medications as per MAR. Post-op patient (Deepa Menon) recovering well.',
    status: 'In Progress',
  },
];

const marRecords = [
  {
    patient: 'Mohammed Ali',
    bed: 'B-101',
    medicine: 'Ciprofloxacin 500mg',
    schedule: '8AM, 8PM',
    lastGiven: '8:00 AM',
    nextDue: '8:00 PM',
    status: 'Given',
  },
  {
    patient: 'Suresh Patel',
    bed: 'B-203',
    medicine: 'Insulin Glargine 20U',
    schedule: '7AM',
    lastGiven: '7:00 AM',
    nextDue: 'Tomorrow 7AM',
    status: 'Given',
  },
  {
    patient: 'Deepa Menon',
    bed: 'B-201',
    medicine: 'Paracetamol 500mg',
    schedule: '6AM, 2PM, 10PM',
    lastGiven: '6:00 AM',
    nextDue: '2:00 PM',
    status: 'Due Soon',
  },
  {
    patient: 'Deepa Menon',
    bed: 'B-201',
    medicine: 'Ondansetron 4mg',
    schedule: 'As needed',
    lastGiven: 'Yesterday 10PM',
    nextDue: 'PRN',
    status: 'PRN',
  },
];

export default function NursingPage() {
  const [activeTab, setActiveTab] = useState('vitals');
  const [showAddVital, setShowAddVital] = useState(false);

  const tabs = [
    {
      id: 'vitals',
      label: 'Vitals Tracking',
      icon: Activity,
      count: nurseVitals.length,
    },
    {
      id: 'mar',
      label: 'Medication Admin (MAR)',
      icon: ClipboardList,
      count: marRecords.length,
    },
    { id: 'shifts', label: 'Shift Logs', icon: Clock, count: shiftLogs.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Nurse Module"
        subtitle="Vitals tracking, medication administration & shift management"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowAddVital(true)}>
            Record Vitals
          </Button>
        }
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Patients in Care"
          value={nurseVitals.length}
          icon={Heart}
          color="red"
        />
        <StatCard
          title="Vitals Recorded"
          value={12}
          icon={Activity}
          color="teal"
          subtitle="Today"
        />
        <StatCard
          title="Meds Due"
          value={marRecords.filter((m) => m.status === 'Due Soon').length}
          icon={Droplets}
          color="amber"
        />
        <StatCard
          title="Active Shift"
          value="Morning"
          icon={Clock}
          color="blue"
          subtitle="6AM - 2PM"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Vitals */}
      {activeTab === 'vitals' && (
        <div className="space-y-3">
          {nurseVitals.map((v) => (
            <Card key={v.id}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {v.patientName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{v.patientName}</p>
                    <p className="text-xs text-gray-500">
                      {v.patientId} Â· {v.recordedBy} Â· {v.time}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-red-50 rounded-xl">
                    <Heart size={14} className="text-red-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">BP</p>
                      <p className="text-sm font-bold text-gray-900">{v.bp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 rounded-xl">
                    <Activity size={14} className="text-blue-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Pulse</p>
                      <p className="text-sm font-bold text-gray-900">
                        {v.pulse} bpm
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 rounded-xl">
                    <Thermometer size={14} className="text-amber-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">Temp</p>
                      <p className="text-sm font-bold text-gray-900">
                        {v.temp}Â°F
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-green-50 rounded-xl">
                    <Droplets size={14} className="text-green-500" />
                    <div>
                      <p className="text-[10px] text-gray-500">SpOâ‚‚</p>
                      <p
                        className={`text-sm font-bold ${v.oxygen < 92 ? 'text-red-600' : 'text-gray-900'}`}
                      >
                        {v.oxygen}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {v.notes && (
                <p className="text-sm text-gray-500 mt-2 pl-13 border-t border-gray-100 pt-2">
                  {v.notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* MAR */}
      {activeTab === 'mar' && (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Patient / Bed</th>
                  <th>Medicine</th>
                  <th>Schedule</th>
                  <th>Last Given</th>
                  <th>Next Due</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {marRecords.map((m, i) => (
                  <tr key={i}>
                    <td>
                      <p className="font-medium">{m.patient}</p>
                      <p className="text-xs text-gray-500">{m.bed}</p>
                    </td>
                    <td className="font-medium">{m.medicine}</td>
                    <td className="text-xs">{m.schedule}</td>
                    <td className="text-xs text-gray-500">{m.lastGiven}</td>
                    <td className="text-xs">{m.nextDue}</td>
                    <td>
                      <Badge
                        variant={
                          m.status === 'Given'
                            ? 'success'
                            : m.status === 'Due Soon'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {m.status}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="ghost" size="sm">
                        Administer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Shift Logs */}
      {activeTab === 'shifts' && (
        <div className="space-y-3">
          {shiftLogs.map((log) => (
            <Card key={log.id}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{log.nurse}</p>
                  <Badge
                    variant={log.status === 'Completed' ? 'success' : 'info'}
                  >
                    {log.status}
                  </Badge>
                </div>
                <span className="text-xs text-gray-400">{log.date}</span>
              </div>
              <p className="text-sm text-gray-600">
                {log.shift} Â· {log.patientsHandled} patients handled
              </p>
              <p className="text-sm text-gray-500 mt-2 p-2 bg-gray-50 rounded-lg">
                {log.notes}
              </p>
            </Card>
          ))}
          <Card>
            <h4 className="font-semibold text-gray-900 mb-3">Add Shift Log</h4>
            <Textarea placeholder="Enter shift notes..." />
            <div className="flex justify-end mt-3">
              <Button variant="primary" size="sm">
                Submit Log
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Add Vital Modal */}
      {showAddVital && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowAddVital(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">
              Record Patient Vitals
            </h3>
            <form className="space-y-3">
              <Input label="Patient ID" placeholder="Enter Patient ID" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="BP (Systolic/Diastolic)" placeholder="120/80" />
                <Input label="Pulse (bpm)" type="number" placeholder="72" />
                <Input
                  label="Temperature (Â°F)"
                  type="number"
                  placeholder="98.6"
                />
                <Input label="SpOâ‚‚ (%)" type="number" placeholder="98" />
              </div>
              <Textarea
                label="Notes"
                placeholder="Additional observations..."
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddVital(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary">Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Zap,
  Clock,
  UserPlus,
  Stethoscope,
  Phone,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Input,
  Select,
  StatCard,
  Textarea,
} from '@/components/ui';
import { doctors } from '@/lib/mock-data';

const emergencyPatients = [
  {
    id: 'EM-001',
    name: 'Unknown Male',
    age: 35,
    triage: 'Critical',
    complaint: 'Road accident, multiple fractures',
    arrivalTime: '09:15 AM',
    assignedDoctor: 'Dr. Sanjay Gupta',
    status: 'In Treatment',
    bp: '90/60',
    pulse: 120,
    oxygen: 88,
  },
  {
    id: 'EM-002',
    name: 'Lakshmi Devi',
    age: 60,
    triage: 'Moderate',
    complaint: 'Severe chest pain, suspected MI',
    arrivalTime: '09:45 AM',
    assignedDoctor: 'Dr. Arun Mehta',
    status: 'Awaiting Lab',
    bp: '160/100',
    pulse: 95,
    oxygen: 94,
  },
  {
    id: 'EM-003',
    name: 'Ravi Kumar',
    age: 22,
    triage: 'Low',
    complaint: 'Deep laceration on right forearm',
    arrivalTime: '10:10 AM',
    assignedDoctor: null,
    status: 'Waiting',
    bp: '120/80',
    pulse: 78,
    oxygen: 99,
  },
  {
    id: 'EM-004',
    name: 'Baby Sara',
    age: 2,
    triage: 'Critical',
    complaint: 'High fever 104°F, febrile seizure',
    arrivalTime: '10:30 AM',
    assignedDoctor: 'Dr. Prakash Joshi',
    status: 'In Treatment',
    bp: '-',
    pulse: 140,
    oxygen: 96,
  },
];

export default function EmergencyPage() {
  const [showQuickReg, setShowQuickReg] = useState(false);

  const triageColor = (t: string) => {
    switch (t) {
      case 'Critical':
        return 'error';
      case 'Moderate':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Emergency Department"
        subtitle="Quick registration, triage, and immediate care"
        actions={
          <>
            <Button variant="danger" icon={Phone} size="sm">
              Call Ambulance
            </Button>
            <Button icon={Zap} size="sm" onClick={() => setShowQuickReg(true)}>
              Quick Registration
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Cases"
          value={emergencyPatients.length}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Critical"
          value={
            emergencyPatients.filter((p) => p.triage === 'Critical').length
          }
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Moderate"
          value={
            emergencyPatients.filter((p) => p.triage === 'Moderate').length
          }
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Available Doctors"
          value={doctors.filter((d) => d.status === 'Available').length}
          icon={Stethoscope}
          color="green"
        />
      </div>

      {/* Triage Legend */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">
          Triage Classification
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500" />
            <span className="text-sm text-gray-600">Critical — Immediate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500" />
            <span className="text-sm text-gray-600">Moderate — Urgent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500" />
            <span className="text-sm text-gray-600">Low — Non-urgent</span>
          </div>
        </div>
      </Card>

      {/* Emergency Patients */}
      <div className="space-y-3">
        {emergencyPatients.map((ep) => (
          <Card
            key={ep.id}
            className={`border-l-4 ${
              ep.triage === 'Critical'
                ? 'border-l-red-500'
                : ep.triage === 'Moderate'
                  ? 'border-l-amber-500'
                  : 'border-l-green-500'
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-3 flex-1">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    ep.triage === 'Critical'
                      ? 'bg-red-100 text-red-600'
                      : ep.triage === 'Moderate'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-green-100 text-green-600'
                  }`}
                >
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{ep.name}</p>
                    <Badge variant={triageColor(ep.triage)}>{ep.triage}</Badge>
                    <span className="text-xs text-gray-400">#{ep.id}</span>
                  </div>
                  <p className="text-sm text-gray-600">{ep.complaint}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>Age: {ep.age}</span>
                    <span>Arrived: {ep.arrivalTime}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Vitals */}
                <div className="flex gap-3">
                  <div className="text-center px-2 py-1 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-500">BP</p>
                    <p className="text-xs font-bold text-gray-700">{ep.bp}</p>
                  </div>
                  <div className="text-center px-2 py-1 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-500">Pulse</p>
                    <p className="text-xs font-bold text-gray-700">
                      {ep.pulse}
                    </p>
                  </div>
                  <div className="text-center px-2 py-1 bg-gray-50 rounded-lg">
                    <p className="text-[10px] text-gray-500">O₂</p>
                    <p
                      className={`text-xs font-bold ${ep.oxygen < 92 ? 'text-red-600' : 'text-gray-700'}`}
                    >
                      {ep.oxygen}%
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {ep.assignedDoctor ? (
                    <p className="text-sm font-medium text-brand-600">
                      {ep.assignedDoctor}
                    </p>
                  ) : (
                    <Button variant="secondary" size="sm" icon={UserPlus}>
                      Assign Doctor
                    </Button>
                  )}
                  <Badge
                    variant={
                      ep.status === 'In Treatment'
                        ? 'info'
                        : ep.status === 'Awaiting Lab'
                          ? 'warning'
                          : 'neutral'
                    }
                    size="sm"
                  >
                    {ep.status}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Registration - Inline */}
      {showQuickReg && (
        <Card className="border-2 border-brand-400">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-brand-600" />
            <h3 className="font-semibold text-gray-900">
              Quick Emergency Registration
            </h3>
            <span className="text-xs text-gray-400">
              (Minimal data — complete later)
            </span>
          </div>
          <form className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="Name (or Unknown)" placeholder="Patient name" />
            <Input label="Estimated Age" type="number" placeholder="Age" />
            <Select
              label="Triage"
              options={[
                { value: 'Critical', label: '🔴 Critical' },
                { value: 'Moderate', label: '🟡 Moderate' },
                { value: 'Low', label: '🟢 Low' },
              ]}
            />
            <Textarea
              label="Chief Complaint"
              placeholder="Brief description..."
              className="sm:col-span-2"
            />
            <Select
              label="Assign Doctor"
              options={[
                { value: '', label: 'Auto-assign' },
                ...doctors
                  .filter((d) => d.status === 'Available')
                  .map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
            <div className="sm:col-span-3 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowQuickReg(false)}>
                Cancel
              </Button>
              <Button variant="primary" icon={Zap}>
                Register & Triage
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

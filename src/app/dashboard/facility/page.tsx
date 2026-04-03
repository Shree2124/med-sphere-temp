'use client';

import { Building2, BedDouble, Wrench, Monitor } from 'lucide-react';
import {
  PageHeader,
  Card,
  Badge,
  StatCard,
  Button,
  Progress,
} from '@/components/ui';

const facilities = [
  {
    id: 'F-001',
    name: 'Central AC System',
    area: 'Entire Hospital',
    status: 'Operational',
    lastMaintenance: '2024-03-10',
    nextMaintenance: '2024-06-10',
  },
  {
    id: 'F-002',
    name: 'Elevator A',
    area: 'Main Building',
    status: 'Operational',
    lastMaintenance: '2024-02-28',
    nextMaintenance: '2024-05-28',
  },
  {
    id: 'F-003',
    name: 'Generator Set 1',
    area: 'Power Room',
    status: 'Under Maintenance',
    lastMaintenance: '2024-03-20',
    nextMaintenance: '2024-03-25',
  },
  {
    id: 'F-004',
    name: 'Water Treatment Plant',
    area: 'Basement',
    status: 'Operational',
    lastMaintenance: '2024-03-15',
    nextMaintenance: '2024-06-15',
  },
];

const equipment = [
  {
    id: 'EQ-001',
    name: 'Ventilator (Draeger)',
    location: 'ICU',
    status: 'In Use',
    condition: 85,
    lastCalibration: '2024-03-01',
  },
  {
    id: 'EQ-002',
    name: 'Defibrillator',
    location: 'Emergency',
    status: 'Available',
    condition: 92,
    lastCalibration: '2024-02-15',
  },
  {
    id: 'EQ-003',
    name: 'Ultrasound Machine',
    location: 'Radiology',
    status: 'In Use',
    condition: 78,
    lastCalibration: '2024-01-20',
  },
  {
    id: 'EQ-004',
    name: 'Patient Monitor',
    location: 'ICU',
    status: 'Available',
    condition: 95,
    lastCalibration: '2024-03-10',
  },
  {
    id: 'EQ-005',
    name: 'ECG Machine',
    location: 'Cardiology',
    status: 'In Use',
    condition: 88,
    lastCalibration: '2024-02-28',
  },
  {
    id: 'EQ-006',
    name: 'Infusion Pump',
    location: 'Ward A',
    status: 'Needs Repair',
    condition: 45,
    lastCalibration: '2024-01-05',
  },
];

export default function FacilityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Facility Management"
        subtitle="Room maintenance, equipment tracking & infrastructure"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Equipment"
          value={equipment.length}
          icon={Monitor}
          color="teal"
        />
        <StatCard
          title="Needs Repair"
          value={equipment.filter((e) => e.condition < 50).length}
          icon={Wrench}
          color="red"
        />
        <StatCard
          title="Facilities"
          value={facilities.length}
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Rooms"
          value={42}
          icon={BedDouble}
          color="green"
          subtitle="38 operational"
        />
      </div>

      {/* Facilities */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">
          Infrastructure & Facilities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {facilities.map((f) => (
            <div
              key={f.id}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900">{f.name}</p>
                <Badge
                  variant={f.status === 'Operational' ? 'success' : 'warning'}
                >
                  {f.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Area: {f.area}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                <span>Last: {f.lastMaintenance}</span>
                <span>Next: {f.nextMaintenance}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Equipment */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">
            Medical Equipment Tracking
          </h3>
          <Button variant="outline" size="sm" icon={Wrench}>
            Schedule Maintenance
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {equipment.map((eq) => (
            <div
              key={eq.id}
              className={`p-4 rounded-xl border-2 ${
                eq.condition < 50
                  ? 'border-red-200 bg-red-50/50'
                  : eq.condition < 80
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-green-200 bg-green-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-gray-900 text-sm">{eq.name}</p>
                <Badge
                  variant={
                    eq.status === 'Available'
                      ? 'success'
                      : eq.status === 'In Use'
                        ? 'info'
                        : 'error'
                  }
                  size="sm"
                >
                  {eq.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                {eq.location} · {eq.id}
              </p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">Condition</span>
                  <span
                    className={`font-bold ${eq.condition < 50 ? 'text-red-600' : eq.condition < 80 ? 'text-amber-600' : 'text-green-600'}`}
                  >
                    {eq.condition}%
                  </span>
                </div>
                <Progress
                  value={eq.condition}
                  color={
                    eq.condition < 50
                      ? 'red'
                      : eq.condition < 80
                        ? 'amber'
                        : 'green'
                  }
                  size="sm"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-2">
                Calibrated: {eq.lastCalibration}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

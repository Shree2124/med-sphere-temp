'use client';

import { useState } from 'react';
import { Truck, MapPin, Phone, Wrench, Plus, Navigation } from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  StatCard,
  Modal,
  Input,
  Select,
} from '@/components/ui';
import { ambulances } from '@/lib/mock-data';

export default function AmbulancePage() {
  const [showDispatch, setShowDispatch] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Ambulance Management"
        subtitle="Vehicle tracking, driver assignment & emergency dispatch"
        actions={
          <Button
            icon={Plus}
            size="sm"
            onClick={() => setShowDispatch(true)}
            variant="danger"
          >
            Emergency Dispatch
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Vehicles"
          value={ambulances.length}
          icon={Truck}
          color="teal"
        />
        <StatCard
          title="Available"
          value={ambulances.filter((a) => a.status === 'Available').length}
          icon={Truck}
          color="green"
        />
        <StatCard
          title="On Duty"
          value={ambulances.filter((a) => a.status === 'On Duty').length}
          icon={Navigation}
          color="blue"
        />
        <StatCard
          title="Maintenance"
          value={ambulances.filter((a) => a.status === 'Maintenance').length}
          icon={Wrench}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ambulances.map((amb) => (
          <Card
            key={amb.id}
            hover
            className={`border-l-4 ${
              amb.status === 'Available'
                ? 'border-l-green-500'
                : amb.status === 'On Duty'
                  ? 'border-l-blue-500'
                  : 'border-l-amber-500'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    amb.status === 'Available'
                      ? 'bg-green-100 text-green-600'
                      : amb.status === 'On Duty'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-amber-100 text-amber-600'
                  }`}
                >
                  <Truck size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{amb.vehicleNo}</p>
                  <p className="text-xs text-gray-500">{amb.id}</p>
                </div>
              </div>
              <Badge
                variant={
                  amb.status === 'Available'
                    ? 'success'
                    : amb.status === 'On Duty'
                      ? 'info'
                      : 'warning'
                }
              >
                {amb.status}
              </Badge>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <Truck size={14} className="text-gray-400" /> {amb.type}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-gray-400" /> Driver:{' '}
                {amb.driver}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-gray-400" /> {amb.location}
              </p>
              <p className="flex items-center gap-2">
                <Wrench size={14} className="text-gray-400" /> Last Service:{' '}
                {amb.lastService}
              </p>
            </div>
            {amb.status === 'Available' && (
              <Button
                variant="danger"
                size="sm"
                className="w-full mt-3"
                icon={Navigation}
              >
                Dispatch
              </Button>
            )}
          </Card>
        ))}
      </div>

      <Modal
        open={showDispatch}
        onClose={() => setShowDispatch(false)}
        title="Emergency Dispatch"
      >
        <form className="space-y-4">
          <Select
            label="Vehicle"
            options={[
              { value: '', label: 'Select Vehicle' },
              ...ambulances
                .filter((a) => a.status === 'Available')
                .map((a) => ({
                  value: a.id,
                  label: `${a.vehicleNo} - ${a.type}`,
                })),
            ]}
          />
          <Input
            label="Pickup Location"
            placeholder="Enter pickup address"
            icon={MapPin}
          />
          <Input
            label="Patient Contact"
            placeholder="Phone number"
            icon={Phone}
          />
          <Select
            label="Emergency Type"
            options={[
              { value: 'accident', label: 'Road Accident' },
              { value: 'cardiac', label: 'Cardiac Emergency' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDispatch(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={Navigation}>
              Dispatch Now
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

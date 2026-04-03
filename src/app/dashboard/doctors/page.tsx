'use client';

import { useState } from 'react';
import {
  Stethoscope,
  FileText,
  TestTube,
  Scan,
  Pill,
  Users,
  Calendar,
  Plus,
  Search,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Input,
  TabNav,
  Select,
  Textarea,
  StatCard,
} from '@/components/ui';
import { doctors, patients, appointments } from '@/lib/mock-data';

export default function DoctorsPage() {
  const [activeTab, setActiveTab] = useState('consultation');
  const [selectedDoctor] = useState(doctors[0]);

  const tabs = [
    { id: 'consultation', label: 'Consultation', icon: Stethoscope },
    { id: 'orders', label: 'Lab/Radiology Orders', icon: TestTube },
    { id: 'prescriptions', label: 'e-Prescriptions', icon: Pill },
    { id: 'schedule', label: 'My Schedule', icon: Calendar },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Doctor Module"
        subtitle={`Welcome, ${selectedDoctor.name} — ${selectedDoctor.department}`}
        actions={
          <Button icon={Plus} size="sm">
            New Consultation
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Patients"
          value={8}
          icon={Users}
          color="teal"
        />
        <StatCard
          title="Pending Orders"
          value={3}
          icon={TestTube}
          color="amber"
        />
        <StatCard
          title="Consultations"
          value={5}
          icon={Stethoscope}
          color="blue"
          subtitle="Completed today"
        />
        <StatCard
          title="Rating"
          value={selectedDoctor.rating}
          icon={Stethoscope}
          color="green"
          subtitle={`${selectedDoctor.experience}`}
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Consultation */}
      {activeTab === 'consultation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient Queue */}
          <Card className="lg:col-span-1">
            <h4 className="font-semibold text-gray-900 mb-3">Patient Queue</h4>
            <div className="space-y-2">
              {appointments
                .filter((a) => a.doctor === selectedDoctor.name)
                .map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-3 rounded-xl cursor-pointer transition-all border ${
                      apt.status === 'In Progress'
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-gray-100 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center text-xs font-bold">
                        {apt.token}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {apt.patientName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {apt.time} · {apt.type}
                        </p>
                      </div>
                      <Badge
                        variant={
                          apt.status === 'In Progress'
                            ? 'info'
                            : apt.status === 'Waiting'
                              ? 'warning'
                              : 'success'
                        }
                        size="sm"
                      >
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Consultation Form */}
          <Card className="lg:col-span-2">
            <h4 className="font-semibold text-gray-900 mb-4">
              Consultation — {patients[0].name}
            </h4>
            <form className="space-y-4">
              <Textarea
                label="Symptoms / Chief Complaint"
                placeholder="Describe patient symptoms..."
              />
              <Textarea
                label="Clinical Findings"
                placeholder="Examination findings..."
              />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Diagnosis" placeholder="Primary diagnosis" />
                <Input label="ICD Code" placeholder="ICD-10 code" />
              </div>
              <Textarea
                label="Treatment Plan"
                placeholder="Treatment plan and recommendations..."
              />
              <Textarea
                label="Notes"
                placeholder="Additional consultation notes..."
              />
              <div className="flex gap-3">
                <Button variant="outline" icon={TestTube} size="sm">
                  Order Lab Test
                </Button>
                <Button variant="outline" icon={Scan} size="sm">
                  Order Radiology
                </Button>
                <Button variant="outline" icon={Pill} size="sm">
                  Write Prescription
                </Button>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline">Save Draft</Button>
                <Button variant="primary">Complete Consultation</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Lab/Radiology Orders */}
      {activeTab === 'orders' && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">
              Order Lab Test / Radiology
            </h4>
          </div>
          <form className="space-y-4">
            <Input
              label="Patient"
              placeholder="Search by patient name or ID"
              icon={Search}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Order Type"
                options={[
                  { value: 'lab', label: 'Lab Test' },
                  { value: 'radiology', label: 'Radiology Scan' },
                ]}
              />
              <Select
                label="Priority"
                options={[
                  { value: 'normal', label: 'Normal' },
                  { value: 'urgent', label: 'Urgent' },
                  { value: 'stat', label: 'STAT' },
                ]}
              />
            </div>
            <Select
              label="Test / Scan"
              options={[
                { value: '', label: 'Select Test' },
                { value: 'cbc', label: 'Complete Blood Count (CBC)' },
                { value: 'lipid', label: 'Lipid Profile' },
                { value: 'thyroid', label: 'Thyroid Profile' },
                { value: 'xray', label: 'X-Ray' },
                { value: 'mri', label: 'MRI' },
                { value: 'ct', label: 'CT Scan' },
                { value: 'echo', label: 'Echocardiogram' },
              ]}
            />
            <Textarea
              label="Clinical Notes"
              placeholder="Reason for ordering..."
            />
            <div className="flex justify-end">
              <Button variant="primary">Place Order</Button>
            </div>
          </form>
        </Card>
      )}

      {/* e-Prescriptions */}
      {activeTab === 'prescriptions' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Write e-Prescription
          </h4>
          <form className="space-y-4">
            <Input
              label="Patient"
              placeholder="Search by name or ID"
              icon={Search}
            />
            <div className="border rounded-xl p-4 space-y-3 bg-gray-50">
              <h5 className="text-sm font-semibold text-gray-700">
                Medications
              </h5>
              {[1, 2, 3].map((n) => (
                <div key={n} className="grid grid-cols-4 gap-3">
                  <Input placeholder="Medicine name" />
                  <Input placeholder="Dosage (e.g. 1-0-1)" />
                  <Input placeholder="Duration" />
                  <Select
                    options={[
                      { value: 'beforeMeal', label: 'Before Meal' },
                      { value: 'afterMeal', label: 'After Meal' },
                      { value: 'anytime', label: 'Anytime' },
                    ]}
                  />
                </div>
              ))}
              <Button variant="ghost" size="sm" icon={Plus}>
                Add Medicine
              </Button>
            </div>
            <Textarea
              label="Special Instructions"
              placeholder="Dietary advice, precautions..."
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline" icon={FileText}>
                Preview
              </Button>
              <Button variant="primary">Send to Pharmacy</Button>
            </div>
          </form>
        </Card>
      )}

      {/* My Schedule */}
      {activeTab === 'schedule' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Today&apos;s Schedule
          </h4>
          <div className="space-y-2">
            {appointments
              .filter((a) => a.doctor === selectedDoctor.name)
              .map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="text-center w-16 shrink-0">
                    <p className="text-sm font-bold text-brand-600">
                      {apt.time}
                    </p>
                    <p className="text-xs text-gray-400">{apt.type}</p>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-gray-500">{apt.patientId}</p>
                  </div>
                  <Badge
                    variant={
                      apt.status === 'In Progress'
                        ? 'info'
                        : apt.status === 'Waiting'
                          ? 'warning'
                          : 'success'
                    }
                  >
                    {apt.status}
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}

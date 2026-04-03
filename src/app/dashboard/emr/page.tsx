'use client';

import { useState } from 'react';
import {
  ClipboardList,
  Search,
  FileText,
  AlertCircle,
  Pill,
  Heart,
  Clock,
  User,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Badge,
  Input,
  TabNav,
  Button,
  Textarea,
} from '@/components/ui';
import { patients } from '@/lib/mock-data';

const patientHistory = {
  diagnoses: [
    {
      date: '2024-03-20',
      diagnosis: 'Hypertensive heart disease',
      icd: 'I11.9',
      doctor: 'Dr. Arun Mehta',
    },
    {
      date: '2024-01-15',
      diagnosis: 'Type 2 Diabetes Mellitus',
      icd: 'E11.9',
      doctor: 'Dr. Prakash Joshi',
    },
    {
      date: '2023-11-08',
      diagnosis: 'Hyperlipidemia',
      icd: 'E78.5',
      doctor: 'Dr. Arun Mehta',
    },
  ],
  prescriptions: [
    {
      date: '2024-03-20',
      medicine: 'Amlodipine 5mg',
      dosage: '1-0-0',
      duration: '30 days',
      doctor: 'Dr. Arun Mehta',
    },
    {
      date: '2024-03-20',
      medicine: 'Metformin 500mg',
      dosage: '1-0-1',
      duration: '30 days',
      doctor: 'Dr. Arun Mehta',
    },
    {
      date: '2024-03-20',
      medicine: 'Atorvastatin 10mg',
      dosage: '0-0-1',
      duration: '30 days',
      doctor: 'Dr. Arun Mehta',
    },
  ],
  allergies: ['Penicillin', 'Sulfa drugs'],
  chronicConditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
  doctorNotes: [
    {
      date: '2024-03-20',
      note: 'Patient reports improved BP control. Continue current medications. Follow-up in 30 days.',
      doctor: 'Dr. Arun Mehta',
    },
    {
      date: '2024-02-15',
      note: 'HbA1c improved to 6.8%. Advised dietary modifications and regular exercise.',
      doctor: 'Dr. Prakash Joshi',
    },
  ],
};

export default function EMRPage() {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(patients[0]);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'diagnoses', label: 'Diagnoses', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'notes', label: 'Doctor Notes', icon: ClipboardList },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Electronic Medical Records"
        subtitle="Patient medical history, diagnoses & prescriptions"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient Search Sidebar */}
        <Card className="lg:col-span-1">
          <Input
            icon={Search}
            placeholder="Search patient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="mt-3 space-y-1 max-h-[500px] overflow-y-auto">
            {patients
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                    selectedPatient.id === p.id
                      ? 'bg-brand-50 border border-brand-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.id} Â· {p.department}
                  </p>
                </button>
              ))}
          </div>
        </Card>

        {/* EMR Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Patient Header */}
          <Card className="bg-linear-to-r from-brand-50 to-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                {selectedPatient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedPatient.name}
                </h2>
                <div className="flex items-center flex-wrap gap-3 mt-1 text-sm text-gray-500">
                  <span>{selectedPatient.id}</span>
                  <span>Â·</span>
                  <span>
                    {selectedPatient.age}y / {selectedPatient.gender}
                  </span>
                  <span>Â·</span>
                  <span>Blood: {selectedPatient.bloodGroup}</span>
                  <span>Â·</span>
                  <span>{selectedPatient.department}</span>
                </div>
              </div>
              <Badge
                variant={
                  selectedPatient.status === 'Active'
                    ? 'success'
                    : selectedPatient.status === 'IPD'
                      ? 'info'
                      : 'error'
                }
                size="md"
              >
                {selectedPatient.status}
              </Badge>
            </div>
          </Card>

          {/* Allergies & Chronic Conditions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-l-4 border-l-red-400">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} className="text-red-500" />
                <h4 className="font-semibold text-sm text-gray-900">
                  Allergies
                </h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {patientHistory.allergies.map((a) => (
                  <Badge key={a} variant="error" size="sm">
                    {a}
                  </Badge>
                ))}
              </div>
            </Card>
            <Card className="border-l-4 border-l-amber-400">
              <div className="flex items-center gap-2 mb-2">
                <Heart size={16} className="text-amber-500" />
                <h4 className="font-semibold text-sm text-gray-900">
                  Chronic Conditions
                </h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {patientHistory.chronicConditions.map((c) => (
                  <Badge key={c} variant="warning" size="sm">
                    {c}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          <TabNav
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === 'overview' && (
            <div className="grid gap-4">
              <Card>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Recent Activity
                </h4>
                <div className="space-y-3">
                  {[
                    ...patientHistory.diagnoses.slice(0, 2),
                    ...patientHistory.doctorNotes.slice(0, 1),
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl bg-gray-50"
                    >
                      <Clock
                        size={14}
                        className="text-gray-400 mt-0.5 shrink-0"
                      />
                      <div>
                        <p className="text-sm text-gray-700">
                          {'diagnosis' in item ? item.diagnosis : item.note}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.date} Â· {item.doctor}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'diagnoses' && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Diagnosis History
                </h4>
                <Button variant="secondary" size="sm">
                  Add Diagnosis
                </Button>
              </div>
              <div className="space-y-2">
                {patientHistory.diagnoses.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{d.diagnosis}</p>
                      <p className="text-xs text-gray-500">
                        ICD: {d.icd} Â· {d.doctor}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">{d.date}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'prescriptions' && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">
                  Active Prescriptions
                </h4>
                <Button variant="secondary" size="sm" icon={Pill}>
                  New Prescription
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full data-table">
                  <thead>
                    <tr className="bg-gray-50">
                      <th>Medicine</th>
                      <th>Dosage</th>
                      <th>Duration</th>
                      <th>Prescribed By</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientHistory.prescriptions.map((rx, i) => (
                      <tr key={i}>
                        <td className="font-medium">{rx.medicine}</td>
                        <td>
                          <Badge variant="info" size="sm">
                            {rx.dosage}
                          </Badge>
                        </td>
                        <td>{rx.duration}</td>
                        <td>{rx.doctor}</td>
                        <td className="text-gray-500 text-xs">{rx.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <Card>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Add New Note
                </h4>
                <Textarea placeholder="Enter consultation notes..." />
                <div className="flex justify-end mt-3">
                  <Button variant="primary" size="sm">
                    Save Note
                  </Button>
                </div>
              </Card>
              {patientHistory.doctorNotes.map((n, i) => (
                <Card key={i}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {n.doctor.split(' ').pop()?.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">
                          {n.doctor}
                        </p>
                        <span className="text-xs text-gray-400">{n.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{n.note}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

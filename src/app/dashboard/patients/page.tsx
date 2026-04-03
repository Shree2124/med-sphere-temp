'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Input,
  Badge,
  DataTable,
  Modal,
  Select,
  Textarea,
} from '@/components/ui';
import { usePatientStore, Patient } from '@/stores';

export default function PatientsPage() {
  const {
    patients,
    filters,
    pagination,
    updateFilter,
    fetchPatients,
    isLoading,
  } = usePatientStore();

  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const statusVariant = (s: string) => {
    switch (s.toLowerCase()) {
      case 'active':
        return 'success';
      case 'ipd':
        return 'info';
      case 'emergency':
        return 'error';
      case 'discharged':
        return 'neutral';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Patient Management"
        subtitle={`${pagination.total} total patients registered`}
        actions={
          <>
            <Button variant="outline" icon={Download} size="sm">
              Export
            </Button>
            <Button icon={Plus} size="sm" onClick={() => setShowRegister(true)}>
              Register Patient
            </Button>
          </>
        }
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search by name or patient ID..."
              value={filters.search}
              onChange={(e) => updateFilter({ search: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'ipd', 'emergency', 'discharged'].map((s) => (
              <button
                key={s}
                onClick={() => updateFilter({ status: s })}
                disabled={isLoading}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${
                  filters.status.toLowerCase() === s.toLowerCase()
                    ? 'bg-brand-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <DataTable
            data={patients as unknown as Record<string, unknown>[]}
            columns={[
              {
                header: 'Patient ID',
                accessor: (r) => (
                  <span className="font-mono text-xs text-brand-600">
                    {String(r.id)}
                  </span>
                ),
              },
              {
                header: 'Name',
                accessor: (row) => {
                  const r = row as unknown as Patient;
                  return (
                    <div>
                      <p className="font-medium text-gray-900">{r.name}</p>
                      <p className="text-xs text-gray-500">{r.email}</p>
                    </div>
                  );
                },
              },
              {
                header: 'Age/Gender',
                accessor: (row) => {
                  const r = row as unknown as Patient;
                  return (
                    <span>
                      {r.age} / {r.gender}
                    </span>
                  );
                },
              },
              {
                header: 'Blood Group',
                accessor: (row) => {
                  const r = row as unknown as Patient;
                  return <Badge variant="default">{r.bloodGroup}</Badge>;
                },
              },
              {
                header: 'Phone',
                accessor: 'phone' as keyof Record<string, unknown>,
              },
              {
                header: 'Department',
                accessor: 'department' as keyof Record<string, unknown>,
              },
              {
                header: 'Status',
                accessor: (row) => {
                  const r = row as unknown as Patient;
                  return (
                    <Badge variant={statusVariant(String(r.status))}>
                      {r.status}
                    </Badge>
                  );
                },
              },
              {
                header: 'Actions',
                accessor: () => (
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                      <Edit2 size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </Card>

      {/* Registration Modal */}
      <Modal
        open={showRegister}
        onClose={() => setShowRegister(false)}
        title="Register New Patient"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="Enter patient name" />
            <Input label="Phone" placeholder="+91 XXXXX XXXXX" />
            <Input label="Age" type="number" placeholder="Age" />
            <Select
              label="Gender"
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
            />
            <Input label="Email" type="email" placeholder="patient@email.com" />
            <Select
              label="Blood Group"
              options={[
                { value: '', label: 'Select' },
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
              ]}
            />
            <Input
              label="ID Proof Type"
              placeholder="Aadhaar / PAN / Passport"
            />
            <Input label="ID Number" placeholder="Enter ID number" />
          </div>
          <Textarea label="Address" placeholder="Full address" />

          {/* Duplicate Detection */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <Filter size={14} />
              <span className="font-medium">Duplicate Detection:</span>
              <span>No duplicates found for the entered details.</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowRegister(false)}>
              Cancel
            </Button>
            <Button variant="primary">Register Patient</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

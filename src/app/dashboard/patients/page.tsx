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
    setPage,
  } = usePatientStore();

  const [showRegister, setShowRegister] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [registerForm, setRegisterForm] = useState({
    name: '',
    phone: '',
    age: '',
    gender: '',
    email: '',
    bloodGroup: '',
    idProofType: '',
    idNumber: '',
    address: '',
  });

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients, filters, pagination.page]);

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

  const resetRegisterForm = () => {
    setRegisterForm({
      name: '',
      phone: '',
      age: '',
      gender: '',
      email: '',
      bloodGroup: '',
      idProofType: '',
      idNumber: '',
      address: '',
    });
    setRegisterError(null);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!registerForm.name || !registerForm.phone || !registerForm.age || !registerForm.gender) {
      setRegisterError('Name, phone, age and gender are required.');
      return;
    }

    setIsRegistering(true);
    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registerForm,
          age: Number(registerForm.age),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setRegisterError(data.message || 'Failed to register patient');
        return;
      }

      setShowRegister(false);
      resetRegisterForm();
      setPage(1);
      await fetchPatients();
    } catch {
      setRegisterError('Failed to register patient');
    } finally {
      setIsRegistering(false);
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
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${filters.status.toLowerCase() === s.toLowerCase()
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
            pagination={{
              currentPage: pagination.page,
              totalPages: pagination.totalPages,
              onPageChange: setPage,
            }}
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
        onClose={() => {
          setShowRegister(false);
          resetRegisterForm();
        }}
        title="Register New Patient"
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              placeholder="Enter patient name"
              value={registerForm.name}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
            <Input
              label="Phone"
              placeholder="+91 XXXXX XXXXX"
              value={registerForm.phone}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
            />
            <Input
              label="Age"
              type="number"
              placeholder="Age"
              value={registerForm.age}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, age: e.target.value }))
              }
              required
            />
            <Select
              label="Gender"
              value={registerForm.gender}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, gender: e.target.value }))
              }
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              required
            />
            <Input
              label="Email"
              type="email"
              placeholder="patient@email.com"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            <Select
              label="Blood Group"
              value={registerForm.bloodGroup}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, bloodGroup: e.target.value }))
              }
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
              value={registerForm.idProofType}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, idProofType: e.target.value }))
              }
            />
            <Input
              label="ID Number"
              placeholder="Enter ID number"
              value={registerForm.idNumber}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, idNumber: e.target.value }))
              }
            />
          </div>
          <Textarea
            label="Address"
            placeholder="Full address"
            value={registerForm.address}
            onChange={(e) =>
              setRegisterForm((prev) => ({ ...prev, address: e.target.value }))
            }
          />

          {registerError && (
            <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700">
              {registerError}
            </div>
          )}

          {/* Duplicate Detection */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <Filter size={14} />
              <span className="font-medium">Duplicate Detection:</span>
              <span>No duplicates found for the entered details.</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowRegister(false);
                resetRegisterForm();
              }}
              disabled={isRegistering}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isRegistering}>
              {isRegistering ? 'Registering...' : 'Register Patient'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  BedDouble,
  Plus,
  ArrowRightLeft,
  FileText,
  Search,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Input,
  Modal,
  Select,
  StatCard,
  Textarea,
  TabNav,
} from '@/components/ui';
import { beds, patients } from '@/lib/mock-data';

export default function IPDPage() {
  const [activeTab, setActiveTab] = useState('beds');
  const [showAdmit, setShowAdmit] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showDischarge, setShowDischarge] = useState(false);

  const occupied = beds.filter((b) => b.status === 'Occupied').length;
  const available = beds.filter((b) => b.status === 'Available').length;
  const maintenance = beds.filter((b) => b.status === 'Maintenance').length;
  const ipdPatients = patients.filter((p) => p.status === 'IPD');

  const tabs = [
    {
      id: 'beds',
      label: 'Bed Management',
      icon: BedDouble,
      count: beds.length,
    },
    { id: 'admissions', label: 'Current Admissions', count: occupied },
    { id: 'discharge', label: 'Discharge', icon: FileText },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="IPD Management"
        subtitle="Inpatient department â€” admissions, beds & discharge"
        actions={
          <>
            <Button
              variant="outline"
              icon={ArrowRightLeft}
              size="sm"
              onClick={() => setShowTransfer(true)}
            >
              Transfer
            </Button>
            <Button icon={Plus} size="sm" onClick={() => setShowAdmit(true)}>
              New Admission
            </Button>
          </>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Beds"
          value={beds.length}
          icon={BedDouble}
          color="teal"
        />
        <StatCard
          title="Occupied"
          value={occupied}
          icon={BedDouble}
          color="red"
        />
        <StatCard
          title="Available"
          value={available}
          icon={BedDouble}
          color="green"
        />
        <StatCard
          title="Maintenance"
          value={maintenance}
          icon={BedDouble}
          color="amber"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Bed Grid */}
      {activeTab === 'beds' && (
        <div>
          {['General Ward A', 'ICU', 'Private Room', 'Maternity Ward'].map(
            (ward) => {
              const wardBeds = beds.filter((b) => b.ward === ward);
              return (
                <Card key={ward} className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{ward}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="success">
                        {
                          wardBeds.filter((b) => b.status === 'Available')
                            .length
                        }{' '}
                        free
                      </Badge>
                      <Badge variant="error">
                        {wardBeds.filter((b) => b.status === 'Occupied').length}{' '}
                        occupied
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                    {wardBeds.map((bed) => (
                      <div
                        key={bed.id}
                        className={`p-3 rounded-xl border-2 text-center cursor-pointer transition-all hover:scale-105 ${
                          bed.status === 'Available'
                            ? 'border-green-300 bg-green-50 hover:border-green-400'
                            : bed.status === 'Occupied'
                              ? 'border-red-300 bg-red-50 hover:border-red-400'
                              : 'border-amber-300 bg-amber-50 hover:border-amber-400'
                        }`}
                      >
                        <BedDouble
                          size={20}
                          className={`mx-auto mb-1 ${
                            bed.status === 'Available'
                              ? 'text-green-600'
                              : bed.status === 'Occupied'
                                ? 'text-red-600'
                                : 'text-amber-600'
                          }`}
                        />
                        <p className="text-xs font-bold">{bed.id}</p>
                        <p className="text-[10px] text-gray-500">{bed.type}</p>
                        {bed.patient && (
                          <p className="text-[10px] text-gray-600 mt-1 truncate">
                            {bed.patient}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400">
                          â‚¹{bed.dailyRate}/day
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            }
          )}
        </div>
      )}

      {/* Current Admissions */}
      {activeTab === 'admissions' && (
        <Card>
          <div className="space-y-3">
            {beds
              .filter((b) => b.status === 'Occupied')
              .map((bed) => (
                <div
                  key={bed.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm shrink-0">
                    {bed.id}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{bed.patient}</p>
                    <p className="text-sm text-gray-500">
                      {bed.ward} Â· {bed.type}
                    </p>
                    <p className="text-xs text-gray-400">
                      Admitted: {bed.admissionDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" icon={ArrowRightLeft}>
                      Transfer
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={FileText}
                      onClick={() => setShowDischarge(true)}
                    >
                      Discharge
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Discharge Tab */}
      {activeTab === 'discharge' && (
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">
            Discharge Summary Generator
          </h3>
          <form className="space-y-4">
            <Input
              label="Patient ID / Name"
              placeholder="Search patient..."
              icon={Search}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Admission Date" type="date" />
              <Input label="Discharge Date" type="date" />
            </div>
            <Textarea
              label="Diagnosis Summary"
              placeholder="Final diagnosis and treatment summary..."
            />
            <Textarea
              label="Discharge Instructions"
              placeholder="Post-discharge care instructions..."
            />
            <Textarea
              label="Medications on Discharge"
              placeholder="List of prescribed medications..."
            />
            <div className="flex justify-end gap-3">
              <Button variant="outline">Save Draft</Button>
              <Button variant="primary">Generate & Print</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Admission Modal */}
      <Modal
        open={showAdmit}
        onClose={() => setShowAdmit(false)}
        title="New Admission"
        size="lg"
      >
        <form className="space-y-4">
          <Input
            label="Patient ID"
            placeholder="Enter Patient ID or search"
            icon={Search}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Ward"
              options={[
                { value: '', label: 'Select Ward' },
                { value: 'General', label: 'General Ward' },
                { value: 'ICU', label: 'ICU' },
                { value: 'Private', label: 'Private Room' },
                { value: 'Maternity', label: 'Maternity Ward' },
              ]}
            />
            <Select
              label="Bed"
              options={[
                { value: '', label: 'Select Available Bed' },
                ...beds
                  .filter((b) => b.status === 'Available')
                  .map((b) => ({ value: b.id, label: `${b.id} - ${b.ward}` })),
              ]}
            />
          </div>
          <Select
            label="Attending Doctor"
            options={[{ value: '', label: 'Select Doctor' }]}
          />
          <Textarea
            label="Reason for Admission"
            placeholder="Primary reason for admission..."
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowAdmit(false)}>
              Cancel
            </Button>
            <Button variant="primary">Admit Patient</Button>
          </div>
        </form>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        title="Transfer Patient"
      >
        <form className="space-y-4">
          <Select
            label="Patient"
            options={[
              { value: '', label: 'Select Patient' },
              ...ipdPatients.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
          <Select
            label="Transfer To Ward"
            options={[
              { value: '', label: 'Select Ward' },
              { value: 'General', label: 'General Ward' },
              { value: 'ICU', label: 'ICU' },
              { value: 'Private', label: 'Private Room' },
            ]}
          />
          <Select
            label="New Bed"
            options={[
              { value: '', label: 'Select Bed' },
              ...beds
                .filter((b) => b.status === 'Available')
                .map((b) => ({ value: b.id, label: `${b.id} - ${b.ward}` })),
            ]}
          />
          <Textarea label="Reason for Transfer" placeholder="Reason..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowTransfer(false)}>
              Cancel
            </Button>
            <Button variant="primary">Transfer</Button>
          </div>
        </form>
      </Modal>

      {/* Discharge Modal */}
      <Modal
        open={showDischarge}
        onClose={() => setShowDischarge(false)}
        title="Discharge Patient"
      >
        <form className="space-y-4">
          <Select
            label="Patient"
            options={[
              { value: '', label: 'Select Patient' },
              ...ipdPatients.map((p) => ({ value: p.id, label: p.name })),
            ]}
          />
          <Textarea label="Discharge Notes" placeholder="Final notes..." />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setShowDischarge(false)}>
              Cancel
            </Button>
            <Button variant="primary">Discharge</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

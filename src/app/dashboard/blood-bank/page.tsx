'use client';

import { useState } from 'react';
import {
  Droplets,
  Users,
  AlertCircle,
  Clock,
  Plus,
  ArrowRight,
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
  Modal,
  Textarea,
  Progress,
} from '@/components/ui';
import { bloodBank } from '@/lib/mock-data';

export default function BloodBankPage() {
  const [activeTab, setActiveTab] = useState('stock');
  const [showRequest, setShowRequest] = useState(false);

  const totalUnits = bloodBank.stock.reduce((sum, s) => sum + s.units, 0);
  const tabs = [
    { id: 'stock', label: 'Blood Stock', icon: Droplets },
    {
      id: 'donors',
      label: 'Donor Management',
      icon: Users,
      count: bloodBank.donors.length,
    },
    {
      id: 'requests',
      label: 'Request & Issue',
      icon: ArrowRight,
      count: bloodBank.requests.length,
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Blood Bank Management"
        subtitle="Blood stock tracking, donors & requests"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowRequest(true)}>
            New Request
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Units"
          value={totalUnits}
          icon={Droplets}
          color="red"
        />
        <StatCard title="Blood Groups" value={8} icon={Droplets} color="teal" />
        <StatCard
          title="Active Donors"
          value={bloodBank.donors.filter((d) => d.status === 'Eligible').length}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Pending Requests"
          value={
            bloodBank.requests.filter((r) => r.status === 'Pending').length
          }
          icon={Clock}
          color="amber"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'stock' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {bloodBank.stock.map((s) => (
              <Card
                key={s.group}
                hover
                className={`text-center ${s.units < 10 ? 'border-red-200 bg-red-50/50' : ''}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl font-bold mx-auto mb-2">
                  {s.group}
                </div>
                <p
                  className={`text-2xl font-bold ${s.units < 10 ? 'text-red-600' : 'text-gray-900'}`}
                >
                  {s.units}
                </p>
                <p className="text-xs text-gray-500">units available</p>
                <Progress
                  value={s.units}
                  max={60}
                  color={
                    s.units < 10 ? 'red' : s.units < 20 ? 'amber' : 'green'
                  }
                  size="sm"
                />
                {s.units < 10 && (
                  <div className="flex items-center gap-1 justify-center mt-2 text-red-600">
                    <AlertCircle size={12} />
                    <span className="text-xs font-medium">Low Stock</span>
                  </div>
                )}
                <p className="text-[10px] text-gray-400 mt-1">
                  Updated: {s.lastUpdated}
                </p>
              </Card>
            ))}
          </div>
          <Card>
            <h4 className="font-semibold text-gray-900 mb-3">
              Expiry Tracking
            </h4>
            <div className="space-y-2">
              {[
                {
                  group: 'A-',
                  units: 3,
                  expiryDate: '2024-04-01',
                  daysLeft: 7,
                },
                {
                  group: 'AB-',
                  units: 2,
                  expiryDate: '2024-04-05',
                  daysLeft: 11,
                },
                {
                  group: 'O+',
                  units: 5,
                  expiryDate: '2024-04-10',
                  daysLeft: 16,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                >
                  <Badge variant="error">{item.group}</Badge>
                  <span className="text-sm text-gray-700">
                    {item.units} units
                  </span>
                  <span className="text-xs text-gray-500">
                    Expires: {item.expiryDate}
                  </span>
                  <Badge
                    variant={item.daysLeft < 10 ? 'error' : 'warning'}
                    size="sm"
                  >
                    {item.daysLeft} days left
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'donors' && (
        <Card padding={false}>
          <div className="p-4 border-b border-gray-100">
            <Input icon={Users} placeholder="Search donors..." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Blood Group</th>
                  <th>Phone</th>
                  <th>Last Donation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bloodBank.donors.map((d) => (
                  <tr key={d.id}>
                    <td className="font-mono text-xs text-brand-600">{d.id}</td>
                    <td className="font-medium">{d.name}</td>
                    <td>
                      <Badge variant="error">{d.bloodGroup}</Badge>
                    </td>
                    <td className="text-sm">{d.phone}</td>
                    <td className="text-sm">{d.lastDonation}</td>
                    <td>
                      <Badge
                        variant={
                          d.status === 'Eligible' ? 'success' : 'warning'
                        }
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="ghost" size="sm">
                        Contact
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'requests' && (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Blood Group</th>
                  <th>Units</th>
                  <th>Urgency</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bloodBank.requests.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-brand-600">{r.id}</td>
                    <td className="font-medium">{r.patientName}</td>
                    <td>
                      <Badge variant="error">{r.bloodGroup}</Badge>
                    </td>
                    <td className="font-bold">{r.units}</td>
                    <td>
                      <Badge
                        variant={r.urgency === 'Urgent' ? 'error' : 'neutral'}
                      >
                        {r.urgency}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          r.status === 'Approved' ? 'success' : 'warning'
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant={r.status === 'Pending' ? 'primary' : 'ghost'}
                        size="sm"
                      >
                        {r.status === 'Pending' ? 'Approve' : 'Issue'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={showRequest}
        onClose={() => setShowRequest(false)}
        title="Blood Request"
      >
        <form className="space-y-4">
          <Input label="Patient Name" placeholder="Enter patient name" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Blood Group"
              options={[
                { value: '', label: 'Select' },
                ...bloodBank.stock.map((s) => ({
                  value: s.group,
                  label: `${s.group} (${s.units} units)`,
                })),
              ]}
            />
            <Input label="Units Required" type="number" placeholder="1" />
          </div>
          <Select
            label="Urgency"
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Urgent', label: 'Urgent' },
            ]}
          />
          <Input label="Requested By" placeholder="Doctor name" />
          <Textarea label="Notes" placeholder="Additional info..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRequest(false)}>
              Cancel
            </Button>
            <Button variant="primary">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

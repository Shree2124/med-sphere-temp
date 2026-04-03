'use client';

import { useState } from 'react';
import {
  Shield,
  FileText,
  Upload,
  CheckCircle,
  Clock,
  Plus,
  Search,
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
} from '@/components/ui';
import { insuranceClaims } from '@/lib/mock-data';

export default function InsurancePage() {
  const [activeTab, setActiveTab] = useState('claims');
  const [showNewClaim, setShowNewClaim] = useState(false);

  const tabs = [
    {
      id: 'claims',
      label: 'Claims',
      icon: FileText,
      count: insuranceClaims.length,
    },
    { id: 'preauth', label: 'Pre-Authorization', icon: CheckCircle },
    { id: 'documents', label: 'Documents', icon: Upload },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Insurance Management"
        subtitle="Claims, pre-authorization & document management"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowNewClaim(true)}>
            New Claim
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Claims"
          value={insuranceClaims.length}
          icon={Shield}
          color="teal"
        />
        <StatCard
          title="Approved"
          value={
            insuranceClaims.filter(
              (c) => c.status === 'Approved' || c.status === 'Settled'
            ).length
          }
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Under Review"
          value={
            insuranceClaims.filter((c) => c.status === 'Under Review').length
          }
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Claim Value"
          value="â‚¹1.9L"
          icon={Shield}
          color="blue"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'claims' && (
        <div className="space-y-3">
          {insuranceClaims.map((claim) => (
            <Card key={claim.id}>
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      claim.status === 'Approved' || claim.status === 'Settled'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-amber-100 text-amber-600'
                    }`}
                  >
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {claim.patientName}
                      </p>
                      <span className="text-xs text-gray-400">{claim.id}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Insurer: {claim.insurer} Â· Policy: {claim.policyNo}
                    </p>
                    <p className="text-xs text-gray-500">
                      {claim.date} Â· Pre-auth: {claim.preAuth ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Claimed</p>
                    <p className="font-bold text-gray-900">
                      â‚¹{claim.claimAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Approved</p>
                    <p className="font-bold text-green-600">
                      {claim.approvedAmount
                        ? `â‚¹${claim.approvedAmount.toLocaleString()}`
                        : 'â€”'}
                    </p>
                  </div>
                  <Badge
                    variant={
                      claim.status === 'Settled'
                        ? 'success'
                        : claim.status === 'Approved'
                          ? 'info'
                          : 'warning'
                    }
                  >
                    {claim.status}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'preauth' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Pre-Authorization Workflow
          </h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {[
                'Submit Request',
                'Insurer Review',
                'Approval',
                'Treatment',
                'Settlement',
              ].map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${i < 3 ? 'bg-brand-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {i + 1}
                  </div>
                  {i < 4 && (
                    <div
                      className={`h-0.5 flex-1 ${i < 2 ? 'bg-brand-500' : 'bg-gray-200'}`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2 -mt-1">
              {[
                'Submit Request',
                'Insurer Review',
                'Approval',
                'Treatment',
                'Settlement',
              ].map((s) => (
                <span key={s} className="w-16 text-center">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <form className="space-y-4 mt-6">
            <Input
              label="Patient"
              placeholder="Search patient..."
              icon={Search}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Policy Number" placeholder="Enter policy number" />
              <Select
                label="Insurance Company"
                options={[
                  { value: '', label: 'Select Insurer' },
                  { value: 'star', label: 'Star Health' },
                  { value: 'hdfc', label: 'HDFC Ergo' },
                  { value: 'icici', label: 'ICICI Lombard' },
                ]}
              />
            </div>
            <Input
              label="Estimated Treatment Cost"
              type="number"
              placeholder="â‚¹"
            />
            <Textarea
              label="Treatment Details"
              placeholder="Describe the proposed treatment..."
            />
            <div className="flex justify-end">
              <Button variant="primary">Submit Pre-Auth Request</Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'documents' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Document Management
          </h4>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer">
            <Upload size={32} className="mx-auto text-gray-400 mb-3" />
            <p className="font-medium text-gray-700">
              Drop files here or click to upload
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {[
              {
                name: 'Insurance Policy - Mohammed Ali.pdf',
                size: '2.4 MB',
                date: '2024-03-22',
              },
              {
                name: 'Pre-Auth Letter - Deepa Menon.pdf',
                size: '1.1 MB',
                date: '2024-03-23',
              },
              {
                name: 'Claim Form - Vikram Singh.pdf',
                size: '892 KB',
                date: '2024-03-19',
              },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
              >
                <FileText size={18} className="text-brand-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {doc.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {doc.size} Â· {doc.date}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={showNewClaim}
        onClose={() => setShowNewClaim(false)}
        title="Create Insurance Claim"
      >
        <form className="space-y-4">
          <Input
            label="Patient"
            placeholder="Search patient..."
            icon={Search}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Policy Number" placeholder="Enter policy no." />
            <Select
              label="Insurer"
              options={[
                { value: '', label: 'Select' },
                { value: 'star', label: 'Star Health' },
                { value: 'hdfc', label: 'HDFC Ergo' },
                { value: 'icici', label: 'ICICI Lombard' },
              ]}
            />
          </div>
          <Input label="Claim Amount" type="number" placeholder="â‚¹" />
          <Textarea label="Details" placeholder="Claim details..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewClaim(false)}>
              Cancel
            </Button>
            <Button variant="primary">Submit Claim</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

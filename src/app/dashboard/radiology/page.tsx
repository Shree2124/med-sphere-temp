'use client';

import { useState } from 'react';
import { Scan, Upload, Plus, Eye, FileText, Monitor } from 'lucide-react';
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
import { radiology } from '@/lib/mock-data';

export default function RadiologyPage() {
  const [activeTab, setActiveTab] = useState('requests');
  const [showNewScan, setShowNewScan] = useState(false);

  const tabs = [
    {
      id: 'requests',
      label: 'Scan Requests',
      icon: Scan,
      count: radiology.length,
    },
    { id: 'reports', label: 'Reports & Images', icon: FileText },
    { id: 'pacs', label: 'PACS Integration', icon: Monitor },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Radiology (RIS)"
        subtitle="Scan requests, image management & PACS"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowNewScan(true)}>
            New Scan Request
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Scans"
          value={radiology.length}
          icon={Scan}
          color="teal"
        />
        <StatCard
          title="Completed"
          value={radiology.filter((r) => r.status === 'Completed').length}
          icon={Scan}
          color="green"
        />
        <StatCard
          title="Scheduled"
          value={radiology.filter((r) => r.status === 'Scheduled').length}
          icon={Scan}
          color="amber"
        />
        <StatCard
          title="PACS Storage"
          value="2.4 TB"
          icon={Monitor}
          color="blue"
          subtitle="78% capacity"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'requests' && (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Scan Type</th>
                  <th>Body Part</th>
                  <th>Requested By</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {radiology.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs text-brand-600">{r.id}</td>
                    <td>
                      <p className="font-medium">{r.patientName}</p>
                      <p className="text-xs text-gray-500">{r.patientId}</p>
                    </td>
                    <td>
                      <Badge variant="info">{r.scanType}</Badge>
                    </td>
                    <td>{r.bodyPart}</td>
                    <td className="text-sm">{r.requestedBy}</td>
                    <td>
                      <Badge
                        variant={
                          r.status === 'Completed' ? 'success' : 'warning'
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                          <Upload size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-3">
          {radiology
            .filter((r) => r.status === 'Completed')
            .map((r) => (
              <Card key={r.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{r.scanType}</Badge>
                    <span className="text-xs text-gray-400">{r.id}</span>
                  </div>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
                <h4 className="font-semibold text-gray-900">
                  {r.bodyPart} â€” {r.patientName}
                </h4>
                <div className="mt-2 p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm text-blue-800">
                    <strong>Report:</strong> {r.report}
                  </p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button variant="outline" size="sm" icon={Eye}>
                    View Images
                  </Button>
                  <Button variant="outline" size="sm" icon={Upload}>
                    Upload Report
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      )}

      {activeTab === 'pacs' && (
        <Card>
          <div className="text-center py-12">
            <Monitor size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              PACS Integration
            </h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-4">
              Picture Archiving and Communication System for medical image
              storage and retrieval. Configure your PACS server settings to
              enable DICOM image management.
            </p>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mt-6">
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-brand-600">2.4 TB</p>
                <p className="text-xs text-gray-500">Storage Used</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-brand-600">12,450</p>
                <p className="text-xs text-gray-500">Total Images</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl text-center">
                <p className="text-2xl font-bold text-brand-600">DICOM 3.0</p>
                <p className="text-xs text-gray-500">Protocol</p>
              </div>
            </div>
            <Button variant="primary" className="mt-6">
              Configure PACS Server
            </Button>
          </div>
        </Card>
      )}

      <Modal
        open={showNewScan}
        onClose={() => setShowNewScan(false)}
        title="New Scan Request"
      >
        <form className="space-y-4">
          <Input label="Patient" placeholder="Search patient..." />
          <Select
            label="Scan Type"
            options={[
              { value: '', label: 'Select Scan' },
              { value: 'xray', label: 'X-Ray' },
              { value: 'mri', label: 'MRI' },
              { value: 'ct', label: 'CT Scan' },
              { value: 'ultrasound', label: 'Ultrasound' },
              { value: 'echo', label: 'Echocardiogram' },
            ]}
          />
          <Input label="Body Part" placeholder="e.g., Right Knee, Brain" />
          <Select
            label="Priority"
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Urgent', label: 'Urgent' },
            ]}
          />
          <Textarea label="Clinical Notes" placeholder="Reason for scan..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewScan(false)}>
              Cancel
            </Button>
            <Button variant="primary">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

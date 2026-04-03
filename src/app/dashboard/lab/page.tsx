'use client';

import { useState } from 'react';
import {
  TestTube,
  Search,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Input,
  TabNav,
  Select,
  StatCard,
  Modal,
  Textarea,
} from '@/components/ui';
import { labTests } from '@/lib/mock-data';

export default function LabPage() {
  const [activeTab, setActiveTab] = useState('requests');
  const [showNewTest, setShowNewTest] = useState(false);
  const [filter, setFilter] = useState('all');

  const tabs = [
    {
      id: 'requests',
      label: 'Test Requests',
      icon: TestTube,
      count: labTests.length,
    },
    {
      id: 'results',
      label: 'Results',
      icon: CheckCircle,
      count: labTests.filter((t) => t.status === 'Completed').length,
    },
    { id: 'tracking', label: 'Sample Tracking', icon: Clock },
  ];

  const filtered =
    filter === 'all'
      ? labTests
      : labTests.filter(
          (t) => t.status.toLowerCase().replace(' ', '-') === filter
        );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Laboratory Management"
        subtitle="Test requests, sample tracking & results"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowNewTest(true)}>
            New Test Request
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={labTests.length}
          icon={TestTube}
          color="teal"
        />
        <StatCard
          title="Pending"
          value={labTests.filter((t) => t.status === 'Pending').length}
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="In Progress"
          value={labTests.filter((t) => t.status === 'In Progress').length}
          icon={AlertCircle}
          color="blue"
        />
        <StatCard
          title="Completed"
          value={labTests.filter((t) => t.status === 'Completed').length}
          icon={CheckCircle}
          color="green"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'requests' && (
        <Card padding={false}>
          <div className="p-4 flex items-center gap-3 border-b border-gray-100">
            <Input
              icon={Search}
              placeholder="Search tests..."
              className="flex-1"
            />
            <div className="flex gap-1">
              {['all', 'pending', 'in-progress', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${filter === f ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f === 'all' ? 'All' : f.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Test ID</th>
                  <th>Patient</th>
                  <th>Test Name</th>
                  <th>Requested By</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Results</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((test) => (
                  <tr key={test.id}>
                    <td className="font-mono text-xs text-brand-600">
                      {test.id}
                    </td>
                    <td>
                      <p className="font-medium">{test.patientName}</p>
                      <p className="text-xs text-gray-500">{test.patientId}</p>
                    </td>
                    <td className="font-medium">{test.testName}</td>
                    <td className="text-sm">{test.requestedBy}</td>
                    <td>
                      <Badge
                        variant={
                          test.priority === 'Urgent' ? 'error' : 'neutral'
                        }
                      >
                        {test.priority}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        variant={
                          test.status === 'Completed'
                            ? 'success'
                            : test.status === 'In Progress'
                              ? 'info'
                              : 'warning'
                        }
                      >
                        {test.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-gray-600 max-w-48 truncate">
                      {test.results || 'â€”'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'results' && (
        <div className="space-y-3">
          {labTests
            .filter((t) => t.status === 'Completed')
            .map((test) => (
              <Card key={test.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="success">Completed</Badge>
                    <span className="font-mono text-xs text-gray-400">
                      {test.id}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{test.date}</span>
                </div>
                <h4 className="font-semibold text-gray-900">{test.testName}</h4>
                <p className="text-sm text-gray-600">
                  Patient: {test.patientName} ({test.patientId})
                </p>
                <div className="mt-2 p-3 bg-green-50 rounded-xl">
                  <p className="text-sm font-medium text-green-800">
                    Results: {test.results}
                  </p>
                </div>
              </Card>
            ))}
        </div>
      )}

      {activeTab === 'tracking' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Sample Tracking Pipeline
          </h4>
          <div className="space-y-3">
            {labTests.map((test) => (
              <div key={test.id} className="flex items-center gap-4">
                <span className="text-xs font-mono text-gray-500 w-20">
                  {test.id}
                </span>
                <div className="flex-1 flex items-center gap-1">
                  {['Collected', 'Processing', 'Analysis', 'Completed'].map(
                    (stage, i) => {
                      const current =
                        test.status === 'Pending'
                          ? 0
                          : test.status === 'In Progress'
                            ? 2
                            : 3;
                      return (
                        <div key={stage} className="flex items-center flex-1">
                          <div
                            className={`w-3 h-3 rounded-full shrink-0 ${i <= current ? 'bg-brand-500' : 'bg-gray-200'}`}
                          />
                          <div
                            className={`h-0.5 flex-1 ${i < current ? 'bg-brand-500' : 'bg-gray-200'}`}
                          />
                        </div>
                      );
                    }
                  )}
                </div>
                <span className="text-xs text-gray-500 w-24 text-right">
                  {test.status}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Modal
        open={showNewTest}
        onClose={() => setShowNewTest(false)}
        title="New Lab Test Request"
      >
        <form className="space-y-4">
          <Input
            label="Patient"
            placeholder="Search patient..."
            icon={Search}
          />
          <Select
            label="Test"
            options={[
              { value: '', label: 'Select Test' },
              { value: 'cbc', label: 'Complete Blood Count' },
              { value: 'lipid', label: 'Lipid Profile' },
              { value: 'thyroid', label: 'Thyroid Profile' },
              { value: 'glucose', label: 'Blood Glucose' },
              { value: 'tumor', label: 'Tumor Markers' },
            ]}
          />
          <Select
            label="Priority"
            options={[
              { value: 'Normal', label: 'Normal' },
              { value: 'Urgent', label: 'Urgent' },
            ]}
          />
          <Textarea label="Clinical Notes" placeholder="Reason for test..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewTest(false)}>
              Cancel
            </Button>
            <Button variant="primary">Submit</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

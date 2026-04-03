'use client';

import { useState } from 'react';
import {
  Receipt,
  IndianRupee,
  CreditCard,
  Plus,
  Download,
  Printer,
  Search,
  Eye,
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
} from '@/components/ui';
import { invoices } from '@/lib/mock-data';

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState('invoices');
  const [showNewBill, setShowNewBill] = useState(false);

  const totalRevenue = invoices.reduce((s, i) => s + i.paid, 0);
  const pending = invoices.reduce((s, i) => s + i.balance, 0);

  const tabs = [
    {
      id: 'invoices',
      label: 'Invoices',
      icon: Receipt,
      count: invoices.length,
    },
    { id: 'create', label: 'Generate Invoice', icon: Plus },
    { id: 'payments', label: 'Payment History', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Billing & Finance"
        subtitle="OPD/IPD billing, invoices & payment management"
        actions={
          <>
            <Button variant="outline" icon={Download} size="sm">
              Export
            </Button>
            <Button icon={Plus} size="sm" onClick={() => setShowNewBill(true)}>
              Create Invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`â‚¹${(totalRevenue / 1000).toFixed(0)}K`}
          icon={IndianRupee}
          color="green"
        />
        <StatCard
          title="Pending Amount"
          value={`â‚¹${(pending / 1000).toFixed(0)}K`}
          icon={IndianRupee}
          color="red"
        />
        <StatCard
          title="Total Invoices"
          value={invoices.length}
          icon={Receipt}
          color="teal"
        />
        <StatCard
          title="Today's Collection"
          value="â‚¹48K"
          icon={CreditCard}
          color="blue"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'invoices' && (
        <Card padding={false}>
          <div className="p-4 border-b border-gray-100">
            <Input icon={Search} placeholder="Search invoices..." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>Invoice ID</th>
                  <th>Patient</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Balance</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-mono text-xs text-brand-600">
                      {inv.id}
                    </td>
                    <td>
                      <p className="font-medium">{inv.patientName}</p>
                      <p className="text-xs text-gray-500">{inv.patientId}</p>
                    </td>
                    <td>
                      <Badge variant={inv.type === 'IPD' ? 'info' : 'default'}>
                        {inv.type}
                      </Badge>
                    </td>
                    <td className="font-bold">
                      â‚¹{inv.amount.toLocaleString()}
                    </td>
                    <td className="text-green-600 font-medium">
                      â‚¹{inv.paid.toLocaleString()}
                    </td>
                    <td
                      className={`font-medium ${inv.balance > 0 ? 'text-red-600' : 'text-gray-400'}`}
                    >
                      â‚¹{inv.balance.toLocaleString()}
                    </td>
                    <td className="text-sm">{inv.paymentMode}</td>
                    <td>
                      <Badge
                        variant={
                          inv.status === 'Paid'
                            ? 'success'
                            : inv.status === 'Partial'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {inv.status}
                      </Badge>
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg cursor-pointer">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                          <Printer size={14} />
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

      {activeTab === 'create' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Generate New Invoice
          </h4>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Patient ID"
                placeholder="Enter Patient ID"
                icon={Search}
              />
              <Select
                label="Bill Type"
                options={[
                  { value: 'OPD', label: 'OPD' },
                  { value: 'IPD', label: 'IPD' },
                ]}
              />
            </div>
            <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
              <h5 className="text-sm font-semibold text-gray-700">
                Line Items
              </h5>
              {[
                { desc: 'Consultation Fee', amount: 1500 },
                { desc: 'Blood Test - CBC', amount: 450 },
                { desc: 'X-Ray (Chest)', amount: 800 },
                { desc: 'Medicines', amount: 750 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100"
                >
                  <span className="text-sm">{item.desc}</span>
                  <span className="text-sm font-medium">â‚¹{item.amount}</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-brand-600">
                  â‚¹3,500
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Payment Mode"
                options={[
                  { value: 'cash', label: 'Cash' },
                  { value: 'card', label: 'Card' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'insurance', label: 'Insurance' },
                ]}
              />
              <Select
                label="Package"
                options={[
                  { value: '', label: 'No Package' },
                  { value: 'cardiac', label: 'Cardiac Check-up (â‚¹8,000)' },
                  { value: 'surgery', label: 'Surgery Package' },
                ]}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" icon={Printer}>
                Print Preview
              </Button>
              <Button variant="primary">Generate Invoice</Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'payments' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">Recent Payments</h4>
          <div className="space-y-2">
            {invoices
              .filter((i) => i.paid > 0)
              .map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                    <IndianRupee size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {inv.patientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {inv.id} Â· {inv.date} Â· {inv.paymentMode}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600">
                    â‚¹{inv.paid.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </Card>
      )}

      <Modal
        open={showNewBill}
        onClose={() => setShowNewBill(false)}
        title="Quick Invoice"
      >
        <form className="space-y-4">
          <Input
            label="Patient"
            placeholder="Search patient..."
            icon={Search}
          />
          <Select
            label="Type"
            options={[
              { value: 'OPD', label: 'OPD' },
              { value: 'IPD', label: 'IPD' },
            ]}
          />
          <Input label="Amount" type="number" placeholder="â‚¹" />
          <Select
            label="Payment Mode"
            options={[
              { value: 'cash', label: 'Cash' },
              { value: 'card', label: 'Card' },
              { value: 'upi', label: 'UPI' },
            ]}
          />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowNewBill(false)}>
              Cancel
            </Button>
            <Button variant="primary">Generate</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

'use client';

import { useState } from 'react';
import {
  Pill,
  AlertCircle,
  Truck,
  Search,
  Plus,
  ShoppingCart,
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
  Progress,
} from '@/components/ui';
import { medicines } from '@/lib/mock-data';

const suppliers = [
  {
    id: 'SUP-001',
    name: 'Sun Pharma',
    contact: '+91 22 4324 4324',
    email: 'orders@sunpharma.com',
    medicines: 45,
    rating: 4.5,
  },
  {
    id: 'SUP-002',
    name: 'Cipla',
    contact: '+91 22 2576 2576',
    email: 'supply@cipla.com',
    medicines: 38,
    rating: 4.7,
  },
  {
    id: 'SUP-003',
    name: "Dr. Reddy's",
    contact: '+91 40 4900 4900',
    email: 'orders@drreddys.com',
    medicines: 30,
    rating: 4.3,
  },
  {
    id: 'SUP-004',
    name: 'Lupin',
    contact: '+91 22 6640 2222',
    email: 'supply@lupin.com',
    medicines: 22,
    rating: 4.6,
  },
];

export default function PharmacyPage() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [search, setSearch] = useState('');
  const [showDispense, setShowDispense] = useState(false);

  const tabs = [
    {
      id: 'inventory',
      label: 'Medicine Inventory',
      icon: Pill,
      count: medicines.length,
    },
    { id: 'dispensing', label: 'Prescription Dispensing', icon: ShoppingCart },
    {
      id: 'suppliers',
      label: 'Supplier Management',
      icon: Truck,
      count: suppliers.length,
    },
  ];

  const lowStock = medicines.filter((m) => m.stock <= m.reorderLevel);
  const nearExpiry = medicines.filter(
    (m) => new Date(m.expiryDate) < new Date('2024-09-01')
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Pharmacy Management"
        subtitle="Medicine inventory, dispensing & supplier management"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowDispense(true)}>
            Dispense Medicine
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Medicines"
          value={medicines.length}
          icon={Pill}
          color="teal"
        />
        <StatCard
          title="Low Stock"
          value={lowStock.length}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Near Expiry"
          value={nearExpiry.length}
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          title="Suppliers"
          value={suppliers.length}
          icon={Truck}
          color="blue"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'inventory' && (
        <Card padding={false}>
          <div className="p-4 border-b border-gray-100">
            <Input
              icon={Search}
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>ID</th>
                  <th>Medicine</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Batch</th>
                  <th>Expiry</th>
                  <th>Supplier</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {medicines
                  .filter((m) =>
                    m.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((med) => (
                    <tr key={med.id}>
                      <td className="font-mono text-xs text-brand-600">
                        {med.id}
                      </td>
                      <td className="font-medium">{med.name}</td>
                      <td>
                        <Badge variant="neutral">{med.category}</Badge>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${med.stock <= med.reorderLevel ? 'text-red-600' : 'text-gray-900'}`}
                          >
                            {med.stock}
                          </span>
                          {med.stock <= med.reorderLevel && (
                            <AlertCircle size={14} className="text-red-500" />
                          )}
                        </div>
                        <Progress
                          value={med.stock}
                          max={med.reorderLevel * 5}
                          color={
                            med.stock <= med.reorderLevel ? 'red' : 'green'
                          }
                          size="sm"
                        />
                      </td>
                      <td className="text-xs font-mono">{med.batchNo}</td>
                      <td>
                        <span
                          className={`text-xs ${new Date(med.expiryDate) < new Date('2024-09-01') ? 'text-red-600 font-bold' : ''}`}
                        >
                          {med.expiryDate}
                        </span>
                      </td>
                      <td className="text-sm">{med.supplier}</td>
                      <td className="font-medium">â‚¹{med.unitPrice}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'dispensing' && (
        <Card>
          <h4 className="font-semibold text-gray-900 mb-4">
            Prescription-Based Dispensing
          </h4>
          <form className="space-y-4">
            <Input
              label="Prescription ID / Patient"
              placeholder="Scan prescription or enter patient ID"
              icon={Search}
            />
            <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
              <h5 className="text-sm font-semibold text-gray-700">
                Prescribed Medicines
              </h5>
              <div className="space-y-2">
                {[
                  {
                    name: 'Amlodipine 5mg',
                    qty: 30,
                    dosage: '1-0-0',
                    price: 360,
                  },
                  {
                    name: 'Metformin 500mg',
                    qty: 60,
                    dosage: '1-0-1',
                    price: 330,
                  },
                  {
                    name: 'Atorvastatin 10mg',
                    qty: 30,
                    dosage: '0-0-1',
                    price: 450,
                  },
                ].map((rx, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100"
                  >
                    <Pill size={16} className="text-brand-500 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{rx.name}</p>
                      <p className="text-xs text-gray-500">
                        Dosage: {rx.dosage}
                      </p>
                    </div>
                    <span className="text-sm">Qty: {rx.qty}</span>
                    <span className="text-sm font-bold text-brand-600">
                      â‚¹{rx.price}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="font-medium text-gray-700">Total</span>
                <span className="text-lg font-bold text-brand-600">
                  â‚¹1,140
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline">Print Bill</Button>
              <Button variant="primary" icon={ShoppingCart}>
                Dispense & Bill
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <Card key={s.id} hover>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{s.name}</h4>
                <Badge variant="info">{s.medicines} medicines</Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>ðŸ“ž {s.contact}</p>
                <p>ðŸ“§ {s.email}</p>
                <p>â­ Rating: {s.rating}/5</p>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm">
                  View Catalog
                </Button>
                <Button variant="secondary" size="sm">
                  Place Order
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={showDispense}
        onClose={() => setShowDispense(false)}
        title="Dispense Medicine"
      >
        <form className="space-y-4">
          <Input
            label="Prescription / Patient ID"
            placeholder="Scan or enter ID"
          />
          <Select
            label="Medicine"
            options={[
              { value: '', label: 'Select Medicine' },
              ...medicines.map((m) => ({
                value: m.id,
                label: `${m.name} (Stock: ${m.stock})`,
              })),
            ]}
          />
          <Input label="Quantity" type="number" placeholder="Enter quantity" />
          <Textarea label="Notes" placeholder="Additional instructions..." />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowDispense(false)}>
              Cancel
            </Button>
            <Button variant="primary">Dispense</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

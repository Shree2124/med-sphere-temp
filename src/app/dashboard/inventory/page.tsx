'use client';

import { useState } from 'react';
import {
  Package,
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
  Select,
  StatCard,
  Modal,
  Progress,
} from '@/components/ui';
import { inventory } from '@/lib/mock-data';

export default function InventoryPage() {
  const [showAdd, setShowAdd] = useState(false);
  const lowStock = inventory.filter((i) => i.stock <= i.reorderLevel);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Inventory & Store"
        subtitle="Medical & non-medical supplies management"
        actions={
          <>
            <Button variant="outline" icon={ShoppingCart} size="sm">
              Purchase Order
            </Button>
            <Button icon={Plus} size="sm" onClick={() => setShowAdd(true)}>
              Add Item
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={inventory.length}
          icon={Package}
          color="teal"
        />
        <StatCard
          title="Low Stock Alerts"
          value={lowStock.length}
          icon={AlertCircle}
          color="red"
        />
        <StatCard
          title="Medical Supplies"
          value={
            inventory.filter((i) => i.category === 'Medical Supply').length
          }
          icon={Package}
          color="blue"
        />
        <StatCard title="Vendors" value={3} icon={Truck} color="green" />
      </div>

      {lowStock.length > 0 && (
        <Card className="border-l-4 border-l-red-500 bg-red-50/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={18} className="text-red-500" />
            <h4 className="font-semibold text-red-700">Low Stock Alerts</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((item) => (
              <Badge key={item.id} variant="error">
                {item.name} ({item.stock} left)
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <Card padding={false}>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3">
          <Input
            icon={Search}
            placeholder="Search inventory..."
            className="flex-1"
          />
          <Select
            options={[
              { value: 'all', label: 'All Categories' },
              { value: 'medical', label: 'Medical Supply' },
              { value: 'non-medical', label: 'Non-Medical' },
            ]}
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full data-table">
            <thead>
              <tr className="bg-gray-50">
                <th>ID</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Reorder Level</th>
                <th>Price</th>
                <th>Supplier</th>
                <th>Last Restocked</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="font-mono text-xs text-brand-600">
                    {item.id}
                  </td>
                  <td className="font-medium">{item.name}</td>
                  <td>
                    <Badge
                      variant={
                        item.category === 'Medical Supply' ? 'info' : 'neutral'
                      }
                    >
                      {item.category}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-bold ${item.stock <= item.reorderLevel ? 'text-red-600' : 'text-gray-900'}`}
                      >
                        {item.stock}
                      </span>
                      {item.stock <= item.reorderLevel && (
                        <AlertCircle size={14} className="text-red-500" />
                      )}
                    </div>
                    <Progress
                      value={item.stock}
                      max={item.reorderLevel * 5}
                      color={item.stock <= item.reorderLevel ? 'red' : 'green'}
                      size="sm"
                    />
                  </td>
                  <td className="text-sm">{item.reorderLevel}</td>
                  <td>â‚¹{item.unitPrice}</td>
                  <td className="text-sm">{item.supplier}</td>
                  <td className="text-xs text-gray-500">
                    {item.lastRestocked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Add Inventory Item"
      >
        <form className="space-y-4">
          <Input label="Item Name" placeholder="Enter item name" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={[
                { value: 'Medical Supply', label: 'Medical Supply' },
                { value: 'Non-Medical', label: 'Non-Medical' },
              ]}
            />
            <Input label="Quantity" type="number" placeholder="Qty" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Reorder Level"
              type="number"
              placeholder="Min stock"
            />
            <Input label="Unit Price" type="number" placeholder="â‚¹" />
          </div>
          <Input label="Supplier" placeholder="Supplier name" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button variant="primary">Add Item</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

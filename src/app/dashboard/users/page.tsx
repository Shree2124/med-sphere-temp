'use client';

import { useState } from 'react';
import {
  UserCog,
  Shield,
  Clock,
  Plus,
  Edit2,
  Trash2,
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
} from '@/components/ui';
import { users, auditLogs } from '@/lib/mock-data';

const roles = [
  'Admin',
  'Doctor',
  'Nurse',
  'Receptionist',
  'Lab Technician',
  'Pharmacist',
  'Accountant',
];

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [showAddUser, setShowAddUser] = useState(false);

  const tabs = [
    {
      id: 'users',
      label: 'User Management',
      icon: UserCog,
      count: users.length,
    },
    { id: 'roles', label: 'Roles & Permissions (RBAC)', icon: Shield },
    { id: 'audit', label: 'Audit Logs', icon: Clock, count: auditLogs.length },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="User & Role Management"
        subtitle="Multi-user login, RBAC & audit logs"
        actions={
          <Button icon={Plus} size="sm" onClick={() => setShowAddUser(true)}>
            Add User
          </Button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={UserCog}
          color="teal"
        />
        <StatCard
          title="Active"
          value={users.filter((u) => u.status === 'Active').length}
          icon={UserCog}
          color="green"
        />
        <StatCard
          title="Roles"
          value={roles.length}
          icon={Shield}
          color="blue"
        />
        <StatCard
          title="Audit Events"
          value={auditLogs.length}
          icon={Clock}
          color="amber"
          subtitle="Today"
        />
      </div>

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'users' && (
        <Card padding={false}>
          <div className="p-4 border-b border-gray-100">
            <Input icon={Search} placeholder="Search users..." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="font-mono text-xs text-brand-600">{u.id}</td>
                    <td className="font-medium">{u.name}</td>
                    <td className="text-sm text-gray-500">{u.email}</td>
                    <td>
                      <Badge
                        variant={
                          u.role === 'Admin'
                            ? 'error'
                            : u.role === 'Doctor'
                              ? 'info'
                              : 'neutral'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="text-sm">{u.department}</td>
                    <td>
                      <Badge
                        variant={u.status === 'Active' ? 'success' : 'neutral'}
                      >
                        {u.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-gray-500">{u.lastLogin}</td>
                    <td>
                      <div className="flex gap-1">
                        <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                          <Trash2 size={14} />
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

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => {
            const permissions =
              role === 'Admin'
                ? ['Full Access', 'User Management', 'System Config', 'Reports']
                : role === 'Doctor'
                  ? [
                      'EMR Access',
                      'Prescriptions',
                      'Lab Orders',
                      'Patient View',
                    ]
                  : role === 'Nurse'
                    ? ['Vitals Entry', 'MAR', 'Patient View', 'Shift Logs']
                    : role === 'Receptionist'
                      ? [
                          'Registration',
                          'Appointments',
                          'Patient View',
                          'Billing',
                        ]
                      : role === 'Lab Technician'
                        ? ['Lab Tests', 'Results Entry', 'Sample Tracking']
                        : role === 'Pharmacist'
                          ? ['Dispensing', 'Inventory', 'Prescriptions']
                          : [
                              'Billing',
                              'Invoices',
                              'Reports',
                              'Financial Data',
                            ];

            return (
              <Card key={role} hover>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{role}</h4>
                    <p className="text-xs text-gray-500">
                      {users.filter((u) => u.role === role).length} users
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Permissions
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {permissions.map((p) => (
                      <Badge key={p} variant="neutral" size="sm">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-3">
                  Edit Permissions
                </Button>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === 'audit' && (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr className="bg-gray-50">
                  <th>ID</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Target</th>
                  <th>Timestamp</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="font-mono text-xs text-gray-400">
                      {log.id}
                    </td>
                    <td className="font-medium">{log.user}</td>
                    <td>
                      <Badge variant="info">{log.action}</Badge>
                    </td>
                    <td className="text-sm">{log.target}</td>
                    <td className="text-xs text-gray-500">{log.timestamp}</td>
                    <td className="text-xs font-mono text-gray-400">
                      {log.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        open={showAddUser}
        onClose={() => setShowAddUser(false)}
        title="Add New User"
      >
        <form className="space-y-4">
          <Input label="Full Name" placeholder="Enter name" />
          <Input label="Email" type="email" placeholder="user@medsphere.com" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Role"
              options={[
                { value: '', label: 'Select Role' },
                ...roles.map((r) => ({ value: r, label: r })),
              ]}
            />
            <Input label="Department" placeholder="Department" />
          </div>
          <Input label="Password" type="password" placeholder="Set password" />
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowAddUser(false)}>
              Cancel
            </Button>
            <Button variant="primary">Create User</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

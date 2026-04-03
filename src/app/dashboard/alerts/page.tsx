'use client';

import { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  Calendar,
  Package,
  Heart,
  Shield,
  Settings,
  Check,
  Trash2,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  TabNav,
  Input,
} from '@/components/ui';
import { alerts as alertsData } from '@/lib/mock-data';

const alertConfig = [
  {
    id: 1,
    type: 'Emergency Alerts',
    description: 'Critical patient arrivals, code blue',
    enabled: true,
    channels: ['SMS', 'Email', 'Push'],
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: 'Appointment Reminders',
    description: 'Patient appointment confirmations',
    enabled: true,
    channels: ['SMS', 'Email'],
    icon: Calendar,
  },
  {
    id: 3,
    type: 'Low Inventory',
    description: 'Stock below reorder level',
    enabled: true,
    channels: ['Email', 'Push'],
    icon: Package,
  },
  {
    id: 4,
    type: 'Critical Patient',
    description: 'Abnormal vitals, deterioration alerts',
    enabled: true,
    channels: ['SMS', 'Push'],
    icon: Heart,
  },
  {
    id: 5,
    type: 'Lab Results Ready',
    description: 'Test results available notification',
    enabled: false,
    channels: ['Email'],
    icon: Bell,
  },
  {
    id: 6,
    type: 'System Security',
    description: 'Login attempts, permission changes',
    enabled: true,
    channels: ['Email'],
    icon: Shield,
  },
];

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState('notifications');
  const [filter, setFilter] = useState('all');

  const tabs = [
    {
      id: 'notifications',
      label: 'Notification Center',
      icon: Bell,
      count: alertsData.filter((a) => !a.read).length,
    },
    { id: 'config', label: 'Alert Configuration', icon: Settings },
  ];

  const filteredAlerts =
    filter === 'all'
      ? alertsData
      : filter === 'unread'
        ? alertsData.filter((a) => !a.read)
        : alertsData.filter((a) => a.priority === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Alerts & Notifications"
        subtitle="Emergency alerts, appointment reminders & system notifications"
        actions={
          <Button variant="outline" size="sm" icon={Check}>
            Mark All Read
          </Button>
        }
      />

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'notifications' && (
        <>
          <Card>
            <div className="flex gap-2">
              {['all', 'unread', 'high', 'medium', 'low'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize cursor-pointer ${filter === f ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </Card>

          <div className="space-y-2">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className={`border-l-4 ${
                  alert.priority === 'high'
                    ? 'border-l-red-500'
                    : alert.priority === 'medium'
                      ? 'border-l-amber-500'
                      : 'border-l-gray-300'
                } ${!alert.read ? 'bg-white' : 'bg-gray-50/50'}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-3 h-3 rounded-full mt-1 shrink-0 ${
                      alert.priority === 'high'
                        ? 'bg-red-500'
                        : alert.priority === 'medium'
                          ? 'bg-amber-500'
                          : 'bg-gray-300'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge
                        variant={
                          alert.type === 'Emergency'
                            ? 'error'
                            : alert.type === 'Inventory'
                              ? 'warning'
                              : alert.type === 'Lab'
                                ? 'info'
                                : 'neutral'
                        }
                        size="sm"
                      >
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {alert.time}
                      </span>
                      {!alert.read && (
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{alert.message}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg cursor-pointer">
                      <Check size={14} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {activeTab === 'config' && (
        <div className="space-y-3">
          {alertConfig.map((config) => (
            <Card key={config.id}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <config.icon size={18} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {config.type}
                    </h4>
                    <Badge
                      variant={config.enabled ? 'success' : 'neutral'}
                      size="sm"
                    >
                      {config.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{config.description}</p>
                  <div className="flex gap-1 mt-1">
                    {config.channels.map((ch) => (
                      <Badge key={ch} variant="info" size="sm">
                        {ch}
                      </Badge>
                    ))}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={config.enabled}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-600" />
                </label>
              </div>
            </Card>
          ))}

          <Card>
            <h4 className="font-semibold text-gray-900 mb-3">
              Notification Channels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h5 className="font-medium text-sm mb-2">ðŸ“± SMS</h5>
                <Input placeholder="Twilio API Key" className="text-xs" />
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h5 className="font-medium text-sm mb-2">ðŸ“§ Email</h5>
                <Input placeholder="SMTP Server" className="text-xs" />
              </div>
              <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
                <h5 className="font-medium text-sm mb-2">ðŸ”” Push</h5>
                <Input placeholder="FCM Server Key" className="text-xs" />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

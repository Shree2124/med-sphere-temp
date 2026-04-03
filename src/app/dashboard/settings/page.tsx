'use client';

import { useState } from 'react';
import {
  Settings,
  Shield,
  Database,
  Globe,
  CreditCard,
  MessageSquare,
  Wifi,
  Key,
  Lock,
  Cloud,
  RefreshCw,
} from 'lucide-react';
import {
  PageHeader,
  Card,
  Button,
  Badge,
  Input,
  Select,
  TabNav,
  Textarea,
} from '@/components/ui';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('integrations');

  const tabs = [
    { id: 'integrations', label: 'Integrations', icon: Globe },
    { id: 'security', label: 'Security & Compliance', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings },
    { id: 'backup', label: 'Backup & Recovery', icon: Database },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        subtitle="Integrations, security, system configuration & backup"
      />

      <TabNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === 'integrations' && (
        <div className="space-y-4">
          {[
            {
              name: 'Payment Gateway',
              desc: 'Razorpay / Stripe integration for billing',
              icon: CreditCard,
              status: 'Connected',
              color: 'green',
              fields: [
                { label: 'API Key', placeholder: 'rzp_live_xxxxxxxxxx' },
                { label: 'Secret Key', placeholder: 'Enter secret key' },
              ],
            },
            {
              name: 'SMS / Email API',
              desc: 'Twilio for SMS, SendGrid for Email',
              icon: MessageSquare,
              status: 'Connected',
              color: 'green',
              fields: [
                { label: 'SMS API Key', placeholder: 'Twilio SID' },
                { label: 'Email API Key', placeholder: 'SendGrid API key' },
              ],
            },
            {
              name: 'IoT Devices',
              desc: 'Vitals monitoring device integration',
              icon: Wifi,
              status: 'Disconnected',
              color: 'red',
              fields: [
                {
                  label: 'MQTT Broker',
                  placeholder: 'mqtt://broker.hospital.com',
                },
                { label: 'Device Token', placeholder: 'Enter token' },
              ],
            },
            {
              name: 'Government Health APIs',
              desc: 'ABDM/NHA healthcare data exchange',
              icon: Globe,
              status: 'Not Configured',
              color: 'gray',
              fields: [
                {
                  label: 'API Endpoint',
                  placeholder: 'https://api.abdm.gov.in',
                },
                { label: 'Facility ID', placeholder: 'Enter facility ID' },
              ],
            },
          ].map((integration) => (
            <Card key={integration.name}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                  <integration.icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900">
                      {integration.name}
                    </h4>
                    <Badge
                      variant={
                        integration.status === 'Connected'
                          ? 'success'
                          : integration.status === 'Disconnected'
                            ? 'error'
                            : 'neutral'
                      }
                    >
                      {integration.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{integration.desc}</p>
                </div>
                <Button
                  variant={
                    integration.status === 'Connected' ? 'outline' : 'primary'
                  }
                  size="sm"
                >
                  {integration.status === 'Connected' ? 'Configure' : 'Connect'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 pl-16">
                {integration.fields.map((field) => (
                  <Input
                    key={field.label}
                    label={field.label}
                    placeholder={field.placeholder}
                    type="password"
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Lock size={20} className="text-brand-600" />
              <h4 className="font-semibold text-gray-900">Data Encryption</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-800">At Rest</p>
                <p className="text-xs text-green-600">AES-256 • Active</p>
              </div>
              <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-sm font-medium text-green-800">In Transit</p>
                <p className="text-xs text-green-600">TLS 1.3 • Active</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Key size={20} className="text-brand-600" />
              <h4 className="font-semibold text-gray-900">
                JWT Authentication
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Token Expiry" placeholder="24h" />
              <Input label="Refresh Token Expiry" placeholder="7d" />
              <Input
                label="JWT Secret"
                placeholder="Super secret key"
                type="password"
              />
              <Select
                label="Algorithm"
                options={[
                  { value: 'HS256', label: 'HS256' },
                  { value: 'RS256', label: 'RS256' },
                ]}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-brand-600" />
              <h4 className="font-semibold text-gray-900">HIPAA Compliance</h4>
            </div>
            <div className="space-y-2">
              {[
                { check: 'Access controls and audit logging', status: true },
                {
                  check: 'Data encryption (at rest & in transit)',
                  status: true,
                },
                {
                  check: 'Patient data backup & retention policy',
                  status: true,
                },
                { check: 'Unique user identification', status: true },
                { check: 'Automatic session timeout', status: true },
                { check: 'Emergency access procedures', status: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${item.status ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
                  >
                    {item.status ? '✓' : '—'}
                  </div>
                  <span className="text-sm text-gray-700">{item.check}</span>
                  <Badge
                    variant={item.status ? 'success' : 'warning'}
                    size="sm"
                  >
                    {item.status ? 'Compliant' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'system' && (
        <div className="space-y-4">
          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">
              Hospital Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hospital Name"
                defaultValue="MedSphere General Hospital"
              />
              <Input label="Registration No." defaultValue="MH-HOS-2024-1234" />
              <Input label="Phone" defaultValue="+91 22 2345 6789" />
              <Input label="Email" defaultValue="admin@medsphere.com" />
            </div>
            <Textarea
              label="Address"
              defaultValue="123 Medical Parkway, Mumbai - 400001"
              className="mt-4"
            />
            <div className="flex justify-end mt-4">
              <Button variant="primary">Save Changes</Button>
            </div>
          </Card>

          <Card>
            <h4 className="font-semibold text-gray-900 mb-4">
              System Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Version', value: '2.1.0' },
                { label: 'Database', value: 'PostgreSQL 16' },
                { label: 'Server', value: 'Node.js 20 LTS' },
                { label: 'Uptime', value: '99.98%' },
              ].map((info) => (
                <div
                  key={info.label}
                  className="p-3 bg-gray-50 rounded-xl text-center"
                >
                  <p className="text-xs text-gray-500">{info.label}</p>
                  <p className="font-bold text-brand-600">{info.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'backup' && (
        <div className="space-y-4">
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <Cloud size={20} className="text-brand-600" />
              <h4 className="font-semibold text-gray-900">
                Backup & Disaster Recovery
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
                <p className="text-sm font-medium text-green-800">
                  Last Backup
                </p>
                <p className="text-lg font-bold text-green-700">
                  Today, 3:00 AM
                </p>
                <Badge variant="success" size="sm">
                  Successful
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <p className="text-sm font-medium text-blue-800">Backup Size</p>
                <p className="text-lg font-bold text-blue-700">24.8 GB</p>
                <Badge variant="info" size="sm">
                  Compressed
                </Badge>
              </div>
              <div className="p-4 rounded-xl bg-brand-50 border border-brand-200 text-center">
                <p className="text-sm font-medium text-brand-800">Schedule</p>
                <p className="text-lg font-bold text-brand-700">Daily @ 3 AM</p>
                <Badge variant="default" size="sm">
                  Automated
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Backup Frequency"
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'hourly', label: 'Hourly' },
                ]}
              />
              <Input label="Retention Period" placeholder="30 days" />
              <Input
                label="Backup Storage"
                placeholder="s3://medsphere-backups/"
              />
              <Select
                label="Encryption"
                options={[
                  { value: 'aes256', label: 'AES-256' },
                  { value: 'none', label: 'None' },
                ]}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="primary" icon={Cloud}>
                Backup Now
              </Button>
              <Button variant="outline" icon={RefreshCw}>
                Restore from Backup
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

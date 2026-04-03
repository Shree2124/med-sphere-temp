'use client';

import { Users, IndianRupee, BedDouble, Calendar, Pill } from 'lucide-react';
import { PageHeader, Card, StatCard, Badge } from '@/components/ui';
import {
  revenueData,
  departmentStats,
  patientFlowData,
  dashboardStats,
} from '@/lib/mock-data';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = [
  '#0d9488',
  '#14b8a6',
  '#3b82f6',
  '#f59e0b',
  '#dc2626',
  '#8b5cf6',
];

const weeklyData = [
  { day: 'Mon', patients: 145, revenue: 520000 },
  { day: 'Tue', patients: 168, revenue: 610000 },
  { day: 'Wed', patients: 132, revenue: 480000 },
  { day: 'Thu', patients: 158, revenue: 590000 },
  { day: 'Fri', patients: 178, revenue: 680000 },
  { day: 'Sat', patients: 120, revenue: 420000 },
  { day: 'Sun', patients: 85, revenue: 310000 },
];

const deptPieData = departmentStats.map((d, i) => ({
  name: d.name,
  value: d.patients,
  color: COLORS[i],
}));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics & Reports"
        subtitle="Hospital performance analytics, patient reports & visualizations"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Revenue"
          value={`₹${(dashboardStats.monthlyRevenue / 1000000).toFixed(1)}M`}
          icon={IndianRupee}
          color="green"
          trend={{ value: 18, positive: true }}
        />
        <StatCard
          title="Patient Volume"
          value="4,280"
          icon={Users}
          color="teal"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Bed Occupancy"
          value="74%"
          icon={BedDouble}
          color="amber"
        />
        <StatCard
          title="Avg. Stay"
          value="4.2 days"
          icon={Calendar}
          color="blue"
        />
      </div>

      {/* Revenue Trend */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">
              Revenue Trend (6 Months)
            </h3>
            <p className="text-xs text-gray-500">
              Revenue vs Expenses comparison
            </p>
          </div>
          <Badge variant="success">+18% YoY</Badge>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 12 }} />
              <YAxis
                stroke="#94a3b8"
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `₹${(v / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                formatter={(v) => `₹${(Number(v) / 100000).toFixed(1)}L`}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0d9488"
                fill="url(#rev)"
                strokeWidth={2}
                name="Revenue"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#f59e0b"
                fill="url(#exp)"
                strokeWidth={2}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Patient & Revenue */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">Weekly Overview</h3>
          <p className="text-xs text-gray-500 mb-4">
            Patient count & revenue this week
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#94a3b8"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="patients"
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                  name="Patients"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  name="Revenue"
                  dot={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Distribution */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">
            Department Distribution
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Patient distribution across departments
          </p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deptPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) =>
                    `${name} ${(value * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {deptPieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Patient Flow Chart */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-1">
          Hourly Patient Flow
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          OPD, Emergency & IPD traffic pattern
        </p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patientFlowData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="opd"
                stroke="#0d9488"
                strokeWidth={2}
                dot={{ fill: '#0d9488', r: 3 }}
                name="OPD"
              />
              <Line
                type="monotone"
                dataKey="emergency"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ fill: '#dc2626', r: 3 }}
                name="Emergency"
              />
              <Line
                type="monotone"
                dataKey="ipd"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
                name="IPD"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Reports Section */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Generate Reports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              title: 'Patient Report',
              desc: 'Demographics, visits, outcomes',
              icon: Users,
              color: 'teal',
            },
            {
              title: 'Financial Report',
              desc: 'Revenue, billing, collections',
              icon: IndianRupee,
              color: 'green',
            },
            {
              title: 'Inventory Report',
              desc: 'Stock levels, consumption, expiry',
              icon: Pill,
              color: 'blue',
            },
          ].map((report) => (
            <div
              key={report.title}
              className="p-4 rounded-xl border border-gray-100 hover:border-brand-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-${report.color === 'teal' ? 'brand' : report.color}-100 text-${report.color === 'teal' ? 'brand' : report.color}-600 flex items-center justify-center mb-3`}
              >
                <report.icon size={18} />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">
                {report.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">{report.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

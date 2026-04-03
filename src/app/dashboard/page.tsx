'use client';

import { useEffect } from 'react';
import {
  Users,
  BedDouble,
  Activity,
  IndianRupee,
  AlertTriangle,
  TestTube,
  Scissors,
  Clock,
  TrendingUp,
  Calendar,
  Heart,
  Loader2,
} from 'lucide-react';
import { StatCard, Card, Badge } from '@/components/ui';
import {
  appointments,
  alerts as alertsData,
  revenueData,
  departmentStats,
  patientFlowData,
  beds,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useDashboardStore, useAuthStore } from '@/stores';

export default function DashboardPage() {
  const { stats, fetchStats, isLoading } = useDashboardStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (isLoading || !stats) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      </div>
    );
  }

  const bedOccupancyPct = Math.round(
    (stats.occupiedBeds / stats.totalBeds) * 100
  );

  const bedData = [
    { name: 'Occupied', value: stats.occupiedBeds, color: '#0d9488' },
    { name: 'Available', value: stats.availableBeds, color: '#5eead4' },
    { name: 'Maintenance', value: stats.maintenanceBeds, color: '#fbbf24' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Good Morning, {user?.name || 'User'}{' '}
        </h1>
        <p className="text-sm text-gray-500">
          Here&apos;s what&apos;s happening at the hospital today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={Users}
          color="teal"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Today's OPD"
          value={stats.todayOPD}
          icon={Calendar}
          color="blue"
          subtitle={`${stats.todayOPD} appointments`}
        />
        <StatCard
          title="Bed Occupancy"
          value={`${bedOccupancyPct}%`}
          icon={BedDouble}
          color="amber"
          subtitle={`${stats.occupiedBeds}/${stats.totalBeds} beds`}
        />
        <StatCard
          title="Today's Revenue"
          value={`â‚¹${(stats.todayRevenue / 1000).toFixed(0)}K`}
          icon={IndianRupee}
          color="green"
          trend={{ value: 8, positive: true }}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Emergency"
          value={stats.emergencyCases}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Surgeries Today"
          value={stats.surgeriesToday}
          icon={Scissors}
          color="purple"
        />
        <StatCard
          title="Pending Lab Tests"
          value={stats.labTestsPending}
          icon={TestTube}
          color="blue"
        />
        <StatCard
          title="Critical Patients"
          value={stats.criticalPatients}
          icon={Heart}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Revenue Overview</h3>
              <p className="text-xs text-gray-500">
                Monthly revenue vs expenses
              </p>
            </div>
            <Badge variant="success">â†‘ 18% growth</Badge>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorExpenses"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="#94a3b8"
                  tickFormatter={(v) => `â‚¹${(v / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(v) => `â‚¹${(Number(v) / 100000).toFixed(1)}L`}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0d9488"
                  fill="url(#colorRevenue)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f59e0b"
                  fill="url(#colorExpenses)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bed Occupancy */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">Bed Occupancy</h3>
          <p className="text-xs text-gray-500 mb-4">
            {stats.totalBeds} total beds
          </p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={bedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {bedData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Patient Flow & Department Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Flow */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Patient Flow Today
              </h3>
              <p className="text-xs text-gray-500">Hourly patient traffic</p>
            </div>
            <Activity size={18} className="text-brand-500" />
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={patientFlowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11 }}
                  stroke="#94a3b8"
                />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip />
                <Bar
                  dataKey="opd"
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                  name="OPD"
                />
                <Bar
                  dataKey="emergency"
                  fill="#dc2626"
                  radius={[4, 4, 0, 0]}
                  name="Emergency"
                />
                <Bar
                  dataKey="ipd"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="IPD"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Department Performance */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">
                Department Performance
              </h3>
              <p className="text-xs text-gray-500">
                Patient count & revenue by department
              </p>
            </div>
            <TrendingUp size={18} className="text-brand-500" />
          </div>
          <div className="space-y-3">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-24 shrink-0">
                  {dept.name}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${(dept.patients / 600) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">
                  {dept.patients} pts
                </span>
                <span className="text-xs font-medium text-brand-600 w-16 text-right">
                  â‚¹{(dept.revenue / 100000).toFixed(1)}L
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Appointments & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Today&apos;s Appointments
            </h3>
            <Badge>
              {appointments.filter((a) => a.date === '2024-03-25').length} total
            </Badge>
          </div>
          <div className="space-y-2">
            {appointments
              .filter((a) => a.date === '2024-03-25')
              .slice(0, 5)
              .map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-xs">
                    #{apt.token}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {apt.patientName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {apt.doctor} Â· {apt.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      apt.status === 'In Progress'
                        ? 'info'
                        : apt.status === 'Waiting'
                          ? 'warning'
                          : apt.status === 'Confirmed'
                            ? 'success'
                            : 'neutral'
                    }
                  >
                    {apt.status}
                  </Badge>
                </div>
              ))}
          </div>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
            <Badge variant="error">
              {alertsData.filter((a) => !a.read).length} unread
            </Badge>
          </div>
          <div className="space-y-2">
            {alertsData.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${!alert.read ? 'bg-red-50/50' : 'bg-gray-50'} hover:bg-gray-100`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                    alert.priority === 'high'
                      ? 'bg-red-500'
                      : alert.priority === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-gray-300'
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">
                      {alert.type}
                    </span>
                    <Clock size={10} className="text-gray-400" />
                    <span className="text-xs text-gray-400">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {alert.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bed Status Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900">Bed Status Overview</h3>
            <p className="text-xs text-gray-500">
              Real-time bed availability across wards
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {beds.map((bed) => (
            <div
              key={bed.id}
              className={`p-3 rounded-xl border text-center transition-all ${
                bed.status === 'Available'
                  ? 'border-green-200 bg-green-50'
                  : bed.status === 'Occupied'
                    ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
              }`}
            >
              <p className="text-xs font-bold text-gray-700">{bed.id}</p>
              <p className="text-[10px] text-gray-500">{bed.ward}</p>
              <Badge
                variant={
                  bed.status === 'Available'
                    ? 'success'
                    : bed.status === 'Occupied'
                      ? 'error'
                      : 'warning'
                }
                size="sm"
              >
                {bed.status}
              </Badge>
              {bed.patient && (
                <p className="text-[10px] text-gray-600 mt-1 truncate">
                  {bed.patient}
                </p>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

"use client";
import AdminProtected from "../../../../components/AdminProtected";
import { useRouter } from "next/navigation";
import api from "../../../../utils/axios";
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  Home,
  Briefcase,
  LogOut,
  BarChart3,
  Calendar,
  Bell,
  Search
} from "lucide-react";

interface AdminType {
  _id: string;
  name: string;
  email: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
}

function StatCard({ icon, label, value, trend, trendUp }: StatCardProps) {
  return (
    <div className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-amber-400 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-100 hover:-translate-y-1">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/0 via-amber-50/0 to-amber-100/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl text-white shadow-lg shadow-amber-200 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
            trendUp 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-rose-100 text-rose-700'
          }`}>
            {trend}
          </span>
        </div>
        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-1">
          {label}
        </h3>
        <p className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          {value}
        </p>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function QuickAction({ icon, label, onClick }: QuickActionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white border border-gray-200 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg group-hover:from-amber-50 group-hover:to-amber-100 transition-all duration-300">
        <div className="text-gray-700 group-hover:text-amber-600 transition-colors">
          {icon}
        </div>
      </div>
      <span className="text-sm font-semibold text-gray-700 group-hover:text-amber-600 transition-colors">
        {label}
      </span>
    </button>
  );
}

function DashboardContent({ admin }: { admin: AdminType }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post("/admin/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminToken");
      delete api.defaults.headers.common['Authorization'];
      router.push("/admin/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-amber-50/30 to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-amber-900 to-gray-900 bg-clip-text text-transparent">
                    Oparah Realty
                  </h1>
                  <p className="text-xs text-gray-500">Admin Dashboard</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{admin?.name}</p>
                  <p className="text-xs text-gray-500">{admin?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                  {admin?.name?.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-red-200 hover:shadow-xl font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fadeIn">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {admin?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-600">Heres whats happening with your properties today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideUp">
          <StatCard
            icon={<Home className="w-6 h-6" />}
            label="Total Properties"
            value="248"
            trend="+12%"
            trendUp={true}
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="Revenue (This Month)"
            value="₦45.2M"
            trend="+8.3%"
            trendUp={true}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Active Clients"
            value="1,429"
            trend="+24%"
            trendUp={true}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Deals Closed"
            value="38"
            trend="-2%"
            trendUp={false}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <QuickAction
              icon={<Building2 className="w-6 h-6" />}
              label="Add Property"
              onClick={() => {}}
            />
            <QuickAction
              icon={<Users className="w-6 h-6" />}
              label="Manage Clients"
              onClick={() => {}}
            />
            <QuickAction
              icon={<MapPin className="w-6 h-6" />}
              label="View Locations"
              onClick={() => {}}
            />
            <QuickAction
              icon={<BarChart3 className="w-6 h-6" />}
              label="Analytics"
              onClick={() => {}}
            />
            <QuickAction
              icon={<Calendar className="w-6 h-6" />}
              label="Appointments"
              onClick={() => {}}
            />
            <QuickAction
              icon={<Briefcase className="w-6 h-6" />}
              label="Deals"
              onClick={() => {}}
            />
          </div>
        </div>

        {/* Recent Activity & Top Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { action: "New property listing", property: "3BR Lekki Phase 1", time: "2 hours ago" },
                { action: "Deal closed", property: "Penthouse Victoria Island", time: "5 hours ago" },
                { action: "Client inquiry", property: "Land in Ikoyi", time: "1 day ago" },
                { action: "Property viewed", property: "Duplex in Ajah", time: "2 days ago" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-600 truncate">{item.property}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performing Properties */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              Top Performing
            </h3>
            <div className="space-y-4">
              {[
                { name: "Luxury Villa, Banana Island", views: "2.4k", value: "₦850M" },
                { name: "Commercial Complex, VI", views: "1.8k", value: "₦620M" },
                { name: "Smart Home, Lekki", views: "1.5k", value: "₦180M" },
                { name: "Land, Ajah Expressway", views: "1.2k", value: "₦95M" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.views} views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-amber-600">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}

export default function Dashboard() {
  return (
    <AdminProtected>
      {(admin: AdminType) => <DashboardContent admin={admin} />}
    </AdminProtected>
  );
}
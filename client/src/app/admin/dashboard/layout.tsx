import AdminSidebar from "../../../../components/AdminSideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      
      {/* Sidebar */}
      <div className="sticky top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-800">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Notifications
            </button>
            <div className="h-8 w-8 rounded-full bg-slate-300" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

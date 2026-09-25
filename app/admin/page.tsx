import { isAdmin } from "@/lib/adminAuth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const admin = await isAdmin();
  return (
    <div className="min-h-screen bg-paper2">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <p className="text-xs font-semibold uppercase tracking-wide text-mustard mb-1">Go Dilly</p>
        <h1 className="font-serif text-3xl mb-6" style={{ fontFamily: "var(--font-fraunces), serif" }}>
          Content management
        </h1>
        {admin ? <AdminDashboard /> : <AdminLogin />}
      </div>
    </div>
  );
}

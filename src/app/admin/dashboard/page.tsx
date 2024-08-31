import AdminDashboard from "@/components/AdminDashboard";
import Navbar from "@/components/Navbar";

export default function ClienteDash() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <AdminDashboard />
      </div>
    </>
  );
}

import Verificacion from "@/components/Verificacion";
import Navbar from "@/components/Navbar";

export default function ClienteDash() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Verificacion />
      </div>
    </>
  );
}

import Checkout from "@/components/Checkout";
import Navbar from "@/components/Navbar";

export default function Checkoutt() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        <Checkout />
      </div>
    </>
  );
}

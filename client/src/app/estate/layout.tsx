import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "66px" }}>{children}</main>
      <Footer />
    </>
  );
}

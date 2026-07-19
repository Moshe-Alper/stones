import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import Philosophy from "@/components/Philosophy/Philosophy";
import MaterialsGrid from "@/components/MaterialsGrid/MaterialsGrid";
import ProcessSteps from "@/components/ProcessSteps/ProcessSteps";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Philosophy />
        <MaterialsGrid />
        <ProcessSteps />
      </main>
      <Footer />
    </>
  );
}

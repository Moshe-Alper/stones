import Header from "@/components/Header/Header";
import Hero from "@/components/Hero/Hero";
import ServiceArea from "@/components/ServiceArea/ServiceArea";
import MaterialsGrid from "@/components/MaterialsGrid/MaterialsGrid";
import ProcessSteps from "@/components/ProcessSteps/ProcessSteps";
import FAQ from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServiceArea />
        <MaterialsGrid />
        <ProcessSteps />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

import Header from "@/components/Header/Header"
import Hero from "@/components/Hero/Hero"
import RecentWork from "@/components/RecentWork/RecentWork"
import CategoryTiles from "@/components/CategoryTiles/CategoryTiles"
import ProcessSteps from "@/components/ProcessSteps/ProcessSteps"
import FamilyNote from "@/components/FamilyNote/FamilyNote"
import ContactBand from "@/components/ContactBand/ContactBand"
import Footer from "@/components/Footer/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <RecentWork />
        {/* OurFactory hidden until there are enough factory photos (.plan/023). */}
        <CategoryTiles />
        <ProcessSteps />
        <FamilyNote />
        <ContactBand />
      </main>
      <Footer />
    </>
  )
}

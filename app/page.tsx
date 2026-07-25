import Header from "./components/Header";
import Hero from "./components/Hero";
import Showcase from "./components/Showcase";
import Services from "./components/Services";
import Clients from "./components/Clients";
import About from "./components/About";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Showcase />
        <Services />
        <Clients />
        <About />
      </main>
      <CtaSection />
      <Footer />
    </>
  );
}

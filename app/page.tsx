import Hero from "./components/Hero";
import Showcase from "./components/Showcase";
import Services from "./components/Services";
import Clients from "./components/Clients";
import About from "./components/About";
import CtaSection from "./components/CtaSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Showcase />
      <Services />
      <Clients />
      <About />
      <CtaSection />
    </>
  );
}

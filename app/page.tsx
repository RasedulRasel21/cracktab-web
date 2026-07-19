import Header from "./components/Header";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Clients from "./components/Clients";
import About from "./components/About";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Services />
        <Clients />
        <About />
      </main>
      <Footer />
    </>
  );
}

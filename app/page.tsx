import JsonLd from "./components/JsonLd";
import { organizationSchema } from "./lib/schema";
import HomeHero from "./components/home/HomeHero";
import PhoneStrip from "./components/home/PhoneStrip";
import ProofVideo from "./components/home/ProofVideo";
import LeakCalculator from "./components/home/LeakCalculator";
import BeforeAfter from "./components/home/BeforeAfter";
import MethodTabs from "./components/home/MethodTabs";
import BoxBuilderDemo from "./components/home/BoxBuilderDemo";
import {
  HomeApps,
  HomeServices,
  HomePricing,
  HomeFaqCream,
  HomeClose,
} from "./components/home/HomeSections";

/**
 * Homepage — light "cream" redesign around the CRO offer. The `theme-cream`
 * wrapper switches the colour tokens (see globals.css) for this page only,
 * so the rest of the site keeps the dark theme until it is migrated.
 */
export default function Home() {
  return (
    <div className="theme-cream overflow-x-clip">
      <JsonLd data={organizationSchema} />
      <HomeHero />
      <PhoneStrip />
      <ProofVideo />
      <LeakCalculator />
      <BeforeAfter />
      <MethodTabs />
      <BoxBuilderDemo />
      <HomeApps />
      <HomeServices />
      <HomePricing />
      <HomeFaqCream />
      <HomeClose />
    </div>
  );
}

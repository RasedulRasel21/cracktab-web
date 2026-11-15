import JsonLd from "./components/JsonLd";
import { organizationSchema } from "./lib/schema";
import HomeHero from "./components/home/HomeHero";
import PhoneStrip from "./components/home/PhoneStrip";
import ProofVideo from "./components/home/ProofVideo";
import LeakCalculator from "./components/home/LeakCalculator";
import BeforeAfter from "./components/home/BeforeAfter";
import WidgetGrid from "./components/home/WidgetGrid";
import BoxBuilderDemo from "./components/home/BoxBuilderDemo";
import HomeCroFlow from "./components/home/HomeCroFlow";
import HomeEcomManager from "./components/home/HomeEcomManager";
import {
  HomeApps,
  HomeServices,
  HomeFaqCream,
  HomeClose,
} from "./components/home/HomeSections";

/**
 * Homepage — light "cream" redesign around the CRO offer. Its root keeps
 * `theme-cream` so the site-wide dark-to-cream remaps in globals.css skip it
 * (the homepage is written for cream directly).
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
      <HomeCroFlow />
      <WidgetGrid />
      <HomeEcomManager />
      <BoxBuilderDemo />
      <HomeApps />
      <HomeServices />
      <HomeFaqCream />
      <HomeClose />
    </div>
  );
}

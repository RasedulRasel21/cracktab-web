import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import Accordion from "../components/Accordion";
import CtaBand from "../components/CtaBand";
import { generalFaq } from "../lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: "General questions about working with Cracktab.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title={
          <>
            Frequently asked <span className="text-accent">questions.</span>
          </>
        }
        subtitle="General questions about working with Cracktab. Service-specific questions live on the Services page."
      />

      <section className="pb-20 sm:pb-28">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-3xl">
            <Accordion items={generalFaq} />
          </div>
        </div>
      </section>

      <CtaBand title="Still have questions?" subtitle="Book a free consultation call and we'll walk you through it." />
    </>
  );
}

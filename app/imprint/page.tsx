import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Imprint",
  description: "Company information and legal notice for Cracktab.",
  alternates: { canonical: "/imprint" },
};

export default function ImprintPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Imprint" />

      <section className="pb-24">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-3xl">
          <div className="space-y-10 text-base leading-relaxed text-muted">
            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">Company Information</h2>
              <p>
                {/* TODO(legal): append the registered entity type, e.g. "Cracktab LLC". */}
                Cracktab
                <br />
                6545 Market Ave N, Ste 100, Canton, OH 44721, United States
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">Contact</h2>
              <p>
                Email: hello@cracktab.com
                <br />
                Phone: +1 (234) 901-2506
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">Business Registration</h2>
              <p>
                Ohio Business Registration Number: [Insert Number]
                <br />
                EIN (Employer Identification Number): [Insert Number]
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">Responsible For Content</h2>
              <p>
                [Name of responsible individual/owner], Cracktab, 6545 Market Ave
                N, Ste 100, Canton, OH 44721.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">Additional Offices</h2>
              <p>Bangladesh office: D/233 Mirpur DOHS, Dhaka 1216, Bangladesh.</p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">Disclaimer</h2>
              <p>
                The content on this website is provided for general informational
                purposes only. While we strive for accuracy, we make no
                warranties about the completeness or reliability of any
                information on this site. Any reliance you place on such
                information is strictly at your own risk.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">External Links</h2>
              <p>
                Our website may contain links to third-party websites. We are not
                responsible for the content or privacy practices of external
                sites.
              </p>
            </div>

            <div>
              <h2 className="mb-3 font-display text-xl font-medium text-white">Copyright</h2>
              <p>
                © 2026 Cracktab. All rights reserved. Unauthorized use or
                reproduction of this site&apos;s content is prohibited without
                prior written consent.
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Cracktab collects, uses, and safeguards your information.",
};

function Section({
  n,
  heading,
  children,
}: {
  n?: string;
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-3 font-display text-xl font-medium text-white">
        {n && <span className="text-accent">{n}. </span>}
        {heading}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />

      <section className="pb-24">
        <div className="mx-auto w-full max-w-360 px-5 sm:px-8">
          <div className="max-w-3xl text-base leading-relaxed text-muted">
          {/* TODO(legal): replace with the real publication date. */}
          <p className="mb-2 text-sm text-white/70">
            Effective Date: August 23, 2026
          </p>
          <p className="mb-10">
            Cracktab (&ldquo;Cracktab,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo;
            or &ldquo;our&rdquo;) respects your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your
            information when you visit cracktab.com or use our services. This
            policy is governed by the laws of the State of Ohio and the United
            States.
          </p>

          <div className="space-y-10">
            <Section n="1" heading="Information We Collect">
              <ul className="list-disc space-y-2 pl-5">
                <li>Information you provide directly: name, email address, phone number, company name, and project details.</li>
                <li>Automatically collected information: IP address, browser type, device information, and browsing behavior via cookies.</li>
                <li>Information from third-party tools: analytics and marketing platforms such as Google Analytics, Meta (Facebook) Pixel, Klaviyo, and Calendly.</li>
              </ul>
            </Section>

            <Section n="2" heading="How We Use Your Information">
              <ul className="list-disc space-y-2 pl-5">
                <li>Respond to inquiries and provide quotes</li>
                <li>Deliver and manage our services</li>
                <li>Send project updates and, where you&apos;ve opted in, marketing communications</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
              </ul>
            </Section>

            <Section n="3" heading="Cookies and Tracking Technologies">
              <p>
                We use cookies and similar technologies to understand how
                visitors use our site and to improve your experience. You can
                control cookies through your browser settings; disabling cookies
                may affect site functionality.
              </p>
            </Section>

            <Section n="4" heading="Third-Party Services">
              <p>
                We may share information with trusted third-party service
                providers who help us operate — including hosting providers,
                email marketing (Klaviyo), analytics (Google Analytics),
                scheduling (Calendly), and payment processors (Stripe). These
                providers are only permitted to use your information to perform
                services on our behalf.
              </p>
            </Section>

            <Section n="5" heading="Data Sharing and Disclosure">
              <p>
                We do not sell your personal information. We may disclose
                information if required by law, to protect our rights, or in
                connection with a business transfer such as a merger or
                acquisition.
              </p>
            </Section>

            <Section n="6" heading="Data Retention">
              <p>
                We retain personal information only as long as necessary to
                fulfill the purposes described in this policy, unless a longer
                retention period is required by law.
              </p>
            </Section>

            <Section n="7" heading="Your Rights and Choices">
              <p>
                Depending on where you live, you may have rights to access,
                correct, or delete your personal information, and to opt out of
                marketing. California residents may have additional rights under
                the CCPA; EEA residents may have rights under the GDPR. To
                exercise any of these rights, contact us at hello@cracktab.com.
              </p>
            </Section>

            <Section n="8" heading="Children's Privacy">
              <p>
                Our services are not directed to individuals under 13, and we do
                not knowingly collect personal information from children.
              </p>
            </Section>

            <Section n="9" heading="Data Security">
              <p>
                We use reasonable administrative, technical, and physical
                safeguards to protect your information. No method of transmission
                over the internet is 100% secure.
              </p>
            </Section>

            <Section n="10" heading="International Visitors">
              <p>
                If you are visiting from outside the United States, your
                information may be transferred to and processed in the United
                States, where data protection laws may differ from those in your
                jurisdiction.
              </p>
            </Section>

            <Section n="11" heading="Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time. Changes will
                be posted on this page with a new effective date.
              </p>
            </Section>

            <Section n="12" heading="Contact Us">
              <p>
                Questions can be sent to hello@cracktab.com or to our registered
                office at 6545 Market Ave N, Ste 100, Canton, OH 44721.
              </p>
            </Section>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}

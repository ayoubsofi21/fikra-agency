import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { Container, Section } from '@/components/ui'
import { PageTransition } from '@/components/layout'

const LegalPage = ({ title, content, lastUpdated }) => {
  const { t } = useTranslation()
  const scrollRef = useRef(null)


  return (
    <div ref={scrollRef}>
      <Helmet>
        <title>{title} - {t('common.brandFull')}</title>
        <meta name="description" content={content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()} />
      </Helmet>

      <PageTransition>
        <Section variant="light" spacing="large">
          <Container>
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-semibold text-text mb-8">{title}</h1>
              <p className="text-sm text-muted mb-12">
                {t('legal.lastUpdated')}: {lastUpdated}
              </p>

              {/* Static, locally-authored policy HTML (no user input) */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </Container>
        </Section>
      </PageTransition>
    </div>
  )
}

const PrivacyContent = `
<p>At FIKRA Agency ("we," "our," or "us"), we are committed to protecting your privacy and handling your personal information with care. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website fikra.agency (the "Site") or engage our services.</p>

<h2>1. Information We Collect</h2>
<p>We collect information that you provide directly to us, including:</p>
<ul>
  <li>Contact information: name, email address, phone number, company name, and website URL.</li>
  <li>Project details: descriptions of your needs, goals, budget, and timeline when you request a quote.</li>
  <li>Files you choose to upload, such as brand assets, wireframes, or reference materials.</li>
  <li>Communication history: records of your correspondence with our team.</li>
</ul>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to:</p>
<ul>
  <li>Provide, operate, and maintain our services.</li>
  <li>Communicate with you about your projects, inquiries, and our services.</li>
  <li>Send you service-related notifications and updates.</li>
  <li>Improve our website and services based on your feedback.</li>
  <li>Comply with legal obligations and prevent fraud.</li>
</ul>

<h2>3. Legal Basis for Processing (GDPR)</h2>
<p>If you are from the European Economic Area (EEA), our legal basis for collecting and using your personal information depends on the context. We may process your information because it is necessary for our legitimate interests, to perform a contract, or with your consent.</p>

<h2>4. Disclosure of Your Information</h2>
<p>We do not sell your personal information. We may share information with trusted third-party service providers who assist us in operating our website and services (such as hosting providers, email delivery services, and payment processors), and only when required by law.</p>

<h2>5. Data Security</h2>
<p>We implement reasonable security measures to protect your personal information. However, no electronic transmission over the internet is ever fully secure, and we cannot guarantee absolute security.</p>

<h2>6. Your Rights</h2>
<p>Depending on your location, you may have the right to access, correct, delete, or restrict processing of your personal information. To exercise these rights, contact us at contact@fikra.agency.</p>

<h2>7. Cookies</h2>
<p>Our website uses cookies to enhance your experience, analyze site usage, and personalize content. You can control cookie preferences through your browser settings.</p>

<h2>8. Children's Privacy</h2>
<p>Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16.</p>

<h2>9. Changes to This Policy</h2>
<p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "last updated" date.</p>

<h2>10. Contact Us</h2>
<p>If you have any questions about this Privacy Policy, please contact us at contact@fikra.agency.</p>
`

const TermsContent = `
<p>Welcome to FIKRA Agency. By accessing our website or engaging our services, you agree to be bound by these Terms of Service. Please read them carefully before using our services.</p>

<h2>1. Services</h2>
<p>FIKRA Agency provides custom web development, SaaS platform development, UI/UX design, ready-made digital solutions, and related services. We reserve the right to modify or discontinue any service at our discretion.</p>

<h2>2. Client Obligations</h2>
<p>You agree to provide accurate information, timely feedback, and necessary access to our team. You are responsible for obtaining any third-party licenses or permissions required for your project.</p>

<h2>3. Payments</h2>
<p>Unless otherwise agreed, deposits are due upon project commencement, with remaining milestones paid according to the agreed schedule. Late payments may result in delays or suspension of work.</p>

<h2>4. Intellectual Property</h2>
<p>Upon full payment, you own the final deliverables created specifically for your project. We retain ownership of our pre-existing code, frameworks, and general know-how. Ready-made solutions are licensed, not sold — you receive a non-exclusive right to use them.</p>

<h2>5. Confidentiality</h2>
<p>Both parties agree to keep confidential any proprietary information disclosed during the engagement, except as required by law.</p>

<h2>6. Warranties</h2>
<p>Our services are provided "as is" to the extent permitted by law. We warrant that our services will perform substantially as described for 30 days after launch, during which we will fix defects at no cost.</p>

<h2>7. Limitation of Liability</h2>
<p>To the maximum extent permitted by law, FIKRA Agency shall not be liable for indirect, incidental, or consequential damages arising from the use of our services.</p>

<h2>8. Governing Law</h2>
<p>These Terms are governed by the laws of Morocco, without regard to conflict of law principles.</p>

<h2>9. Changes to Terms</h2>
<p>We may update these terms from time to time. Continued use of our services after changes constitutes acceptance of the new terms.</p>

<h2>10. Contact</h2>
<p>Questions about these Terms? Contact us at contact@fikra.agency.</p>
`

const Privacy = () => (
  <LegalPage
    title="Privacy Policy"
    content={PrivacyContent}
    lastUpdated="November 10, 2026"
  />
)

const Terms = () => (
  <LegalPage
    title="Terms of Service"
    content={TermsContent}
    lastUpdated="November 10, 2026"
  />
)

export { Privacy, Terms }

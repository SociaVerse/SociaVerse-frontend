import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | SociaVerse',
  description: 'Terms of Service for SociaVerse platform.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Terms of Service</h1>
          <p className="text-sm text-slate-500">Last Updated: March 2026</p>
        </header>

        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">1. Agreement to Terms</h2>
            <p className="leading-relaxed">
              By accessing or using SociaVerse, a platform dedicated to university events and student communities, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access the Service.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">2. Description of Service</h2>
            <p className="leading-relaxed">
              SociaVerse provides a digital campus platform that allows students to discover events, share study materials, interact in communities, and connect with peers both globally and within their specific universities.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">3. User Accounts & Registration</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>You must provide accurate, complete, and current information when registering for an account.</li>
              <li>You are responsible for safeguarding your login credentials and tracking any activity under your account.</li>
              <li>You must immediately notify SociaVerse of any unauthorized use or security breaches regarding your account.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">4. University Affiliation & Verification</h2>
            <p className="leading-relaxed">
              Certain features of SociaVerse, such as internal college events and study hubs, are restricted based on your declared university affiliation. You agree not to misrepresent your educational institution. SociaVerse reserves the right to verify your academic status and revoke college-specific privileges if fraudulent activity is detected.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">5. Community Guidelines & Acceptable Use</h2>
            <p className="leading-relaxed">
              You agree not to use the platform to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.</li>
              <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation.</li>
              <li>Upload or distribute virues, malware, or any other malicious code.</li>
              <li>Harvest or collect email addresses or other contact information of other users without their consent.</li>
              <li>Distribute copyrighted academic materials to which you do not have distribution rights.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">6. Content Ownership & Licenses</h2>
            <p className="leading-relaxed">
              You retain your rights to any content you submit, post, or display on or through SociaVerse. By submitting content (including event details, notes, and profile information), you grant us a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such content in any and all media or distribution methods.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">7. Termination</h2>
            <p className="leading-relaxed">
              We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. All provisions of the Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">8. Changes to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice via the platform or email before any material changes take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </div>

        </section>
      </div>
    </div>
  )
}

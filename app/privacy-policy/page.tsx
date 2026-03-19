import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | SociaVerse',
  description: 'Privacy Policy for SociaVerse platform.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto space-y-10">
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last Updated: March 2026</p>
        </header>

        <section className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">1. Introduction</h2>
            <p className="leading-relaxed">
              Welcome to SociaVerse. We respect your privacy and are committed to protecting your personal data. This Privacy Policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">2. The Data We Collect About You</h2>
            <p className="leading-relaxed">
              Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier, and date of birth.</li>
              <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
              <li><strong>Academic Data</strong> includes your college, university, or educational institution affiliation.</li>
              <li><strong>Profile Data</strong> includes your username and password, purchases or orders made by you, your interests, preferences, and biographical information.</li>
              <li><strong>Usage Data</strong> includes information about how you use our website, events, and study hubs.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">3. How We Use Your Personal Data</h2>
            <p className="leading-relaxed">
              We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>To register you as a new user.</li>
              <li>To manage our relationship with you, including notifying you about changes to our terms or privacy policy.</li>
              <li>To administer and protect our business and this website (including troubleshooting, data analysis, testing, system maintenance).</li>
              <li>To deliver relevant event content and study materials tailored to your university network.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">4. University-Specific Data Sharing</h2>
            <p className="leading-relaxed">
              SociaVerse hosts "University Modes" which allow posts, events, and study materials to be securely partitioned to members of your specific academic institution. By joining a university network on SociaVerse, you consent to your profile and relevant interactions being visible to other verified members of that same institution, acting under the restrictions of our visibility modes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">5. Data Security</h2>
            <p className="leading-relaxed">
              We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">6. Data Retention</h2>
            <p className="leading-relaxed">
              We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the data, the potential risk of harm from unauthorised use.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">7. Your Legal Rights</h2>
            <p className="leading-relaxed">
              Under certain circumstances, you have rights under data protection laws in relation to your personal data. These include the right to: Request access to your personal data, request correction of your personal data, request erasure of your personal data, object to processing of your personal data, request restriction of processing your personal data, and request transfer of your personal data.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-slate-200">8. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact us using the support channels provided on the SociaVerse platform.
            </p>
          </div>

        </section>
      </div>
    </div>
  )
}

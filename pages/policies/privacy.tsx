import Head from 'next/head';
import Link from 'next/link';
import Card from '../../components/Card';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Privacy Policy - Cehpoint</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4">
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            Cehpoint
          </span>
        </Link>

        <Card className="mt-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal information (name, email, phone number)</li>
                <li>Professional information (skills, experience, timezone)</li>
                <li>Payment account details</li>
                <li>Task submissions and performance data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>To match you with suitable tasks</li>
                <li>To process payments</li>
                <li>To improve our platform</li>
                <li>To communicate about tasks and opportunities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Data Security</h2>
              <p>We implement industry-standard security measures to protect your personal information.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Request data correction</li>
                <li>Request data deletion</li>
                <li>Opt-out of communications</li>
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

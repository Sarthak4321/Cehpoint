import Head from 'next/head';
import Link from 'next/link';
import Card from '../../components/Card';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Terms of Service - Cehpoint</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4">
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            Cehpoint
          </span>
        </Link>

        <Card className="mt-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>By accessing and using Cehpoint's platform, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Worker Obligations</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate information during registration</li>
                <li>Complete assigned tasks to the best of your ability</li>
                <li>Meet all deadlines specified for accepted tasks</li>
                <li>Maintain professional conduct at all times</li>
                <li>Not engage in plagiarism or fraudulent activities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Payment Terms</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Payments are processed upon task completion and approval</li>
                <li>Weekly payouts are subject to task completion</li>
                <li>Withdrawal requests are processed within 3-5 business days</li>
                <li>Cehpoint reserves the right to withhold payment for low-quality work</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Account Termination</h2>
              <p>Cehpoint reserves the right to suspend or terminate accounts for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation of terms of service</li>
                <li>Repeated submission of low-quality work</li>
                <li>Fraudulent activities or misrepresentation</li>
                <li>Failure to meet deadlines consistently</li>
                <li>Unprofessional conduct</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p>All work completed on Cehpoint projects becomes the property of Cehpoint and its clients upon payment.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Liability</h2>
              <p>Cehpoint is not liable for any damages arising from the use of our platform or services.</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

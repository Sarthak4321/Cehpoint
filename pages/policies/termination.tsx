import Head from 'next/head';
import Link from 'next/link';
import Card from '../../components/Card';

export default function TerminationPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Account Termination Policy - Cehpoint</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4">
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            Cehpoint
          </span>
        </Link>

        <Card className="mt-8">
          <h1 className="text-3xl font-bold mb-6">Account Termination Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">Grounds for Termination</h2>
              <p>Cehpoint reserves the right to suspend or terminate accounts for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Repeated submission of low-quality or incomplete work</li>
                <li>Plagiarism or copyright infringement</li>
                <li>Fraudulent activities or misrepresentation</li>
                <li>Violation of terms of service</li>
                <li>Unprofessional conduct or harassment</li>
                <li>Multiple missed deadlines</li>
                <li>Attempting to circumvent platform policies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Termination Process</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>First offense: Warning and guidance</li>
                <li>Second offense: Temporary suspension (7-30 days)</li>
                <li>Third offense or severe violation: Permanent termination</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Account Suspension</h2>
              <p>During suspension:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No access to new tasks</li>
                <li>Existing tasks must be completed</li>
                <li>Pending payments will be processed</li>
                <li>Account can be reviewed for reinstatement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Permanent Termination</h2>
              <p>Upon permanent termination:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All access to the platform is revoked</li>
                <li>Pending approved payments will be processed</li>
                <li>Unapproved work may be forfeited</li>
                <li>No possibility of reinstatement</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Appeal Process</h2>
              <p>Workers may appeal termination decisions by contacting support@cehpoint.com within 14 days with supporting evidence.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Full-Time Opportunities</h2>
              <p>Workers with excellent performance records may be offered full-time employment opportunities with Cehpoint.</p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

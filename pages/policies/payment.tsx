import Head from 'next/head';
import Link from 'next/link';
import Card from '../../components/Card';

export default function PaymentPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Payment Policy - Cehpoint</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4">
        <Link href="/">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
            Cehpoint
          </span>
        </Link>

        <Card className="mt-8">
          <h1 className="text-3xl font-bold mb-6">Payment Policy</h1>
          
          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold mb-3">Payment Structure</h2>
              <p>Workers are paid based on completed and approved tasks. Each task has a specified weekly payout amount.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Payment Process</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Submit completed tasks through the platform</li>
                <li>Tasks are reviewed by admin within 2-3 business days</li>
                <li>Upon approval, payment is added to your balance</li>
                <li>You can withdraw your balance at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Withdrawal</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Minimum withdrawal amount: $50</li>
                <li>Withdrawals processed within 3-5 business days</li>
                <li>Verified payout account required</li>
                <li>No fees for standard withdrawals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">Payment Rejection</h2>
              <p>Payments may be withheld or rejected for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Work that doesn't meet quality standards</li>
                <li>Plagiarized content</li>
                <li>Missed deadlines without prior communication</li>
                <li>Violation of project requirements</li>
              </ul>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}

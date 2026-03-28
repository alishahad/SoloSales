import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for solo founders
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving sales.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
          {/* Free Plan */}
          <div className="rounded-3xl p-8 ring-1 ring-gray-200 xl:p-10">
            <h3 className="text-lg font-semibold leading-8 text-gray-900">Free</h3>
            <p className="mt-4 text-sm leading-6 text-gray-600">Perfect for trying out the platform and getting your first outbound campaign ready.</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">$0</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
            </p>
            <Link
              to="/signup"
              className="mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                1 Project
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                Limited AI generations
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                Basic pipeline tracking
              </li>
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="rounded-3xl p-8 ring-2 ring-indigo-600 xl:p-10">
            <div className="flex items-center justify-between gap-x-4">
              <h3 className="text-lg font-semibold leading-8 text-indigo-600">Pro</h3>
              <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">Most popular</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-gray-600">Everything you need to scale your outbound sales and manage multiple products.</p>
            <p className="mt-6 flex items-baseline gap-x-1">
              <span className="text-4xl font-bold tracking-tight text-gray-900">$29</span>
              <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
            </p>
            <Link
              to="/signup"
              className="mt-6 block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                Unlimited Projects
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                Unlimited AI generations
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                Export to Markdown/PDF
              </li>
              <li className="flex gap-x-3">
                <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                Priority support
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Zap, Shield, BarChart, Sparkles, Target, MessageSquare } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="bg-white selection:bg-indigo-100 selection:text-indigo-900">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} />
        </div>
        
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-500/20">
                  What's new
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Just shipped v1.0</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Your AI-powered <span className="text-indigo-600">outbound sales</span> system
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              SoloSales.OS helps solo founders and tiny teams generate complete outbound sales strategies, scripts, and pipelines using AI. Stop guessing and start closing.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
              >
                Start for free
              </Link>
              <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 group">
                Log in <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
          
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <div className="rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                <div className="rounded-md bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-red-400" />
                      <div className="h-3 w-3 rounded-full bg-amber-400" />
                      <div className="h-3 w-3 rounded-full bg-green-400" />
                    </div>
                    <div className="ml-4 flex-1 text-center text-xs font-medium text-gray-500">app.solosales.os</div>
                  </div>
                  <div className="p-6 bg-white grid grid-cols-2 gap-6 h-[400px] w-[600px] overflow-hidden">
                    <div className="space-y-4">
                      <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-full bg-gray-100 rounded" />
                      <div className="h-3 w-5/6 bg-gray-100 rounded" />
                      <div className="h-3 w-4/6 bg-gray-100 rounded" />
                      
                      <div className="mt-8 h-4 w-1/4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-24 w-full bg-indigo-50 rounded-lg border border-indigo-100 p-4">
                        <div className="h-3 w-3/4 bg-indigo-200 rounded mb-2" />
                        <div className="h-3 w-full bg-indigo-100 rounded mb-2" />
                        <div className="h-3 w-5/6 bg-indigo-100 rounded" />
                      </div>
                    </div>
                    <div className="space-y-4 border-l border-gray-100 pl-6">
                      <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
                      <div className="space-y-3 mt-4">
                        <div className="h-12 w-full bg-white border border-gray-200 rounded-lg shadow-sm flex items-center px-3 gap-3">
                          <div className="h-6 w-6 rounded-full bg-gray-200" />
                          <div className="space-y-1 flex-1">
                            <div className="h-2 w-1/2 bg-gray-300 rounded" />
                            <div className="h-2 w-1/3 bg-gray-200 rounded" />
                          </div>
                        </div>
                        <div className="h-12 w-full bg-white border border-gray-200 rounded-lg shadow-sm flex items-center px-3 gap-3">
                          <div className="h-6 w-6 rounded-full bg-gray-200" />
                          <div className="space-y-1 flex-1">
                            <div className="h-2 w-1/2 bg-gray-300 rounded" />
                            <div className="h-2 w-1/3 bg-gray-200 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto mt-8 max-w-7xl px-6 sm:mt-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything you need</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From idea to closed won
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We provide the tools, templates, and tracking you need to build a repeatable sales engine.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
                  <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                </div>
                AI-Generated Assets
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Get custom email sequences, LinkedIn scripts, and discovery call questions tailored to your specific product and market.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
                  <Target className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                </div>
                Simple Pipeline
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Track your leads with a simple, drag-and-drop Kanban board designed specifically for solo founders.
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10">
                  <MessageSquare className="h-5 w-5 text-indigo-600" aria-hidden="true" />
                </div>
                Proven Frameworks
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Built on top of successful sales methodologies used by top B2B SaaS companies. No more guessing what to say.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white mt-32">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start selling?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join other solo founders who are building repeatable sales engines with SoloSales.OS.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/signup"
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
              >
                Get started for free
              </Link>
              <Link to="/pricing" className="text-sm font-semibold leading-6 text-white group">
                View pricing <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

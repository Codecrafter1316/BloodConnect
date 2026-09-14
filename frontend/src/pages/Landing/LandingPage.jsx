import { ArrowRight, Heart, ShieldCheck, Stethoscope, Users, Droplets, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Lives supported', value: '12K+' },
  { label: 'Active donors', value: '1.4K' },
  { label: 'Emergency requests', value: '860' },
  { label: 'Hospitals connected', value: '90+' },
];

const steps = [
  { title: 'Create a request', description: 'Recipients quickly post urgent blood needs and location details.', icon: Stethoscope },
  { title: 'Find donors', description: 'Donors with matching blood types can receive request alerts.', icon: Users },
  { title: 'Connect & help', description: 'Approved matches can coordinate and save lives faster.', icon: Heart },
];

const LandingPage = () => (
  <div className="bg-white min-h-screen text-slate-800">
    <header className="bg-white/90 backdrop-blur-sm border-slate-200 border-b">
      <div className="flex justify-between items-center mx-auto px-4 sm:px-6 lg:px-8 py-5 max-w-7xl">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-red-600 shadow-sm rounded-xl w-10 h-10 text-white">
            <Heart className="w-5 h-5" fill="currentColor" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-lg">BloodConnect</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-[0.22em]">save lives together</div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="font-medium text-slate-600 hover:text-red-600 text-sm">How it works</a>
          <a href="#benefits" className="font-medium text-slate-600 hover:text-red-600 text-sm">Benefits</a>
          <a href="#about" className="font-medium text-slate-600 hover:text-red-600 text-sm">About</a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 border border-slate-200 hover:border-red-200 rounded-full font-medium text-slate-700 hover:text-red-700 text-sm transition">
            Login
          </Link>
          <Link to="/register" className="bg-red-600 hover:bg-red-700 shadow-sm px-4 py-2 rounded-full font-semibold text-white text-sm transition">
            Join now
          </Link>
        </div>
      </div>
    </header>

    <main>
      <section className="gap-10 grid lg:grid-cols-2 mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 max-w-7xl">
        <div className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-red-50 mb-5 px-3 py-1.5 border border-red-200 rounded-full w-fit font-semibold text-red-700 text-xs uppercase tracking-[0.18em]">
            <Droplets className="w-3.5 h-3.5" />
            Blood donation network
          </div>

          <h1 className="max-w-xl font-black text-slate-900 text-4xl sm:text-5xl tracking-tight">
            Fast blood connections for donors and recipients.
          </h1>

          <p className="mt-6 max-w-xl text-slate-600 text-lg leading-8">
            BloodConnect helps patients find compatible donors quickly while helping healthy volunteers respond to urgent donation requests in real time.
          </p>

          <div className="flex sm:flex-row flex-col gap-4 mt-8">
            <Link to="/register" className="inline-flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 shadow-sm px-6 py-3 rounded-full font-semibold text-white text-base transition">
              Become a donor
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="inline-flex justify-center items-center px-6 py-3 border border-slate-200 hover:border-red-200 rounded-full font-semibold text-slate-700 hover:text-red-700 text-base transition">
              Find blood
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-8 mt-10 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              Secure matching
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              Verified profiles
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-slate-50 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 border border-slate-200 rounded-4xl">
            <div className="bg-white shadow-sm p-5 rounded-3xl ring-1 ring-slate-200">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-slate-500 text-sm">Urgent need</p>
                  <h2 className="mt-1 font-bold text-slate-900 text-2xl">O+ Blood</h2>
                </div>
                <div className="bg-red-100 p-2 rounded-full text-red-600">
                  <Heart className="w-5 h-5" fill="currentColor" />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-sm">Hospital</div>
                  <div className="mt-1 font-semibold text-slate-900">City General Hospital</div>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
                  <div className="text-slate-500 text-sm">Units required</div>
                  <div className="mt-1 font-semibold text-slate-900">4 units</div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-red-600 mt-6 px-4 py-3 rounded-xl text-white">
                <span className="font-medium text-sm">Emergency match</span>
                <span className="bg-white/15 px-2 py-1 rounded-full font-semibold text-xs">Priority</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-slate-50 py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-red-600 text-sm uppercase tracking-[0.2em]">How it works</p>
            <h2 className="mt-3 font-bold text-slate-900 text-3xl">A simple process, life-saving impact</h2>
          </div>

          <div className="gap-6 grid md:grid-cols-3 mt-12">
            {steps.map(({ title, description, icon: Icon }) => (
              <div key={title} className="bg-white shadow-sm p-6 border border-slate-200 rounded-2xl">
                <div className="inline-flex bg-red-100 mb-5 p-3 rounded-xl text-red-600">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-xl">{title}</h3>
                <p className="mt-3 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="benefits" className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="gap-8 grid lg:grid-cols-2">
          <div className="bg-white shadow-sm p-8 border border-slate-200 rounded-3xl">
            <p className="font-semibold text-red-600 text-sm uppercase tracking-[0.2em]">For donors</p>
            <h3 className="mt-4 font-bold text-slate-900 text-3xl">Help when it matters most</h3>
            <ul className="space-y-4 mt-6 text-slate-600">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 w-5 h-5 text-red-600" /> Update your availability and donation profile.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 w-5 h-5 text-red-600" /> Receive relevant matches based on blood type and location.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 w-5 h-5 text-red-600" /> Coordinate quickly and confidently through the platform.</li>
            </ul>
          </div>

          <div className="bg-white shadow-sm p-8 border border-slate-200 rounded-3xl">
            <p className="font-semibold text-red-600 text-sm uppercase tracking-[0.2em]">For recipients</p>
            <h3 className="mt-4 font-bold text-slate-900 text-3xl">Get support from the right people</h3>
            <ul className="space-y-4 mt-6 text-slate-600">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 w-5 h-5 text-red-600" /> Submit a request with your care details and urgency.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 w-5 h-5 text-red-600" /> Search for matching donors by blood type and city.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 w-5 h-5 text-red-600" /> Track request and connection status from one place.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-red-600 py-16 text-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="gap-6 grid md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-red-500/10 p-6 border border-red-500/40 rounded-2xl text-center">
                <div className="font-black text-3xl">{stat.value}</div>
                <div className="mt-2 text-red-50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto px-4 sm:px-6 lg:px-8 py-16 max-w-7xl">
        <div className="bg-slate-50 shadow-sm p-8 border border-slate-200 rounded-4xl text-center">
          <p className="font-semibold text-red-600 text-sm uppercase tracking-[0.22em]">Ready to help?</p>
          <h2 className="mt-3 font-bold text-slate-900 text-3xl">Join BloodConnect and make a difference.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            From emergency donation requests to reliable donor coordination, BloodConnect brings communities together to accelerate care and save lives.
          </p>
          <div className="flex sm:flex-row flex-col justify-center gap-4 mt-8">
            <Link to="/register" className="bg-red-600 hover:bg-red-700 shadow-sm px-6 py-3 rounded-full font-semibold text-white text-sm transition">
              Create account
            </Link>
            <Link to="/login" className="bg-white px-6 py-3 border border-slate-200 hover:border-red-200 rounded-full font-semibold text-slate-700 hover:text-red-700 text-sm transition">
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </main>

    <footer className="bg-white border-slate-200 border-t">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl text-slate-500 text-sm">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-red-600 rounded-lg w-8 h-8 text-white">
            <Heart className="w-4 h-4" fill="currentColor" />
          </div>
          <span className="font-semibold text-slate-700">BloodConnect</span>
        </div>
        <div>© 2026 BloodConnect. Connecting donors and recipients.</div>
      </div>
    </footer>
  </div>
);

export default LandingPage;

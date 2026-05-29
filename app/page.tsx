import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Activity, MapPin, HeartPulse, Clock, Users, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation */}
      <nav className="w-full glass fixed top-0 z-50 transition-all duration-300 border-b border-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 text-white font-bold text-xl">
                M
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-teal-600 tracking-tight">
                MediHelp
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium text-sm">
              <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-primary-600 transition-colors">How it Works</a>
              <a href="#testimonials" className="hover:text-primary-600 transition-colors">Testimonials</a>
            </div>

            <div className="flex gap-4">
              <Link
                href="/auth"
                className="px-6 py-2.5 rounded-full text-slate-700 font-semibold hover:bg-slate-100 transition-colors hidden sm:block"
              >
                Log in
              </Link>
              <Link
                href="/auth?mode=signup"
                className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-semibold shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-gradient-to-br from-primary-50 via-white to-teal-50/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Text Content */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-teal-100 text-teal-700 font-medium text-sm shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
                </span>
                Introducing MediHelp 2.0
              </div>

              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Healthcare that <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500">
                  moves with you.
                </span>
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                A unified platform connecting patients with top specialists, managing medical records, and providing real-time blood bank maps.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/auth?mode=signup"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-primary-600 text-white font-bold text-lg shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-all hover:-translate-y-1"
                >
                  Join as Patient
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/doctor"
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-lg shadow-sm hover:bg-slate-50 transition-all"
                >
                  Join as Doctor
                </Link>
              </div>

              <div className="pt-8 flex items-center gap-4 text-sm font-medium text-slate-500">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  🚀
                </div>
                <div>Be among the first to experience the future of healthcare.</div>
              </div>
            </div>

            {/* Illustration Content */}
            <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in slide-in-from-right-8 duration-1000 delay-150">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-200/40 to-teal-200/40 blur-3xl rounded-full -z-10 mix-blend-multiply"></div>

              <div className="relative w-full aspect-square max-w-lg">
                <Image
                  src="/hero.png"
                  alt="Modern Medical Concept"
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700"
                  priority
                />

                {/* Floating cards */}
                <div className="absolute top-10 -left-4 sm:-left-8 glass px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
                  <div className="bg-teal-100 p-2.5 rounded-xl text-teal-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Secure Data</div>
                    <div className="text-xs text-slate-500 font-medium">HIPAA Compliant</div>
                  </div>
                </div>

                <div className="absolute bottom-10 -right-4 sm:-right-8 glass px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <div className="bg-primary-100 p-2.5 rounded-xl text-primary-600">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Live Blood Map</div>
                    <div className="text-xs text-slate-500 font-medium">12 Donors Nearby</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3">Core Features</h2>
            <h3 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Everything you need to manage your health.</h3>
            <p className="text-lg text-slate-600">We've built a comprehensive suite of tools designed to put you back in control of your medical journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Activity,
                title: "Smart Dashboard",
                desc: "Monitor your vitals, upcoming appointments, and recent lab results in one unified, beautiful interface.",
                color: "text-blue-600",
                bg: "bg-blue-50"
              },
              {
                icon: MapPin,
                title: "Live Blood Map",
                desc: "In emergencies, instantly locate nearby blood banks and registered donors based on specific blood types.",
                color: "text-red-600",
                bg: "bg-red-50"
              },
              {
                icon: HeartPulse,
                title: "Doctor Connectivity",
                desc: "Seamlessly share your medical profile with verified specialists and get consultations without the hassle.",
                color: "text-teal-600",
                bg: "bg-teal-50"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-600 leading-relaxed mb-6">{feature.desc}</p>
                <div className="flex items-center text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors cursor-pointer">
                  Learn more <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Launch Features / Banner Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-white mb-2">100% Free</div>
              <div className="text-slate-400 font-medium">For Patients</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-teal-400 mb-2">Real-time</div>
              <div className="text-slate-400 font-medium">Blood Bank Sync</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-primary-400 mb-2">Secure</div>
              <div className="text-slate-400 font-medium">Data Encryption</div>
            </div>
            <div>
              <div className="text-2xl md:text-3xl font-extrabold text-white mb-2">24/7</div>
              <div className="text-slate-400 font-medium">Available Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-primary-200 blur-3xl rounded-full opacity-30"></div>
              <div className="relative bg-white p-2 rounded-3xl shadow-2xl border border-slate-100 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image
                  src="/auth.png"
                  alt="App Preview"
                  width={600}
                  height={500}
                  className="rounded-2xl"
                />
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <h2 className="text-primary-600 font-bold tracking-wide uppercase text-sm mb-3">How it works</h2>
              <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8">Simple steps to better health.</h3>

              <div className="space-y-8">
                {[
                  { step: "01", title: "Create your profile", desc: "Sign up securely and fill in your basic medical history." },
                  { step: "02", title: "Connect with providers", desc: "Find verified doctors and share your data seamlessly." },
                  { step: "03", title: "Manage everything", desc: "Track appointments, blood requirements, and reports from your dashboard." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 text-primary-700 font-bold text-xl flex items-center justify-center">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h4>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 to-primary-700"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 rounded-l-full blur-3xl transform translate-x-1/3"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to transform your healthcare experience?</h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">Join thousands of patients and doctors who are already using MediHelp to simplify medical data and save lives.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth?mode=signup"
              className="px-8 py-4 rounded-full bg-white text-primary-700 font-bold text-lg shadow-xl hover:bg-slate-50 transition-all hover:scale-105"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-white font-bold">
                  M
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">MediHelp</span>
              </div>
              <p className="text-slate-400 mb-6">Making healthcare accessible, secure, and unified for everyone.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blood Map</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">For Doctors</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Company</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Legal</h4>
              <ul className="space-y-4">
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2026 MediHelp Inc. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

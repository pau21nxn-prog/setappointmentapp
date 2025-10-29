import Hero from '@/components/sections/Hero';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import Testimonials from '@/components/sections/Testimonials';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <Portfolio />
      <Testimonials />

      {/* Booking Section Placeholder - Will be added in Sprint 4 */}
      <section id="booking" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Book your free consultation today and let's discuss your project
          </p>
          <div className="p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-gray-500">Booking form will be available soon (Sprint 4)</p>
          </div>
        </div>
      </section>
    </main>
  );
}

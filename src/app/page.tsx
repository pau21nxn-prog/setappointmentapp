import Hero from '@/components/sections/Hero';
import MarketingVideo from '@/components/sections/MarketingVideo';
import Services from '@/components/sections/Services';
import Portfolio from '@/components/sections/Portfolio';
import Testimonials from '@/components/sections/Testimonials';
import BookingForm from '@/components/sections/BookingForm';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <MarketingVideo />
      <Services />
      <Portfolio />
      <Testimonials />
      <BookingForm />
    </main>
  );
}

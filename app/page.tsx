import Hero from "./components/Hero";
import ScrollytellingFeatures from "./components/ScrollytellingFeatures";
import StatsBar from "./components/StatsBar";
import SecondaryFeatureGrid from "./components/SecondaryFeatureGrid";
import Mentors from "./components/Mentors";
import Testimonials from "./components/Testimonials";
import TrustGrid from "./components/TrustGrid";
import CallBanner from "./components/CallBanner";
import MediaCoverage from "./components/MediaCoverage";
import Partners from "./components/Partners";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ScrollytellingFeatures />
      <StatsBar />
      <SecondaryFeatureGrid />
      <Mentors />
      <Testimonials />
      <TrustGrid />
      <CallBanner />
      <MediaCoverage />
      <Partners />
      <Footer />
    </main>
  );
}

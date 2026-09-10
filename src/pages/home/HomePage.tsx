import { Seo } from '@/components/ui/Seo'
import { Hero } from '@/components/sections/Hero'
import { TrustBar } from '@/components/sections/TrustBar'
import { OurHeritage } from '@/components/sections/OurHeritage'
import { Stats } from '@/components/sections/Stats'
import { ProjectsPreview } from '@/components/sections/ProjectsPreview'
import { LocationHighlights } from '@/components/sections/LocationHighlights'
import { PremiumPlots } from '@/components/sections/PremiumPlots'
import { Amenities } from '@/components/sections/Amenities'
import { WhyChoose } from '@/components/sections/WhyChoose'
import { Investment } from '@/components/sections/Investment'
import { Testimonials } from '@/components/sections/Testimonials'
import { FaqPreview } from '@/components/sections/FaqPreview'
import { CTABand } from '@/components/sections/CTABand'

export default function HomePage() {
  return (
    <>
      <Seo
        title="Premium DTCP Approved Residential Plots"
        description="Signature City — premium DTCP approved residential plots in a gated community. Clear titles, bank loans, and thoughtful planning. Book a site visit today."
      />
      <Hero />
      <TrustBar />
      <OurHeritage />
      <Stats />
      <ProjectsPreview />
      <LocationHighlights />
      <PremiumPlots />
      <Amenities />
      <WhyChoose />
      <Investment />
      <Testimonials />
      <FaqPreview />
      <CTABand />
    </>
  )
}

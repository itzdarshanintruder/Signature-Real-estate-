import { useState } from 'react'
import { ChevronRight, MapPin, X } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { buttonStyles } from '@/components/ui/button-styles'
import { useProjectPlots } from '@/hooks/use-project-plots'
import type { ProjectPlot } from '@/services/admin/projectPlotService'
import { cn } from '@/utils/cn'

interface ProjectPlotExplorerProps {
  projectId: string
  projectName: string
}

export function ProjectPlotExplorer({ projectId, projectName }: ProjectPlotExplorerProps) {
  const { data: plots = [], isLoading } = useProjectPlots(projectId)
  const [selectedPlot, setSelectedPlot] = useState<ProjectPlot | null>(null)
  
  if (isLoading || plots.length === 0) return null

  const availablePlots = plots.filter((p) => p.status === 'Available')
  
  return (
    <>
      <section className="bg-cream-100 py-20 lg:py-32">
        <Container>
          <div className="mb-12 md:mb-16">
            <h2 className="font-display text-3xl text-ink-900 md:text-4xl lg:text-5xl">
              Individual <span className="text-gold-600">Plots</span>
            </h2>
            <p className="mt-4 max-w-2xl text-ink-600">
              Explore available plots at {projectName}. Click on any plot to view its specific details, dimensions, and gallery.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-cream-50 px-4 py-2 text-sm text-ink-700">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Available ({availablePlots.length})
              </div>
              <div className="flex items-center gap-2 rounded-full border border-ink-200 bg-cream-50 px-4 py-2 text-sm text-ink-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Sold ({plots.length - availablePlots.length})
              </div>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {plots.map((plot) => (
              <button
                key={plot.id}
                onClick={() => setSelectedPlot(plot)}
                className="group relative flex flex-col overflow-hidden rounded-sm border border-ink-200 bg-cream-50 text-left shadow-sm transition-all hover:border-gold-400 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-100">
                  {plot.images && plot.images.length > 0 ? (
                    <img 
                      src={plot.images.find(img => img.isCover)?.url || plot.images[0].url} 
                      alt={`Plot ${plot.plotNumber}`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-300">
                      <MapPin className="h-8 w-8" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={cn(
                      'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur-md',
                      plot.status === 'Available' ? 'bg-green-500/90 text-white' : 
                      plot.status === 'Reserved' ? 'bg-orange-500/90 text-white' : 
                      'bg-red-500/90 text-white'
                    )}>
                      {plot.status}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-end justify-between border-b border-ink-100 pb-3">
                    <div>
                      <p className="text-xs font-bold tracking-widest text-gold-600 uppercase">
                        Plot {plot.plotNumber} {plot.block && `| Block ${plot.block}`}
                      </p>
                      <h3 className="mt-1 font-display text-xl text-ink-900">
                        {plot.areaSqFt.toLocaleString()} <span className="text-sm font-normal text-ink-500">sq.ft</span>
                      </h3>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm text-ink-600">
                    <div>
                      <span className="text-ink-400 block text-xs">Dimensions</span>
                      <span className="font-medium text-ink-800">{plot.width && plot.length ? `${plot.width} × ${plot.length} ft` : 'On request'}</span>
                    </div>
                    <div>
                      <span className="text-ink-400 block text-xs">Facing</span>
                      <span className="font-medium text-ink-800">{plot.facing || '—'}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm font-semibold text-gold-700">
                    <span>View Gallery & Details</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Lightbox / Details Modal */}
      {selectedPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-ink-900/80 backdrop-blur-sm"
            onClick={() => setSelectedPlot(null)}
          />
          <div className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-sm bg-cream-50 shadow-2xl animate-in fade-in zoom-in-95 md:flex-row">
            
            {/* Close btn */}
            <button
              onClick={() => setSelectedPlot(null)}
              className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink-900/50 text-white transition-colors hover:bg-ink-900"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left Image Side */}
            <div className="relative h-64 w-full bg-ink-100 md:h-auto md:w-3/5">
              {selectedPlot.images && selectedPlot.images.length > 0 ? (
                <div className="h-full w-full overflow-y-auto">
                  {selectedPlot.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={img.url} 
                      alt={`Plot ${selectedPlot.plotNumber} view ${idx + 1}`} 
                      className="w-full object-cover" 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center text-ink-300">
                  <MapPin className="h-12 w-12" />
                </div>
              )}
            </div>

            {/* Right Content Side */}
            <div className="flex max-h-full w-full flex-col overflow-y-auto p-6 md:w-2/5 md:p-8">
              <p className="text-sm font-bold tracking-widest text-gold-600 uppercase">
                {projectName}
              </p>
              <h3 className="mt-2 font-display text-3xl text-ink-900">
                Plot {selectedPlot.plotNumber}
              </h3>
              
              <div className="mt-4 inline-flex self-start">
                <span className={cn(
                  'rounded-sm px-3 py-1 text-xs font-semibold',
                  selectedPlot.status === 'Available' ? 'bg-green-100 text-green-700' : 
                  selectedPlot.status === 'Reserved' ? 'bg-orange-100 text-orange-700' : 
                  'bg-red-100 text-red-700'
                )}>
                  {selectedPlot.status}
                </span>
              </div>

              <div className="mt-8 space-y-4 rounded-sm border border-ink-100 bg-white p-5">
                <div className="flex justify-between border-b border-ink-50 pb-3 text-sm">
                  <span className="text-ink-500">Total Area</span>
                  <span className="font-semibold text-ink-900">{selectedPlot.areaSqFt.toLocaleString()} sq.ft</span>
                </div>
                {selectedPlot.width && selectedPlot.length && (
                  <div className="flex justify-between border-b border-ink-50 pb-3 text-sm">
                    <span className="text-ink-500">Dimensions</span>
                    <span className="font-semibold text-ink-900">{selectedPlot.width} × {selectedPlot.length} ft</span>
                  </div>
                )}
                {selectedPlot.block && (
                  <div className="flex justify-between border-b border-ink-50 pb-3 text-sm">
                    <span className="text-ink-500">Block</span>
                    <span className="font-semibold text-ink-900">{selectedPlot.block}</span>
                  </div>
                )}
                {selectedPlot.facing && (
                  <div className="flex justify-between pb-1 text-sm">
                    <span className="text-ink-500">Facing</span>
                    <span className="font-semibold text-ink-900">{selectedPlot.facing}</span>
                  </div>
                )}
              </div>

              {selectedPlot.description && (
                <p className="mt-6 text-sm leading-relaxed text-ink-600">
                  {selectedPlot.description}
                </p>
              )}

              <div className="mt-auto pt-8">
                {selectedPlot.status === 'Available' ? (
                  <a 
                    href="#contact" 
                    onClick={() => {
                      setSelectedPlot(null);
                      setTimeout(() => {
                        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
                      }, 100)
                    }}
                    className={cn(buttonStyles('primary', 'lg'), 'w-full justify-center')}
                  >
                    Enquire About Plot {selectedPlot.plotNumber}
                  </a>
                ) : (
                  <Button variant="secondary" size="lg" className="w-full justify-center opacity-50" disabled>
                    Not Available
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

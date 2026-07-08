import Image from 'next/image'

interface CollectionCardProps {
  image: string
  title: string
  subtitle: string
  alt: string
  featured?: boolean
  itemCount?: number
  tags?: string[]
}

export function CollectionCard({ image, title, subtitle, alt, featured = false, itemCount, tags = [] }: CollectionCardProps) {
  const baseClasses =
    'group relative overflow-hidden rounded-2xl border border-foreground/10 hover:border-foreground/50 transition-all duration-500 cursor-pointer bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm'

  const containerClasses = featured ? 'md:col-span-2 md:row-span-2' : ''
  const imageContainerClasses = featured ? 'h-full' : 'h-full'

  return (
    <div className={`${baseClasses} ${containerClasses} hover:shadow-2xl hover:shadow-foreground/10`}>
      <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors duration-500 z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500 z-10" />
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 z-20">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs font-medium px-2 py-1 rounded-full bg-background/80 text-foreground backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h3
            className={`font-semibold text-background ${featured ? 'text-3xl md:text-4xl mb-3' : 'text-xl md:text-2xl mb-2'} tracking-tight`}
          >
            {title}
          </h3>
          <p className={`${featured ? 'text-base text-background/90' : 'text-sm text-background/80'} font-normal mb-3`}>{subtitle}</p>
          {itemCount && (
            <div className="flex items-center gap-2 text-xs text-background/70">
              <span className="font-medium">{itemCount} pairs</span>
              <span className="w-1 h-1 rounded-full bg-background/50" />
              <span>Available now</span>
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center border border-foreground/30">
          <svg className="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

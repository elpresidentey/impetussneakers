import Image from 'next/image'

interface CollectionCardProps {
  image: string
  title: string
  subtitle: string
  alt: string
  featured?: boolean
}

export function CollectionCard({ image, title, subtitle, alt, featured = false }: CollectionCardProps) {
  const baseClasses =
    'group relative overflow-hidden rounded-xl border border-foreground/10 hover:border-secondary/40 transition-all duration-300 cursor-pointer'

  const containerClasses = featured ? 'md:col-span-2 md:row-span-2' : ''
  const imageContainerClasses = featured ? 'h-full' : 'h-full'

  return (
    <div className={`${baseClasses} ${containerClasses}`}>
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 z-10" />
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
        <h3
          className={`font-light text-white ${featured ? 'text-3xl md:text-4xl mb-3' : 'text-xl md:text-2xl mb-2'}`}
        >
          {title}
        </h3>
        <p className={`${featured ? 'text-base text-white/80' : 'text-sm text-white/70'}`}>{subtitle}</p>
      </div>
    </div>
  )
}

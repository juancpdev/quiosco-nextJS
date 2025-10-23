"use client"
import { Category, Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

type CategoryIconProps = {
    category: Category
}

export default function CategoryIcon({category} : CategoryIconProps) {
    const params = useParams<{category : string}>()
    
  return ( 
    <Link 
        href={`/order/${category.slug}`} 
        className={` ${params.category === category.slug ? 'bg-orange-400 hover:bg-orange-400 xl:cursor-default' : 'xl:bg-white'} flex items-center gap-4 xl:w-full xl:h-20 rounded-xl p-3 last-of-type:border-none hover:bg-orange-50 transition-all`}
    >
        <div className='w-12 h-12 relative'>
            <Image
                fill
                src={`/icon_${category.slug}.svg`} 
                alt="Imagen Category" 
            />
        </div>
        <div className='justify-center items-center hidden xl:flex'>
            <p className=' font-bold text-xl'>{category.name}</p>
        </div>
    </Link>
  )
}

'use client'

import { getImagePath } from '@/src/utils'
import { ImagePlus } from 'lucide-react'
import { CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { useState } from 'react'

export default function ImageUpload({image} : {image: string | undefined}) {
    const [imageUrl, setImageUrl] = useState('')

    return (
    <CldUploadWidget
    onSuccess={(result, { widget }) => {
        if (result.event === 'success') {
          widget.close()
      
          const info = result.info as { secure_url: string }
          setImageUrl(info.secure_url)
        }
      }}
      
        uploadPreset='ml_default'
        options={{
            maxFiles: 1
        }}
    >
        {({open}) => (
            <>
                <div className='space-y-2'>
                    <label className='text-slate-800 font-semibold'>Imagen Producto</label>
                    <div 
                        className='relative bg-slate-100 rounded-lg flex flex-col items-center justify-center py-12 cursor-pointer transition text-neutral-500 gap-2 hover:opacity-70'
                        onClick={() => open()}
                    >
                        <ImagePlus
                            size={50}
                        />
                        <p className='font-semibold'>Agregar Imagen</p>

                        {imageUrl && (
                            <div
                                className='absolute inset-0 w-full h-full '
                            >
                                <Image
                                    fill
                                    style={{objectFit: 'contain'}}
                                    src={imageUrl}
                                    alt='Imagen de Producto'
                                />
                            </div>
                        )}

                        {image && !imageUrl && (
                            <Image
                                fill
                                style={{objectFit: 'contain'}}
                                src={getImagePath(image)}
                                alt='Imagen de Producto'
                            />
                        )}
                    </div>
                </div>
                <input type="hidden" name='image' value={imageUrl ? imageUrl : image} />
            </>
        )}
    </CldUploadWidget>
  )
}

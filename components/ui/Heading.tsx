import React from 'react'

export default function Heading({children} : {children: React.ReactNode}) {
  return (
    <h1 className="font-bold text-xl text-center my-5 text-black xl:text-3xl xl:pb-2">{children}</h1>
  )
}

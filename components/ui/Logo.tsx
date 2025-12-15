import Image from "next/image";

export default function Logo() {
  return (
    
        <div className=" w-36 h-36 relative" >
        <Image 
            fill
            src="/logo.svg" 
            alt="Logotipo" 
        />
        </div>
  )
}

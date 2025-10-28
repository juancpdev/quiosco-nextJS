import CategorySlider from "./CategorySlider";

export default async function OrderSidebar() {
  
  return (
    <aside className="xl:w-72 xl:h-screen xl:bg-white p-3 xl:p-5 relative " >
        
        <nav className="flex xl:flex-col fixed top-0 left-0 h-20 bg-orange-100 py-2 w-full xl:relative xl:h-auto xl:bg-white z-10 xl:order-2">
          <CategorySlider />
        </nav>

        <div className="mt-24 flex items-center justify-center w-full  xl:absolute xl:bottom-0 xl:left-0 xl:mb-5 xl:order-1">
          <img className=" w-64 xl:w-50" src="/aria.png" alt="Logotipo" />
        </div>
        
    </aside>
  )
}

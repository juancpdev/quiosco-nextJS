import CategorySlider from "./CategorySlider";

export default async function OrderSidebar() {
  
  return (
    <aside className="xl:w-72 xl:h-screen bg-white p-3 xl:p-5" >
        
        <nav className="flex xl:flex-col fixed top-0 left-0 h-20 bg-orange-100 py-2 w-full xl:relative xl:h-auto xl:bg-white">
          <CategorySlider />
        </nav>
        
    </aside>
  )
}

import "./App.css";
import Navbar from "./component/navbar/navbar";
import ProductDetail from "./component/product-detail/product_detail";
import ProductProduction from "./component/product-production/product_production";

export default function App() {
  return (
    <div className="w-[1400px] mx-auto ">
      <Navbar />
      <h1>Dasturlashni 0 dan o’rganing va ajoyib dasturlar yarating</h1>
      <p>Taqdimot / Pedagogika </p>
      <div className="flex justify-between items-start flex-wrap ">
        <ProductProduction />
        <ProductDetail />
        <ProductProduction />
        <ProductDetail />
      </div>
    </div>
  );
}

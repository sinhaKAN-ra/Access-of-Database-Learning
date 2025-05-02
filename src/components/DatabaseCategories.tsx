
import { categories } from "@/data/categories";
import CategoryCard from "./CategoryCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DatabaseCategories = () => {
  return (
    <section>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold">Database Categories</h2>
        <Link to="/categories">
          <Button variant="outline">View All</Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.slice(0, 8).map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default DatabaseCategories;

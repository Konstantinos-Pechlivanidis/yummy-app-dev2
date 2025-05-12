import { Button } from "../ui/button";

const MenuCategoryTabs = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  if (!categories?.length) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            selectedCategory === category
              ? "bg-primary text-white shadow-md"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default MenuCategoryTabs;

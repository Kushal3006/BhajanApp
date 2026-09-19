export default function FilterChips({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "border-amber-600 bg-amber-600 text-white shadow-sm"
                : "border-stone-200 bg-white text-stone-700 hover:border-amber-200 hover:text-amber-700"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

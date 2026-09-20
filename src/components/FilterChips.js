export default function FilterChips({ categories, activeCategory, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible">
      {categories.map((category) => {
        const isActive = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onChange(category)}
            className={`min-h-12 shrink-0 rounded-full border px-5 py-2 text-sm font-black transition-colors ${
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

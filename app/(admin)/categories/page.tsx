import { getCategories } from "@/lib/content";

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-medium transition-opacity hover:opacity-90">
          + Add Category
        </button>
      </div>

      <div className="bg-card border-default rounded-xl border shadow-sm">
        {categories.length > 0 ? (
          <ul className="divide-y">
            {categories.map((cat) => (
              <li
                key={cat.slug}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-muted text-sm">/{cat.slug}</p>
                </div>
                <button className="text-primary text-sm hover:underline">
                  Edit
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted py-12 text-center text-sm">
            No categories yet. Add your first category.
          </p>
        )}
      </div>
    </div>
  );
}

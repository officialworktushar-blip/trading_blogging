import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  Gauge,
  LineChart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/animations/reveal";

export type CategoryTile = {
  label: string;
  href: string;
  description: string;
  icon?: "stock" | "forex" | "crypto" | "strategies" | "analysis" | "blog";
};

const icons: Record<NonNullable<CategoryTile["icon"]>, LucideIcon> = {
  stock: TrendingUp,
  forex: LineChart,
  crypto: Activity,
  strategies: BookOpen,
  analysis: Gauge,
  blog: BookOpen,
};

type CategorySectionProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  items: CategoryTile[];
  id?: string;
};

export function CategorySection({
  eyebrow = "Explore the markets",
  title,
  description,
  items,
  id,
}: CategorySectionProps) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
          {eyebrow}
        </p>
        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-base leading-relaxed text-ink-500">
            {description}
          </p>
        ) : null}
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = icons[item.icon ?? "blog"];
          return (
            <Reveal
              key={item.href + item.label}
              className="h-full"
              delay={Math.min(index * 0.06, 0.3)}
            >
              <Link
                href={item.href}
                className="card-lift group flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6"
              >
                <span className="tile-icon inline-flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink-900">
                  {item.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                  {item.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700">
                  Explore
                  <ArrowUpRight className="hover-arrow h-4 w-4" aria-hidden="true" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

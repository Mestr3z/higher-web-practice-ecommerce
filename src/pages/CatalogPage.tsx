import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetProductsQuery } from '../api/productsApi';
import ArrowIcon from '../assets/Arrow.svg?react';
import FilterIcon from '../assets/Filter.svg?react';
import { FilterSidebar, MobileFilters } from '../components/catalog';
import { ProductCard } from '../components/shared';
import { Pagination, Select } from '../components/ui';
import { emptyFilters, filterProducts } from '../lib/filterProducts';
import { searchProducts } from '../lib/searchProducts';
import { sortProducts } from '../lib/sortProducts';

import type { CatalogFilters } from '../lib/filterProducts';
import type { ProductSort } from '../types';

type ViewMode = 'grid' | 'list';

const PAGE_SIZE = 12;

const SORT_OPTIONS = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'price_asc', label: 'Сначала дешёвые' },
  { value: 'price_desc', label: 'Сначала дорогие' },
  { value: 'rating', label: 'По рейтингу' },
];

const VIEW_OPTIONS = [
  { value: 'grid', label: 'Сеткой' },
  { value: 'list', label: 'Списком' },
];

export function CatalogPage() {
  const { data: products, isLoading, isError } = useGetProductsQuery();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  const [filters, setFilters] = useState<CatalogFilters>(emptyFilters);
  const [sort, setSort] = useState<ProductSort>('newest');
  const [view, setView] = useState<ViewMode>('grid');
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const searched = products ? searchProducts(products, search) : [];
  const filtered = filterProducts(searched, filters);
  const sorted = sortProducts(filtered, sort);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFiltersChange = (next: CatalogFilters) => {
    setFilters(next);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    setSort(value as ProductSort);
    setPage(1);
  };

  const handleViewChange = (value: string) => {
    setView(value as ViewMode);
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0 });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-h1">{search ? `Поиск: ${search}` : 'Усы'}</h1>

        {products && (
          <>
            <div className="hidden flex-wrap gap-3 lg:flex">
              <Select
                aria-label="Сортировка"
                options={SORT_OPTIONS}
                value={sort}
                onValueChange={handleSortChange}
              />
              <Select
                aria-label="Отображение"
                options={VIEW_OPTIONS}
                value={view}
                onValueChange={handleViewChange}
              />
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(true)}
              aria-label="Фильтры"
              className="border-border bg-surface text-text grid h-10 w-10 shrink-0 place-items-center rounded-md border lg:hidden"
            >
              <FilterIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {isLoading && <p className="text-text-secondary mt-6">Загрузка…</p>}
      {isError && <p className="text-danger mt-6">Не удалось загрузить товары.</p>}

      {products && (
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="hidden lg:block lg:w-56 lg:shrink-0">
            <FilterSidebar
              products={searched}
              filters={filters}
              onChange={handleFiltersChange}
            />
          </div>

          <div className="min-w-0 flex-1">
            {sorted.length === 0 ? (
              <div className="bg-surface text-text-secondary rounded-xl p-6">
                {search
                  ? `По запросу «${search}» ничего не найдено.`
                  : 'По выбранным фильтрам ничего не найдено.'}
              </div>
            ) : (
              <>
                <div className="bg-surface rounded-xl p-6">
                  {view === 'grid' ? (
                    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
                      {pageItems.map((product) => (
                        <li key={product.id}>
                          <ProductCard product={product} />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="divide-border flex flex-col divide-y">
                      {pageItems.map((product) => (
                        <li key={product.id} className="py-4 first:pt-0 last:pb-0">
                          <ProductCard product={product} variant="list" />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="mt-6">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {products && filtersOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="bg-bg absolute inset-0 flex flex-col">
            <div className="border-border bg-surface flex items-center gap-3 border-b px-5 py-4">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                aria-label="Назад"
              >
                <ArrowIcon className="text-text h-6 w-6" />
              </button>
              <h2 className="text-h3">Фильтры</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <MobileFilters
                products={searched}
                filters={filters}
                onChange={handleFiltersChange}
                onApply={() => setFiltersOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

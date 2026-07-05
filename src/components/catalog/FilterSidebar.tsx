import type { CatalogFilters } from '../../lib/filterProducts';
import { emptyFilters, getFacetValues } from '../../lib/filterProducts';
import type { Product } from '../../types';
import { Button, Checkbox, Input, RadioGroup, Switch } from '../ui';

type FilterSidebarProps = {
  products: Product[];
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
};

export function FilterSidebar({ products, filters, onChange }: FilterSidebarProps) {
  const categories = getFacetValues(products, 'категория');
  const styles = getFacetValues(products, 'стиль');
  const densities = getFacetValues(products, 'густота');

  const toggleCategory = (value: string) =>
    onChange({
      ...filters,
      category: filters.category === value ? null : value,
    });

  const toggleStyle = (value: string, checked: boolean) =>
    onChange({
      ...filters,
      styles: checked
        ? [...filters.styles, value]
        : filters.styles.filter((style) => style !== value),
    });

  const setDensity = (value: string) => onChange({ ...filters, density: value });

  const setPrice = (key: 'priceMin' | 'priceMax', raw: string) =>
    onChange({ ...filters, [key]: raw === '' ? null : Number(raw) });

  const reset = () => onChange(emptyFilters);

  return (
    <aside className="flex flex-col gap-6">
      <div>
        <h2 className="text-text mb-3 text-sm font-semibold">Категория</h2>
        <ul className="flex flex-col gap-2">
          {categories.map((category) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => toggleCategory(category)}
                className={
                  filters.category === category
                    ? 'text-accent text-sm font-semibold'
                    : 'text-text-secondary hover:text-accent text-sm'
                }
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-text mb-3 text-sm font-semibold">Стиль</h2>
        <div className="flex flex-col gap-2">
          {styles.map((style) => (
            <Checkbox
              key={style}
              id={`style-${style}`}
              checked={filters.styles.includes(style)}
              onCheckedChange={(checked) => toggleStyle(style, checked)}
            >
              {style}
            </Checkbox>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-text mb-3 text-sm font-semibold">Густота</h2>
        <RadioGroup
          value={filters.density ?? ''}
          onValueChange={setDensity}
          options={densities.map((density) => ({
            value: density,
            label: density,
          }))}
        />
      </div>

      <div>
        <h2 className="text-text mb-3 text-sm font-semibold">Фильтр</h2>
        <div className="flex flex-col gap-3">
          <Switch
            id="filter-wax"
            checked={filters.needsWax}
            onCheckedChange={(checked) => onChange({ ...filters, needsWax: checked })}
          >
            требует укладки воском
          </Switch>
          <Switch
            id="filter-charisma"
            checked={filters.boostsCharisma}
            onCheckedChange={(checked) =>
              onChange({ ...filters, boostsCharisma: checked })
            }
          >
            повышает харизму
          </Switch>
        </div>
      </div>

      <div>
        <h2 className="text-text mb-3 text-sm font-semibold">Цена</h2>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            aria-label="Цена от"
            placeholder="590"
            value={filters.priceMin ?? ''}
            onChange={(e) => setPrice('priceMin', e.target.value)}
          />
          <Input
            type="number"
            aria-label="Цена до"
            placeholder="5590"
            value={filters.priceMax ?? ''}
            onChange={(e) => setPrice('priceMax', e.target.value)}
          />
        </div>
      </div>

      <Button variant="outline" onClick={reset}>
        Очистить фильтры
      </Button>
    </aside>
  );
}

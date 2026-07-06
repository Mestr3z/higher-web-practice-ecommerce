import type { CatalogFilters } from '../../lib/filterProducts';
import { emptyFilters, getFacetValues } from '../../lib/filterProducts';
import type { Product } from '../../types';
import { Button, Input, RadioGroup, Switch } from '../ui';

type MobileFiltersProps = {
  products: Product[];
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
  onApply: () => void;
};

export function MobileFilters({
  products,
  filters,
  onChange,
  onApply,
}: MobileFiltersProps) {
  const styles = getFacetValues(products, 'стиль');
  const densities = getFacetValues(products, 'густота');
  const curls = getFacetValues(products, 'закрученность');

  const toggleStyle = (value: string) =>
    onChange({
      ...filters,
      styles: filters.styles.includes(value)
        ? filters.styles.filter((style) => style !== value)
        : [...filters.styles, value],
    });

  const setPrice = (key: 'priceMin' | 'priceMax', raw: string) =>
    onChange({ ...filters, [key]: raw === '' ? null : Number(raw) });

  return (
    <div className="flex flex-col gap-4">
      <section className="bg-surface rounded-xl p-4">
        <h3 className="text-text mb-3 text-sm font-semibold">Цена</h3>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            aria-label="Цена от"
            placeholder="От"
            value={filters.priceMin ?? ''}
            onChange={(e) => setPrice('priceMin', e.target.value)}
          />
          <Input
            type="number"
            aria-label="Цена до"
            placeholder="до"
            value={filters.priceMax ?? ''}
            onChange={(e) => setPrice('priceMax', e.target.value)}
          />
        </div>
      </section>

      <section className="bg-surface rounded-xl p-4">
        <h3 className="text-text mb-3 text-sm font-semibold">Стиль</h3>
        <div className="flex flex-wrap gap-2">
          {styles.map((style) => {
            const active = filters.styles.includes(style);
            return (
              <button
                key={style}
                type="button"
                onClick={() => toggleStyle(style)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? 'border-accent bg-accent/5 text-accent font-medium'
                    : 'bg-bg text-text border-transparent'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-surface rounded-xl p-4">
        <h3 className="text-text mb-3 text-sm font-semibold">Густота</h3>
        <RadioGroup
          value={filters.density ?? ''}
          onValueChange={(value) => onChange({ ...filters, density: value })}
          options={densities.map((density) => ({ value: density, label: density }))}
        />
      </section>

      <section className="bg-surface rounded-xl p-4">
        <h3 className="text-text mb-3 text-sm font-semibold">Закрученность</h3>
        <RadioGroup
          value={filters.curl ?? ''}
          onValueChange={(value) => onChange({ ...filters, curl: value })}
          options={curls.map((curl) => ({ value: curl, label: curl }))}
        />
      </section>

      <section className="bg-surface rounded-xl p-4">
        <div className="flex flex-col gap-3">
          <Switch
            id="m-wax"
            checked={filters.needsWax}
            onCheckedChange={(checked) => onChange({ ...filters, needsWax: checked })}
          >
            требует укладки воском
          </Switch>
          <Switch
            id="m-charisma"
            checked={filters.boostsCharisma}
            onCheckedChange={(checked) =>
              onChange({ ...filters, boostsCharisma: checked })
            }
          >
            повышает харизму
          </Switch>
        </div>
      </section>

      <div className="flex flex-col gap-3">
        <Button fullWidth onClick={onApply}>
          Применить фильтры
        </Button>
        <button
          type="button"
          onClick={() => onChange(emptyFilters)}
          className="text-text-secondary hover:text-accent text-sm font-semibold"
        >
          Очистить фильтры
        </button>
      </div>
    </div>
  );
}

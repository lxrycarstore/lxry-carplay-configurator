import { useEffect, useMemo, useState } from 'react';
import { fetchConfiguratorData, fetchQuote } from './lib/api';
import { groupByCategory } from './lib/configurator';
import type { ConfiguratorData, ConfiguratorOption, ConfiguratorQuote } from './lib/types';
import { OptionCard } from './components/OptionCard';
import { Summary } from './components/Summary';
import './styles/main.css';

const defaultModels = ['Audi A6', 'BMW X5', 'Mercedes GLE', 'Porsche Cayenne'];

export const App = () => {
  const [data, setData] = useState<ConfiguratorData | null>(null);
  const [model, setModel] = useState(defaultModels[0]);
  const [selection, setSelection] = useState<string[]>([]);
  const [quote, setQuote] = useState<ConfiguratorQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchConfiguratorData()
      .then((payload) => {
        if (!mounted) return;
        setData(payload);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Onbekende fout');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    fetchQuote({ model, selections: selection })
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [data, model, selection]);

  const grouped = useMemo(() => groupByCategory(data?.options ?? []), [data]);

  const toggleSelection = (id: string) => {
    setSelection((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  if (loading) {
    return <div className="state">Configurator laden...</div>;
  }

  if (error || !data) {
    return <div className="state state--error">{error ?? 'Geen data gevonden'}</div>;
  }

  const categories = Object.entries(grouped) as Array<[ConfiguratorOption['category'], ConfiguratorOption[]]>;

  return (
    <div className="app">
      <header className="hero">
        <div>
          <span className="eyebrow">LXRY CarPlay</span>
          <h1>Professionele CarPlay configurator</h1>
          <p>
            Configureer premium Apple CarPlay upgrades met realtime prijzen, afgestemd op jouw voertuig en
            lifestyle.
          </p>
        </div>
        <div className="hero__card">
          <label htmlFor="model">Voertuigmodel</label>
          <select id="model" value={model} onChange={(event) => setModel(event.target.value)}>
            {defaultModels.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <p className="hint">Meer modellen zijn beschikbaar via Airtable.</p>
        </div>
      </header>

      <main className="grid">
        <section className="options">
          {categories.map(([category, options]) => (
            <div key={category} className="options__group">
              <div className="options__header">
                <h2>{category}</h2>
                <span>{options.length} opties</span>
              </div>
              <div className="options__list">
                {options.map((option) => (
                  <OptionCard
                    key={option.id}
                    option={option}
                    selected={selection.includes(option.id)}
                    onToggle={toggleSelection}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
        <aside>
          <Summary quote={quote} />
          <div className="cta">
            <h4>Embeddable in Phoenix</h4>
            <p>
              Gebruik <code>window.LxryConfigurator.mount()</code> om de widget te laden binnen je Phoenix
              template.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { fetchConfiguratorData, fetchModels, fetchDashboards, fetchSolutions } from './lib/api';
import type { ConfiguratorData } from './lib/types';
import './styles/main.css';

type CarModel = {
  id: string;
  merk: string;
  model: string;
  generatie?: string | null;
  jaarVan: number | null;
  jaarTot: number | null;
};

type Dashboard = {
  id: string;
  name: string;
  imageUrl: string;
};

type Solution = {
  id: string;
  naam: string;
  prijs: number;
  beschrijving?: string;
  imageUrl?: string;
};

export default function App() {
  const [data, setData] = useState<ConfiguratorData | null>(null);
  const [models, setModels] = useState<CarModel[]>([]);

  const [brand, setBrand] = useState('');
  const [modelName, setModelName] = useState('');
  const [year, setYear] = useState<number | null>(null);

  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [selectedDashboard, setSelectedDashboard] = useState<Dashboard | null>(null);

  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const [configData, modelData] = await Promise.all([
          fetchConfiguratorData(),
          fetchModels()
        ]);

        if (!alive) return;

        setData(configData);
        setModels(modelData.models);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : 'Onbekende fout');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const brands = useMemo(() => [...new Set(models.map(m => m.merk))].sort(), [models]);

  const modelsForBrand = useMemo(() => {
    if (!brand) return [];
    const unique: Record<string, CarModel> = {};
    models.filter(m => m.merk === brand).forEach(m => {
      if (!unique[m.model]) unique[m.model] = m;
    });
    return Object.values(unique).sort((a, b) => a.model.localeCompare(b.model));
  }, [models, brand]);

  const variantsForModel = useMemo(
    () => models.filter(m => m.merk === brand && m.model === modelName),
    [models, brand, modelName]
  );

  const availableYears = useMemo(() => {
    if (!variantsForModel.length) return [];
    const start = Math.min(...variantsForModel.map(v => v.jaarVan ?? 1900));
    const end = Math.max(...variantsForModel.map(v => v.jaarTot ?? new Date().getFullYear()));
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [variantsForModel]);

  const selectedVariant = useMemo(() => {
    if (year === null) return null;
    return variantsForModel.find(v => {
      const from = v.jaarVan ?? 1900;
      const to = v.jaarTot ?? new Date().getFullYear();
      return year >= from && year <= to;
    }) ?? null;
  }, [variantsForModel, year]);

  const carDisplayName = useMemo(() => {
    if (!selectedVariant) return '';
    const gen = selectedVariant.generatie ? ` ${selectedVariant.generatie}` : '';
    const years = `(${selectedVariant.jaarVan ?? '?'}-${selectedVariant.jaarTot ?? 'heden'})`;
    return `${selectedVariant.merk} ${selectedVariant.model}${gen} ${years}`;
  }, [selectedVariant]);

  useEffect(() => {
    setModelName('');
    setYear(null);
    setDashboards([]);
    setSelectedDashboard(null);
    setSolutions([]);
    setSelectedSolution(null);
  }, [brand]);

  useEffect(() => {
    setYear(null);
    setDashboards([]);
    setSelectedDashboard(null);
    setSolutions([]);
    setSelectedSolution(null);
  }, [modelName]);

  useEffect(() => {
    if (!selectedVariant) {
      setDashboards([]);
      setSelectedDashboard(null);
      setSolutions([]);
      setSelectedSolution(null);
      return;
    }

    let alive = true;
    setDashboards([]);
    setSelectedDashboard(null);
    setSolutions([]);
    setSelectedSolution(null);

    fetchDashboards(selectedVariant.id)
      .then(res => {
        if (!alive) return;
        setDashboards(res.dashboards ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setDashboards([]);
      });

    return () => { alive = false; };
  }, [selectedVariant?.id]);

  useEffect(() => {
    if (!selectedVariant || !selectedDashboard) {
      setSolutions([]);
      setSelectedSolution(null);
      return;
    }

    let alive = true;
    setSolutions([]);
    setSelectedSolution(null);

    fetchSolutions(selectedVariant.id, selectedDashboard.id)
      .then(res => {
        if (!alive) return;
        setSolutions(res.solutions ?? []);
      })
      .catch(() => {
        if (!alive) return;
        setSolutions([]);
      });

    return () => { alive = false; };
  }, [selectedVariant?.id, selectedDashboard?.id]);

  const totalPrice = selectedSolution?.prijs ?? 0;

  const step1Complete = !!selectedVariant;
  const step2Complete = !!selectedDashboard;
  const step3Complete = !!selectedSolution;

  if (loading) return <div className="state">Configurator laden…</div>;
  if (error || !data) return <div className="state state--error">{error ?? 'Geen data gevonden'}</div>;

  return (
    <div className="app">
      <div className="app__main">
        {/* Header */}
        <header className="header">
          <div className="header__logo">
            <span className="header__icon">🚗</span>
            <span className="header__title">LXRY Auto Configurator</span>
          </div>
        </header>

        {/* Stap 1: Auto selectie */}
        <section className="step-section">
          <div className={`step-header ${step1Complete ? 'completed' : ''}`}>
            <span className="step-check">{step1Complete ? '✓' : '1'}</span>
            <span className="step-label">Auto: Selecteer jouw auto</span>
          </div>
          
          {!step1Complete ? (
            <div className="selectors">
              <select value={brand} onChange={e => setBrand(e.target.value)}>
                <option value="">Kies merk</option>
                {brands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select value={modelName} onChange={e => setModelName(e.target.value)} disabled={!brand}>
                <option value="">Kies model</option>
                {modelsForBrand.map(m => (
                  <option key={m.model} value={m.model}>{m.model}</option>
                ))}
              </select>

              <select
                value={year ?? ''}
                onChange={e => setYear(e.target.value === '' ? null : Number(e.target.value))}
                disabled={!modelName}
              >
                <option value="">Kies bouwjaar</option>
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="step-result" onClick={() => setYear(null)}>
              <span>{carDisplayName}</span>
              <button className="step-edit">Wijzig</button>
            </div>
          )}
        </section>

        {/* Stap 2: Dashboard selectie */}
        {step1Complete && dashboards.length > 0 && (
          <section className="step-section">
            <div className={`step-header ${step2Complete ? 'completed' : ''}`}>
              <span className="step-check">{step2Complete ? '✓' : '2'}</span>
              <span className="step-label">Stap 2: Selecteer DashboardType</span>
            </div>

            <div className="dashboard-grid">
              {dashboards.map(d => (
                <div
                  key={d.id}
                  className={`dashboard-card ${selectedDashboard?.id === d.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDashboard(d)}
                >
                  {selectedDashboard?.id === d.id && <span className="card-tag">✓</span>}
                  <img src={d.imageUrl} alt={d.name} />
                  <h3>{d.name}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Stap 3: Oplossingen */}
        {step2Complete && solutions.length > 0 && (
          <section className="step-section">
            <div className={`step-header ${step3Complete ? 'completed' : ''}`}>
              <span className="step-check">{step3Complete ? '✓' : '3'}</span>
              <span className="step-label">Stap 3: Kies jouw oplossing</span>
            </div>

            <div className="solutions-grid">
              {solutions.map(s => (
                <div
                  key={s.id}
                  className={`solution-card ${selectedSolution?.id === s.id ? 'selected' : ''}`}
                >
                  {selectedSolution?.id === s.id && <span className="card-tag gekozen">Gekozen</span>}
                  {s.imageUrl && <img src={s.imageUrl} alt={s.naam} />}
                  <div className="solution-card__content">
                    <h3>{s.naam}</h3>
                    {s.beschrijving && <p className="description">{s.beschrijving}</p>}
                    <div className="solution-card__footer">
                      <span className="price">€ {s.prijs?.toFixed(2) ?? '—'}</span>
                      {selectedSolution?.id === s.id ? (
                        <span className="selected-label">Geselecteerd</span>
                      ) : (
                        <button className="btn-select" onClick={() => setSelectedSolution(s)}>
                          Selecteer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sidebar: Uw Configuratie */}
      <aside className="sidebar">
        <div className="sidebar__card">
          <h2 className="sidebar__title">Uw Configuratie</h2>

          {!step1Complete && !step2Complete && !step3Complete ? (
            <p className="sidebar__empty">Selecteer een auto om te beginnen</p>
          ) : (
            <div className="sidebar__items">
              {step1Complete && (
                <div className="sidebar__item">
                  <span className="sidebar__check">✓</span>
                  <div className="sidebar__item-content">
                    <span className="sidebar__item-label">{carDisplayName}</span>
                  </div>
                </div>
              )}

              {step2Complete && selectedDashboard && (
                <div className="sidebar__item">
                  <span className="sidebar__check">✓</span>
                  <div className="sidebar__item-content">
                    <span className="sidebar__item-sublabel">Dashboardtype</span>
                    <span className="sidebar__item-value">{selectedDashboard.name}</span>
                  </div>
                </div>
              )}

              {step3Complete && selectedSolution && (
                <div className="sidebar__item">
                  <span className="sidebar__check">✓</span>
                  <div className="sidebar__item-content">
                    <span className="sidebar__item-sublabel">Oplossing</span>
                    <div className="sidebar__item-row">
                      <span className="sidebar__item-value">{selectedSolution.naam}</span>
                      <span className="sidebar__item-price">€ {selectedSolution.prijs?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {step3Complete && (
                <>
                  <div className="sidebar__total">
                    <span>Totaalprijs</span>
                    <span className="sidebar__total-price">€ {totalPrice.toFixed(2)}</span>
                  </div>
                  <button className="btn-primary btn-full">Vraag offerte aan</button>
                </>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Bottom bar */}
      {step1Complete && (
        <div className="bottom-bar">
          <div className="bottom-bar__info">
            <span className="bottom-bar__car">{carDisplayName}</span>
            {selectedDashboard && (
              <span className="bottom-bar__path">
                — {selectedDashboard.name}
                {selectedSolution && ` → ${selectedSolution.naam}`}
              </span>
            )}
          </div>
          <div className="bottom-bar__actions">
            <span className="bottom-bar__price">€ {totalPrice.toFixed(2)}</span>
            <button className="btn-primary" disabled={!step3Complete}>
              Vraag offerte aan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
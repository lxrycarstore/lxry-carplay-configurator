import type { ConfiguratorQuote } from '../lib/types';
import { formatCurrency } from '../lib/configurator';

type SummaryProps = {
  quote: ConfiguratorQuote | null;
};

export const Summary = ({ quote }: SummaryProps) => (
  <div className="summary">
    <h3>Offerte overzicht</h3>
    {quote ? (
      <>
        <ul>
          {quote.items.map((item) => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span>{formatCurrency(item.price)}</span>
            </li>
          ))}
        </ul>
        <div className="summary__total">
          <span>Totaal</span>
          <strong>{formatCurrency(quote.total)}</strong>
        </div>
        <button className="primary" type="button">
          Offerte aanvragen
        </button>
      </>
    ) : (
      <p>Selecteer opties om je pakket samen te stellen.</p>
    )}
  </div>
);

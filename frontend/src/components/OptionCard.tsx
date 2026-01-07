import clsx from 'clsx';
import type { ConfiguratorOption } from '../lib/types';
import { formatCurrency } from '../lib/configurator';

type OptionCardProps = {
  option: ConfiguratorOption;
  selected: boolean;
  onToggle: (id: string) => void;
};

export const OptionCard = ({ option, selected, onToggle }: OptionCardProps) => (
  <button
    className={clsx('option-card', selected && 'option-card--active')}
    onClick={() => onToggle(option.id)}
    type="button"
  >
    {option.imageUrl ? (
      <img src={option.imageUrl} alt={option.name} className="option-card__image" />
    ) : (
      <div className="option-card__image option-card__image--placeholder">LXRY</div>
    )}
    <div className="option-card__content">
      <div>
        <h4>{option.name}</h4>
        <p>{option.description}</p>
      </div>
      <span className="option-card__price">{formatCurrency(option.price)}</span>
    </div>
  </button>
);

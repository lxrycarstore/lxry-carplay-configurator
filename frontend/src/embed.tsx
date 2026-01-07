import { createRoot } from 'react-dom/client';
import { App } from './App';

const mount = (selector = '#lxry-carplay-configurator') => {
  const element = document.querySelector(selector);
  if (!element) {
    throw new Error(`Mount element not found for selector: ${selector}`);
  }

  createRoot(element).render(<App />);
};

declare global {
  interface Window {
    LxryConfigurator?: {
      mount: (selector?: string) => void;
    };
  }
}

window.LxryConfigurator = { mount };

export { mount };

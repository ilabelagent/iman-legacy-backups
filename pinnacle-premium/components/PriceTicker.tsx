import React, { useEffect, useRef } from 'react';

const PriceTicker: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptAppended = useRef(false);

  useEffect(() => {
    if (containerRef.current && !scriptAppended.current) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        "symbols": [
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
          { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
          { "proName": "BITSTAMP:ETHUSD", "title": "Ethereum" },
          { "description": "NVIDIA", "proName": "NASDAQ:NVDA" },
          { "description": "Gold", "proName": "OANDA:XAUUSD" },
          { "description": "Tesla", "proName": "NASDAQ:TSLA" },
          { "description": "Realty Income", "proName": "NYSE:O" }
        ],
        "showSymbolLogo": true,
        "colorTheme": "light",
        "isTransparent": true,
        "displayMode": "adaptive",
        "locale": "en"
      });

      containerRef.current.appendChild(script);
      scriptAppended.current = true;
    }
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl mb-6 overflow-hidden shadow-lg shadow-black/5 h-[72px] relative">
      <div className="tradingview-widget-container" ref={containerRef}>
        <div className="tradingview-widget-container__widget"></div>
      </div>
      {/* This overlay prevents clicks on the widget */}
      <div className="absolute inset-0 z-10 cursor-default"></div>
    </div>
  );
};

export default PriceTicker;
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import './App.css'

function App() {
  const socials = [
    { name: 'Telegram', icon: '📱', link: 'https://t.me/BDEtoken' },
    { name: 'Twitter', icon: '🐦', link: 'https://x.com/BDEtokenbase' },
    { name: 'Warpcast', icon: '💬', link: 'https://warpcast.com/bdetoken' },
  ]

  const UNISWAP_BASE_URL = "https://app.uniswap.org/swap";
  const TOKEN_ADDRESS = "0x2377667ba651f927BcA8977FEEC76801dcF6DEbC";
  
  const tradeLinks = [
    { 
      name: 'Buy BDE', 
      link: `${UNISWAP_BASE_URL}?outputCurrency=${TOKEN_ADDRESS}&chain=base`, 
      primary: true 
    },
    { 
      name: 'Sell BDE', 
      link: `${UNISWAP_BASE_URL}?inputCurrency=${TOKEN_ADDRESS}&chain=base`, 
      primary: false 
    }
  ]

  const [tokenData, setTokenData] = useState({
    marketCap: '0',
    liquidity: '0',
    circulatingSupply: '0',
    price: '0',
    volume24h: '0'
  });

  const [tokenDetails, setTokenDetails] = useState({
    name: 'BDE Token',
    symbol: 'BDE',
    network: 'Base',
    totalSupply: '900,000,000',
    decimals: '18',
    pairCreated: '-',
    txCount: '0'
  });

  const formatNumber = (num) => {
    if (!num) return '0';
    const value = parseFloat(num);
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    }
    return value.toFixed(2);
  };

  const fetchTokenData = async () => {
    try {
      // Fetch price and other data from DexScreener
      const dexScreenerResponse = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`
      );

      const pairData = dexScreenerResponse.data.pairs?.[0];
      
      if (pairData) {
        // Calculate circulating supply (total supply - burned tokens)
        const totalSupply = 900000000; // Your token's total supply
        const circulatingSupply = totalSupply; // Adjust if you have burned tokens

        setTokenData({
          marketCap: formatNumber(pairData.fdv),
          liquidity: formatNumber(pairData.liquidity?.usd),
          circulatingSupply: formatNumber(circulatingSupply),
          price: `$${parseFloat(pairData.priceUsd).toFixed(8)}`,
          volume24h: formatNumber(pairData.volume?.h24)
        });
      }
    } catch (error) {
      console.error('Error fetching token data:', error);
    }
  };

  const fetchTokenDetails = async () => {
    try {
      // Fetch token details from DexScreener
      const dexScreenerResponse = await axios.get(
        `https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`
      );

      const pairData = dexScreenerResponse.data.pairs?.[0];
      
      if (pairData) {
        setTokenDetails({
          name: pairData.baseToken.name,
          symbol: pairData.baseToken.symbol,
          network: 'Base',
          totalSupply: '900,000,000',
          decimals: pairData.baseToken.decimals,
          pairCreated: new Date(pairData.pairCreatedAt).toLocaleDateString(),
          txCount: pairData.txns.h24.toString()
        });
      }
    } catch (error) {
      console.error('Error fetching token details:', error);
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      Swal.fire({
        title: 'Copied!',
        text: 'Contract address copied to clipboard',
        icon: 'success',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#8B5CF6',
        timer: 2000,
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false
      });
    } catch (err) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to copy address',
        icon: 'error',
        background: '#1a1a1a',
        color: '#fff',
        confirmButtonColor: '#8B5CF6'
      });
    }
  };

  useEffect(() => {
    fetchTokenData();
    fetchTokenDetails();
    // Update data every 30 seconds
    const interval = setInterval(() => {
      fetchTokenData();
      fetchTokenDetails();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Create and load the TradingView widget
    const script = document.createElement('script');
    script.innerHTML = `
      new TradingView.widget({
        "width": "100%",
        "height": "600",
        "symbol": "UNISWAP3BASE:BDEWETH_C78188",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "toolbar_bg": "#f1f3f6",
        "enable_publishing": false,
        "hide_side_toolbar": false,
        "allow_symbol_change": true,
        "container_id": "tradingview_widget",
        "studies": [
          "Volume@tv-basicstudies",
          "RSI@tv-basicstudies"
        ],
        "show_popup_button": true,
        "popup_width": "1000",
        "popup_height": "650"
      });
    `;
    document.getElementById('tradingview_widget').appendChild(script);

    return () => {
      const widget = document.getElementById('tradingview_widget');
      if (widget) {
        widget.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="container">
      <header className="hero" style={{ 
        backgroundImage: `linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(15, 15, 26, 0.98) 100%), url(/cover.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}>
        <div className="hero-overlay"></div>
        
        <div className="hero-content">
          <div className="logo-container">
            <img src="/pfp.jpg" alt="BDE Token Logo" className="logo-image" />
          </div>
          <h1>$BDE Token</h1>
          <p className="subtitle">$BDE: Bold moves, big rewards!</p>
          
          <div className="price-display">
            <div className="price-card">
              <h3>Current Price</h3>
              <p className="price-value">{tokenData.price}</p>
            </div>
          </div>
          
          <div className="social-buttons">
            {socials.map((social, index) => (
              <a 
                key={index} 
                href={social.link} 
                className="social-button" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="icon">{social.icon}</span>
                {social.name}
              </a>
            ))}
          </div>

          <div className="trade-buttons">
            {tradeLinks.map((trade, index) => (
              <a 
                key={index} 
                href={trade.link} 
                className={`trade-button ${trade.primary ? 'primary' : 'secondary'}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                {trade.name}
              </a>
            ))}
          </div>

          <div className="hero-contract-address">
            <p className="address-label">Contract Address:</p>
            <div className="address-container hero-address">
              <code>{TOKEN_ADDRESS}</code>
              <button 
                className="copy-button"
                onClick={() => handleCopy(TOKEN_ADDRESS)}
              >
                <ClipboardDocumentIcon className="copy-icon" />
                Copy
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="chart-section">
        <h2>Live Chart</h2>
        <div className="tradingview-chart">
          <div className="tradingview-widget-container">
            <div id="tradingview_widget"></div>
          </div>
        </div>
      </section>

      <section className="tokenomics">
        <h2>Tokenomics</h2>
        <div className="tokenomics-container">
          <div className="token-info">
            <div className="token-card main-card">
              <h3>Token Details</h3>
              <div className="token-details">
                <div className="detail-item">
                  <span className="label">Name:</span>
                  <span className="value">{tokenDetails.name}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Symbol:</span>
                  <span className="value">{tokenDetails.symbol}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Network:</span>
                  <span className="value">{tokenDetails.network}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Total Supply:</span>
                  <span className="value">{tokenDetails.totalSupply} BDE</span>
                </div>
                <div className="detail-item">
                  <span className="label">Pair Created:</span>
                  <span className="value">{tokenDetails.pairCreated}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="distribution-grid">
            <div className="token-card">
              <div className="card-icon">💰</div>
              <h4>Market Cap</h4>
              <p className="stat">{tokenData.marketCap}</p>
              <p className="description">Live market capitalization</p>
            </div>

            <div className="token-card">
              <div className="card-icon">🔒</div>
              <h4>Liquidity</h4>
              <p className="stat">{tokenData.liquidity}</p>
              <p className="description">Total Liquidity Locked</p>
            </div>

            <div className="token-card">
              <div className="card-icon">👥</div>
              <h4>Circulating Supply</h4>
              <p className="stat">{tokenData.circulatingSupply}</p>
              <p className="description">Total tokens in circulation</p>
            </div>

            <div className="token-card">
              <div className="card-icon">📊</div>
              <h4>Volume 24h</h4>
              <p className="stat">{tokenData.volume24h}</p>
              <p className="description">24h Trading Volume</p>
            </div>
          </div>
        </div>
      </section>

      {/* Add Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a 
              href="https://basescan.org/token/0x2377667ba651f927BcA8977FEEC76801dcF6DEbC" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              BaseScan
            </a>
            <span className="footer-divider">•</span>
            <a 
              href="https://www.dextools.io/app/en/base/pair-explorer/0x2377667ba651f927bca8977feec76801dcf6debc" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link"
            >
              DexTools
            </a>
          </div>
          <p className="developer">
            Developer: <a 
              href="https://warpcast.com/senpaiii-kun.base.eth" 
              target="_blank" 
              rel="noopener noreferrer"
              className="developer-link"
            >
              senpaiii-kun.base.ethⓂ️
            </a>
          </p>
          <p className="copyright">
            © {new Date().getFullYear()} BDE Token. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

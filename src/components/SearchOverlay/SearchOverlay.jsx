import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlass, X, ArrowRight } from 'phosphor-react';
import { products } from '../../data/products';
import './SearchOverlay.css';

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.trim().length > 1) {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.category.toLowerCase().includes(lowerQuery)
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="search-overlay">
      <div className="search-header">
        <div className="container search-header-inner">
          <div className="search-input-wrap">
            <MagnifyingGlass size={24} className="search-icon" />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search for products, categories..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="clear-search" onClick={() => setQuery('')}>
                <X size={20} />
              </button>
            )}
          </div>
          <button className="close-overlay" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      <div className="search-results-area">
        <div className="container">
          {query.trim().length > 1 ? (
            results.length > 0 ? (
              <div className="search-results">
                <h3>Products ({results.length})</h3>
                <div className="results-grid">
                  {results.map(product => (
                    <Link to={`/product/${product.slug}`} key={product.id} className="result-item" onClick={onClose}>
                      <img src={product.images[0]} alt={product.name} 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80/EDF1EE/1A3E2F?text=Img"; }}
                      />
                      <div className="result-info">
                        <h4>{product.name}</h4>
                        <span className="result-price">₹{product.price}</span>
                      </div>
                      <ArrowRight size={16} className="result-arrow" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-search-results">
                <p>No results found for "{query}".</p>
                <span>Try checking your spelling or using different keywords.</span>
              </div>
            )
          ) : (
            <div className="search-suggestions">
              <h3>Popular Searches</h3>
              <div className="suggestion-tags">
                <button onClick={() => setQuery('mosquito')}>Mosquito Repellent</button>
                <button onClick={() => setQuery('cleaner')}>Floor Cleaner</button>
                <button onClick={() => setQuery('powder')}>Turmeric Powder</button>
                <button onClick={() => setQuery('hand')}>Hand Wash</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;

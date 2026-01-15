import React, { useState, useEffect, useMemo } from 'react';
import TemplateCard from './TemplateCard';
import {
  CIRCUIT_TEMPLATES,
  TEMPLATE_CATEGORIES,
  getTemplatesByCategory,
  searchTemplates as searchBuiltInTemplates,
  getAllTags,
} from '../../utils/circuitTemplates';
import {
  loadLibrary,
  saveCircuitToLibrary,
  deleteCircuitFromLibrary,
  toggleFavorite,
  isFavorite as checkIsFavorite,
  getFavorites,
  getRecent,
  searchLibrary,
  filterLibrary,
  sortLibrary,
  exportLibrary,
  importLibrary,
  exportCircuit,
  importCircuit,
  getLibraryStatistics,
} from '../../utils/libraryManager';
import './CircuitLibrary.css';

const CircuitLibrary = ({ onLoadCircuit, currentCircuit, onClose }) => {
  const [activeTab, setActiveTab] = useState('templates');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [customCircuits, setCustomCircuits] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterComplexity, setFilterComplexity] = useState('all');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [circuitName, setCircuitName] = useState('');
  const [circuitDescription, setCircuitDescription] = useState('');
  const [circuitTags, setCircuitTags] = useState('');

  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCustomCircuits(loadLibrary());
    setFavorites(getFavorites());
    setRecent(getRecent());
  };

  const handleFavorite = (id) => {
    toggleFavorite(id);
    refreshData();
  };

  const handleLoadTemplate = (template) => {
    onLoadCircuit(template);
    onClose();
  };

  const handleDeleteCircuit = (id) => {
    if (window.confirm('Are you sure you want to delete this circuit?')) {
      deleteCircuitFromLibrary(id);
      refreshData();
    }
  };

  const handleSaveCurrentCircuit = () => {
    if (!currentCircuit || !currentCircuit.gates || currentCircuit.gates.length === 0) {
      alert('No circuit to save. Please build a circuit first.');
      return;
    }
    setSaveDialogOpen(true);
  };

  const handleSaveConfirm = () => {
    if (!circuitName.trim()) {
      alert('Please enter a circuit name');
      return;
    }

    const circuit = {
      name: circuitName.trim(),
      description: circuitDescription.trim(),
      numQubits: currentCircuit.numQubits,
      gates: currentCircuit.gates,
      tags: circuitTags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
      metadata: {},
    };

    saveCircuitToLibrary(circuit);
    setSaveDialogOpen(false);
    setCircuitName('');
    setCircuitDescription('');
    setCircuitTags('');
    refreshData();
    setActiveTab('custom');
  };

  const handleExportCircuit = (circuit) => {
    const json = exportCircuit(circuit.id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${circuit.name.replace(/\s+/g, '_')}_circuit.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportLibrary = () => {
    const json = exportLibrary();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit_library_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportLibrary = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = importLibrary(e.target.result, { merge: true });
      if (result.success) {
        alert(`Successfully imported ${result.imported} circuit(s). Total: ${result.total}`);
        refreshData();
      } else {
        alert(`Import failed: ${result.error}`);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  // Get filtered templates
  const filteredTemplates = useMemo(() => {
    let templates = Object.values(CIRCUIT_TEMPLATES);

    // Filter by category
    if (activeCategory !== 'all') {
      templates = templates.filter((t) => t.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.includes(query))
      );
    }

    // Filter by complexity
    if (filterComplexity !== 'all') {
      templates = templates.filter((t) => t.complexity === filterComplexity);
    }

    return templates;
  }, [activeCategory, searchQuery, filterComplexity]);

  // Get filtered custom circuits
  const filteredCustomCircuits = useMemo(() => {
    let circuits = [...customCircuits];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      circuits = circuits.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Filter by complexity
    if (filterComplexity !== 'all') {
      circuits = circuits.filter((c) => c.complexity === filterComplexity);
    }

    // Sort
    circuits = sortLibrary(circuits, sortBy, sortOrder);

    return circuits;
  }, [customCircuits, searchQuery, filterComplexity, sortBy, sortOrder]);

  // Get favorites (both built-in and custom)
  const favoriteCircuits = useMemo(() => {
    const favIds = favorites;
    const allCircuits = {
      ...CIRCUIT_TEMPLATES,
      ...Object.fromEntries(customCircuits.map((c) => [c.id, c])),
    };

    return favIds
      .map((id) => allCircuits[id])
      .filter((c) => c !== undefined);
  }, [favorites, customCircuits]);

  const stats = getLibraryStatistics();
  const totalTemplates = Object.keys(CIRCUIT_TEMPLATES).length;

  return (
    <div className="circuit-library-modal">
      <div className="library-header">
        <h2>Circuit Library</h2>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="library-stats">
        <div className="stat-item">
          <span className="stat-number">{totalTemplates}</span>
          <span className="stat-label">Built-in Templates</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Custom Circuits</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{favorites.length}</span>
          <span className="stat-label">Favorites</span>
        </div>
      </div>

      <div className="library-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search circuits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select
            value={filterComplexity}
            onChange={(e) => setFilterComplexity(e.target.value)}
            className="complexity-filter"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {activeTab === 'custom' && (
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="name">Name</option>
              <option value="createdAt">Created Date</option>
              <option value="updatedAt">Updated Date</option>
              <option value="gateCount">Gate Count</option>
              <option value="numQubits">Qubit Count</option>
            </select>
          )}
          
          {activeTab === 'custom' && (
            <button
              className="sort-order-btn"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          )}
        </div>
      </div>

      <div className="library-tabs">
        <button
          className={`tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Built-in Templates
        </button>
        <button
          className={`tab ${activeTab === 'custom' ? 'active' : ''}`}
          onClick={() => setActiveTab('custom')}
        >
          My Circuits ({stats.total})
        </button>
        <button
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites ({favorites.length})
        </button>
        <button
          className={`tab ${activeTab === 'recent' ? 'active' : ''}`}
          onClick={() => setActiveTab('recent')}
        >
          Recent
        </button>
      </div>

      {activeTab === 'templates' && (
        <div className="category-tabs">
          <button
            className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          <button
            className={`category-tab ${activeCategory === TEMPLATE_CATEGORIES.ALGORITHMS ? 'active' : ''}`}
            onClick={() => setActiveCategory(TEMPLATE_CATEGORIES.ALGORITHMS)}
          >
            🧮 Algorithms
          </button>
          <button
            className={`category-tab ${activeCategory === TEMPLATE_CATEGORIES.BUILDING_BLOCKS ? 'active' : ''}`}
            onClick={() => setActiveCategory(TEMPLATE_CATEGORIES.BUILDING_BLOCKS)}
          >
            🧱 Building Blocks
          </button>
          <button
            className={`category-tab ${activeCategory === TEMPLATE_CATEGORIES.BENCHMARKS ? 'active' : ''}`}
            onClick={() => setActiveCategory(TEMPLATE_CATEGORIES.BENCHMARKS)}
          >
            📊 Benchmarks
          </button>
          <button
            className={`category-tab ${activeCategory === TEMPLATE_CATEGORIES.TUTORIALS ? 'active' : ''}`}
            onClick={() => setActiveCategory(TEMPLATE_CATEGORIES.TUTORIALS)}
          >
            📚 Tutorials
          </button>
        </div>
      )}

      <div className="library-content">
        {activeTab === 'templates' && (
          <div className="templates-grid">
            {filteredTemplates.length === 0 ? (
              <div className="empty-state">
                <p>No templates found matching your criteria.</p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onLoad={handleLoadTemplate}
                  onFavorite={handleFavorite}
                  isFavorite={checkIsFavorite(template.id)}
                  isCustom={false}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'custom' && (
          <>
            <div className="custom-actions">
              <button className="save-btn" onClick={handleSaveCurrentCircuit}>
                💾 Save Current Circuit
              </button>
              <button className="export-btn" onClick={handleExportLibrary}>
                ⬇ Export Library
              </button>
              <label className="import-btn">
                ⬆ Import Library
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportLibrary}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div className="templates-grid">
              {filteredCustomCircuits.length === 0 ? (
                <div className="empty-state">
                  <p>No custom circuits yet.</p>
                  <p>Build a circuit and click "Save Current Circuit" to add it to your library!</p>
                </div>
              ) : (
                filteredCustomCircuits.map((circuit) => (
                  <TemplateCard
                    key={circuit.id}
                    template={circuit}
                    onLoad={handleLoadTemplate}
                    onFavorite={handleFavorite}
                    isFavorite={checkIsFavorite(circuit.id)}
                    isCustom={true}
                    onDelete={handleDeleteCircuit}
                    onExport={handleExportCircuit}
                  />
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'favorites' && (
          <div className="templates-grid">
            {favoriteCircuits.length === 0 ? (
              <div className="empty-state">
                <p>No favorites yet.</p>
                <p>Click the ★ icon on any circuit to add it to your favorites!</p>
              </div>
            ) : (
              favoriteCircuits.map((circuit) => (
                <TemplateCard
                  key={circuit.id}
                  template={circuit}
                  onLoad={handleLoadTemplate}
                  onFavorite={handleFavorite}
                  isFavorite={true}
                  isCustom={circuit.category === 'custom'}
                  onDelete={circuit.category === 'custom' ? handleDeleteCircuit : undefined}
                  onExport={circuit.category === 'custom' ? handleExportCircuit : undefined}
                />
              ))
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div className="templates-grid">
            {recent.length === 0 ? (
              <div className="empty-state">
                <p>No recent circuits.</p>
                <p>Load a circuit to see it appear here!</p>
              </div>
            ) : (
              recent.map((circuit) => (
                <TemplateCard
                  key={circuit.id}
                  template={circuit}
                  onLoad={handleLoadTemplate}
                  onFavorite={handleFavorite}
                  isFavorite={checkIsFavorite(circuit.id)}
                  isCustom={circuit.category === 'custom'}
                  onDelete={circuit.category === 'custom' ? handleDeleteCircuit : undefined}
                  onExport={circuit.category === 'custom' ? handleExportCircuit : undefined}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Save Dialog */}
      {saveDialogOpen && (
        <div className="save-dialog-overlay" onClick={() => setSaveDialogOpen(false)}>
          <div className="save-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>Save Circuit to Library</h3>
            <div className="form-group">
              <label>Circuit Name *</label>
              <input
                type="text"
                value={circuitName}
                onChange={(e) => setCircuitName(e.target.value)}
                placeholder="Enter circuit name"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={circuitDescription}
                onChange={(e) => setCircuitDescription(e.target.value)}
                placeholder="Describe what this circuit does"
                rows={3}
              />
            </div>
            <div className="form-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                value={circuitTags}
                onChange={(e) => setCircuitTags(e.target.value)}
                placeholder="e.g., custom, experiment, algorithm"
              />
            </div>
            <div className="dialog-actions">
              <button className="cancel-btn" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleSaveConfirm}>
                Save Circuit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CircuitLibrary;

// Circuit library manager for saving and loading custom circuits

const LIBRARY_STORAGE_KEY = 'quantum_circuit_library';
const FAVORITES_STORAGE_KEY = 'quantum_circuit_favorites';
const RECENT_STORAGE_KEY = 'quantum_circuit_recent';

// Initialize library structure
const initializeLibrary = () => {
  if (!localStorage.getItem(LIBRARY_STORAGE_KEY)) {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(FAVORITES_STORAGE_KEY)) {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
  }
  if (!localStorage.getItem(RECENT_STORAGE_KEY)) {
    localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify([]));
  }
};

// Save a circuit to the library
export const saveCircuitToLibrary = (circuit) => {
  initializeLibrary();

  const library = JSON.parse(localStorage.getItem(LIBRARY_STORAGE_KEY));

  // Generate unique ID if not provided
  const circuitId = circuit.id || `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const circuitData = {
    id: circuitId,
    name: circuit.name || 'Untitled Circuit',
    description: circuit.description || '',
    numQubits: circuit.numQubits,
    gates: circuit.gates,
    category: 'custom',
    complexity: circuit.complexity || calculateComplexity(circuit.gates),
    gateCount: circuit.gates.length,
    depth: calculateDepth(circuit.gates),
    tags: circuit.tags || ['custom'],
    createdAt: circuit.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    metadata: circuit.metadata || {},
  };

  // Check if circuit already exists (update) or is new (insert)
  const existingIndex = library.findIndex((c) => c.id === circuitId);

  if (existingIndex !== -1) {
    library[existingIndex] = circuitData;
  } else {
    library.push(circuitData);
  }

  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));

  return circuitData;
};

// Load all circuits from library
export const loadLibrary = () => {
  initializeLibrary();
  return JSON.parse(localStorage.getItem(LIBRARY_STORAGE_KEY));
};

// Load a specific circuit by ID
export const loadCircuitById = (id) => {
  const library = loadLibrary();
  return library.find((circuit) => circuit.id === id) || null;
};

// Delete a circuit from library
export const deleteCircuitFromLibrary = (id) => {
  const library = loadLibrary();
  const filtered = library.filter((circuit) => circuit.id !== id);
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(filtered));

  // Also remove from favorites if present
  const favorites = getFavorites();
  const filteredFavorites = favorites.filter((favId) => favId !== id);
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(filteredFavorites));

  return true;
};

// Update circuit metadata
export const updateCircuitMetadata = (id, metadata) => {
  const library = loadLibrary();
  const index = library.findIndex((c) => c.id === id);

  if (index !== -1) {
    library[index] = {
      ...library[index],
      ...metadata,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(library));
    return library[index];
  }

  return null;
};

// Favorites management
export const toggleFavorite = (id) => {
  initializeLibrary();
  const favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY));

  const index = favorites.indexOf(id);
  if (index !== -1) {
    favorites.splice(index, 1); // Remove from favorites
  } else {
    favorites.push(id); // Add to favorites
  }

  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  return favorites;
};

export const getFavorites = () => {
  initializeLibrary();
  return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY));
};

export const isFavorite = (id) => {
  const favorites = getFavorites();
  return favorites.includes(id);
};

// Recent circuits management (max 10)
export const addToRecent = (id) => {
  initializeLibrary();
  const recent = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY));

  // Remove if already present
  const filtered = recent.filter((recentId) => recentId !== id);

  // Add to beginning
  filtered.unshift(id);

  // Keep only last 10
  const trimmed = filtered.slice(0, 10);

  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
};

export const getRecent = () => {
  initializeLibrary();
  const recentIds = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY));
  const library = loadLibrary();

  // Return full circuit objects for recent IDs
  return recentIds
    .map((id) => library.find((c) => c.id === id))
    .filter((c) => c !== undefined);
};

// Import/Export functionality
export const exportLibrary = () => {
  const library = loadLibrary();
  const favorites = getFavorites();

  const exportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    circuits: library,
    favorites: favorites,
  };

  return JSON.stringify(exportData, null, 2);
};

export const importLibrary = (jsonString, options = { merge: true }) => {
  try {
    const importData = JSON.parse(jsonString);

    if (!importData.circuits || !Array.isArray(importData.circuits)) {
      throw new Error('Invalid library format');
    }

    const currentLibrary = options.merge ? loadLibrary() : [];
    const currentFavorites = options.merge ? getFavorites() : [];

    // Merge circuits (avoid duplicates by ID)
    const mergedCircuits = [...currentLibrary];
    importData.circuits.forEach((circuit) => {
      const existingIndex = mergedCircuits.findIndex((c) => c.id === circuit.id);
      if (existingIndex !== -1) {
        // Update existing
        mergedCircuits[existingIndex] = {
          ...circuit,
          updatedAt: new Date().toISOString(),
        };
      } else {
        // Add new
        mergedCircuits.push(circuit);
      }
    });

    // Merge favorites
    const mergedFavorites = [
      ...new Set([...currentFavorites, ...(importData.favorites || [])]),
    ];

    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(mergedCircuits));
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(mergedFavorites));

    return {
      success: true,
      imported: importData.circuits.length,
      total: mergedCircuits.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Export a single circuit
export const exportCircuit = (id) => {
  const circuit = loadCircuitById(id);
  if (!circuit) return null;

  return JSON.stringify(
    {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      circuit: circuit,
    },
    null,
    2
  );
};

// Import a single circuit
export const importCircuit = (jsonString) => {
  try {
    const importData = JSON.parse(jsonString);

    if (!importData.circuit) {
      throw new Error('Invalid circuit format');
    }

    const savedCircuit = saveCircuitToLibrary(importData.circuit);

    return {
      success: true,
      circuit: savedCircuit,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Search and filter
export const searchLibrary = (query) => {
  const library = loadLibrary();
  const lowerQuery = query.toLowerCase();

  return library.filter(
    (circuit) =>
      circuit.name.toLowerCase().includes(lowerQuery) ||
      circuit.description.toLowerCase().includes(lowerQuery) ||
      circuit.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

export const filterLibrary = (filters) => {
  const library = loadLibrary();
  let filtered = [...library];

  if (filters.category) {
    filtered = filtered.filter((c) => c.category === filters.category);
  }

  if (filters.complexity) {
    filtered = filtered.filter((c) => c.complexity === filters.complexity);
  }

  if (filters.minQubits !== undefined) {
    filtered = filtered.filter((c) => c.numQubits >= filters.minQubits);
  }

  if (filters.maxQubits !== undefined) {
    filtered = filtered.filter((c) => c.numQubits <= filters.maxQubits);
  }

  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter((c) =>
      filters.tags.some((tag) => c.tags.includes(tag))
    );
  }

  if (filters.favoritesOnly) {
    const favorites = getFavorites();
    filtered = filtered.filter((c) => favorites.includes(c.id));
  }

  return filtered;
};

// Sort library
export const sortLibrary = (library, sortBy = 'name', order = 'asc') => {
  const sorted = [...library];

  sorted.sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'name':
        compareValue = a.name.localeCompare(b.name);
        break;
      case 'createdAt':
        compareValue = new Date(a.createdAt) - new Date(b.createdAt);
        break;
      case 'updatedAt':
        compareValue = new Date(a.updatedAt) - new Date(b.updatedAt);
        break;
      case 'gateCount':
        compareValue = a.gateCount - b.gateCount;
        break;
      case 'depth':
        compareValue = a.depth - b.depth;
        break;
      case 'numQubits':
        compareValue = a.numQubits - b.numQubits;
        break;
      default:
        compareValue = 0;
    }

    return order === 'asc' ? compareValue : -compareValue;
  });

  return sorted;
};

// Utility functions
const calculateDepth = (gates) => {
  if (gates.length === 0) return 0;
  return Math.max(...gates.map((g) => g.step || 0)) + 1;
};

const calculateComplexity = (gates) => {
  const gateCount = gates.length;
  const depth = calculateDepth(gates);

  // Simple heuristic for complexity
  if (gateCount <= 5 && depth <= 3) return 'Beginner';
  if (gateCount <= 12 && depth <= 6) return 'Intermediate';
  return 'Advanced';
};

// Get library statistics
export const getLibraryStatistics = () => {
  const library = loadLibrary();
  const favorites = getFavorites();

  return {
    total: library.length,
    favorites: favorites.length,
    byComplexity: {
      beginner: library.filter((c) => c.complexity === 'Beginner').length,
      intermediate: library.filter((c) => c.complexity === 'Intermediate').length,
      advanced: library.filter((c) => c.complexity === 'Advanced').length,
    },
    avgGateCount:
      library.length > 0
        ? Math.round(
            library.reduce((sum, c) => sum + c.gateCount, 0) / library.length
          )
        : 0,
    avgDepth:
      library.length > 0
        ? Math.round(library.reduce((sum, c) => sum + c.depth, 0) / library.length)
        : 0,
  };
};

// Clear library (with confirmation)
export const clearLibrary = () => {
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([]));
  localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify([]));
  return true;
};

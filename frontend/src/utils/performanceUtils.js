/**
 * Performance Utilities for Circuit Builder
 * Caching, memoization, and optimization helpers
 */

// Circuit cache for expensive computations
const circuitCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Generate a cache key from gates array
 */
export function generateCacheKey(gates, ...additionalParams) {
  const gateStr = JSON.stringify(gates);
  const paramsStr = additionalParams.map(p => JSON.stringify(p)).join('|');
  return `${gateStr}|${paramsStr}`;
}

/**
 * Get cached result or compute and cache
 */
export function getCached(key, computeFn) {
  if (circuitCache.has(key)) {
    return circuitCache.get(key);
  }
  
  const result = computeFn();
  
  // Implement LRU cache eviction
  if (circuitCache.size >= MAX_CACHE_SIZE) {
    const firstKey = circuitCache.keys().next().value;
    circuitCache.delete(firstKey);
  }
  
  circuitCache.set(key, result);
  return result;
}

/**
 * Clear circuit cache
 */
export function clearCache() {
  circuitCache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: circuitCache.size,
    maxSize: MAX_CACHE_SIZE,
    utilization: `${((circuitCache.size / MAX_CACHE_SIZE) * 100).toFixed(1)}%`
  };
}

/**
 * Debounce function for expensive operations
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for limiting call frequency
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize expensive computations
 */
export function memoize(fn) {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Lazy load component with retry logic
 */
export function lazyWithRetry(componentImport) {
  return new Promise((resolve, reject) => {
    const attemptImport = (retries = 3) => {
      componentImport()
        .then(resolve)
        .catch((error) => {
          if (retries === 0) {
            reject(error);
          } else {
            setTimeout(() => attemptImport(retries - 1), 1000);
          }
        });
    };
    attemptImport();
  });
}

/**
 * Deep comparison for React memo
 */
export function deepCompare(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  if (obj1 === null || obj2 === null) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepCompare(obj1[key], obj2[key])) return false;
  }
  
  return true;
}

/**
 * Batch updates for better performance
 */
export class BatchUpdater {
  constructor(callback, delay = 16) {
    this.callback = callback;
    this.delay = delay;
    this.updates = [];
    this.timeout = null;
  }
  
  add(update) {
    this.updates.push(update);
    
    if (!this.timeout) {
      this.timeout = setTimeout(() => {
        this.flush();
      }, this.delay);
    }
  }
  
  flush() {
    if (this.updates.length > 0) {
      this.callback(this.updates);
      this.updates = [];
    }
    this.timeout = null;
  }
}

/**
 * Virtual scrolling helper for large lists
 */
export function calculateVisibleRange(scrollTop, itemHeight, containerHeight, totalItems) {
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    Math.ceil((scrollTop + containerHeight) / itemHeight),
    totalItems
  );
  
  // Add buffer for smooth scrolling
  const buffer = 5;
  return {
    start: Math.max(0, startIndex - buffer),
    end: Math.min(totalItems, endIndex + buffer)
  };
}

/**
 * Request idle callback polyfill
 */
export const requestIdleCallback = 
  window.requestIdleCallback ||
  function(handler) {
    const startTime = Date.now();
    return setTimeout(function() {
      handler({
        didTimeout: false,
        timeRemaining: function() {
          return Math.max(0, 50.0 - (Date.now() - startTime));
        }
      });
    }, 1);
  };

/**
 * Cancel idle callback polyfill
 */
export const cancelIdleCallback =
  window.cancelIdleCallback ||
  function(id) {
    clearTimeout(id);
  };

/**
 * Schedule low-priority work
 */
export function scheduleLowPriority(callback) {
  return requestIdleCallback(callback, { timeout: 2000 });
}

/**
 * Measure component render time
 */
export function measurePerformance(componentName, callback) {
  const startTime = performance.now();
  const result = callback();
  const endTime = performance.now();
  
  if (endTime - startTime > 16) {
    console.warn(`${componentName} took ${(endTime - startTime).toFixed(2)}ms to render`);
  }
  
  return result;
}

/**
 * Check if two arrays are equal (shallow comparison)
 */
export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;
  
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  
  return true;
}

/**
 * Optimize large object operations
 */
export function optimizeObject(obj, maxDepth = 3) {
  if (maxDepth === 0 || typeof obj !== 'object' || obj === null) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => optimizeObject(item, maxDepth - 1));
  }
  
  const optimized = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      optimized[key] = optimizeObject(obj[key], maxDepth - 1);
    }
  }
  
  return optimized;
}

/**
 * Create a performance monitor
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }
  
  start(label) {
    this.metrics.set(label, performance.now());
  }
  
  end(label) {
    const startTime = this.metrics.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.metrics.delete(label);
      return duration;
    }
    return null;
  }
  
  measure(label, callback) {
    this.start(label);
    const result = callback();
    const duration = this.end(label);
    console.log(`${label}: ${duration?.toFixed(2)}ms`);
    return result;
  }
}

// Global performance monitor instance
export const perfMonitor = new PerformanceMonitor();

/**
 * Memory-efficient state updates
 */
export function createOptimizedUpdater(setState) {
  const pending = new Set();
  let frameId = null;
  
  return (key, value) => {
    pending.add({ key, value });
    
    if (!frameId) {
      frameId = requestAnimationFrame(() => {
        const updates = {};
        pending.forEach(({ key, value }) => {
          updates[key] = value;
        });
        
        setState(prev => ({ ...prev, ...updates }));
        pending.clear();
        frameId = null;
      });
    }
  };
}

/**
 * Check if browser supports web workers
 */
export function supportsWebWorkers() {
  return typeof Worker !== 'undefined';
}

/**
 * Create a simple web worker wrapper
 */
export function createWorker(workerFunction) {
  if (!supportsWebWorkers()) {
    return null;
  }
  
  const code = workerFunction.toString();
  const blob = new Blob(['('+code+')()'], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

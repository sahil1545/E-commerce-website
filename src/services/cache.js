class Cache {
  constructor() {
    this.cache = new Map();
  }

  set(key, data, ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });

    // Also store in localStorage for persistence
    try {
      localStorage.setItem(`cache_${key}`, JSON.stringify({ data, expiry }));
    } catch (e) {
      // localStorage might be full
    }
  }

  get(key) {
    // Check memory cache first
    let cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }

    // Check localStorage
    try {
      const stored = localStorage.getItem(`cache_${key}`);
      if (stored) {
        cached = JSON.parse(stored);
        if (cached && cached.expiry && Date.now() < cached.expiry) {
          // Restore to memory cache
          this.cache.set(key, cached);
          return cached.data;
        } else {
          // Expired or invalid, remove
          localStorage.removeItem(`cache_${key}`);
        }
      }
    } catch (e) {
      // localStorage error, remove corrupted data
      try {
        localStorage.removeItem(`cache_${key}`);
      } catch (e2) {}
    }

    return null;
  }

  clear() {
    this.cache.clear();
    // Clear localStorage cache items
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cache_')) {
        localStorage.removeItem(key);
      }
    });
  }

  invalidate(pattern) {
    // Remove cache entries matching pattern
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        try {
          localStorage.removeItem(`cache_${key}`);
        } catch (e) {}
      }
    }
  }
}

const cache = new Cache();
export default cache;
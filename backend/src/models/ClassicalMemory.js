class ClassicalMemory {
    constructor(size = 1024) { // Size in MB
      this.size = size;
      this.memory = new Map();
      this.cache = {
        L1: new Map(), // 32KB
        L2: new Map(), // 256KB  
        L3: new Map()  // 8MB
      };
      this.accessHistory = [];
      this.hitRates = { L1: 0, L2: 0, L3: 0 };
    }
  
    write(address, data, type = 'data') {
      const timestamp = Date.now();
      const entry = {
        data,
        type,
        timestamp,
        accessCount: 0,
        lastAccessed: timestamp
      };
  
      this.memory.set(address, entry);
      
      // Update caches using LRU policy
      this.updateCache('L1', address, entry);
      
      this.accessHistory.push({
        operation: 'WRITE',
        address,
        timestamp,
        cacheHit: false
      });
  
      return { address, size: this.calculateSize(data), timestamp };
    }

    read(address) {
      const timestamp = Date.now();
      let cacheLevel = null;
      let entry = null;
  
      // Check cache hierarchy
      if (this.cache.L1.has(address)) {
        entry = this.cache.L1.get(address);
        cacheLevel = 'L1';
        this.hitRates.L1++;
      } else if (this.cache.L2.has(address)) {
        entry = this.cache.L2.get(address);
        cacheLevel = 'L2';
        this.hitRates.L2++;
        // Promote to L1
        this.updateCache('L1', address, entry);
      } else if (this.cache.L3.has(address)) {
        entry = this.cache.L3.get(address);
        cacheLevel = 'L3';
        this.hitRates.L3++;
        // Promote to L2 and L1
        this.updateCache('L2', address, entry);
        this.updateCache('L1', address, entry);
      } else {
        // Cache miss - fetch from main memory
        entry = this.memory.get(address);
        if (entry) {
          this.updateCache('L1', address, entry);
        }
      }
  
      if (entry) {
        entry.accessCount++;
        entry.lastAccessed = timestamp;
      }
  
      this.accessHistory.push({
        operation: 'READ',
        address,
        timestamp,
        cacheHit: cacheLevel !== null,
        cacheLevel
      });
  
      return entry ? { ...entry, cacheLevel } : null;
    }
  
    updateCache(level, address, entry) {
      const cache = this.cache[level];
      const maxSize = this.getCacheSize(level);
  
      if (cache.size >= maxSize) {
        const oldestAddress = this.findLRUAddress(cache);
        cache.delete(oldestAddress);
      }
  
      cache.set(address, { ...entry, cachedAt: Date.now() });
    }
  
    getCacheSize(level) {
      const sizes = { L1: 32, L2: 256, L3: 8192 }; // In entries
      return sizes[level] || 32;
    }
  
    findLRUAddress(cache) {
      let oldestTime = Date.now();
      let oldestAddress = null;
  
      for (const [address, entry] of cache.entries()) {
        if (entry.lastAccessed < oldestTime) {
          oldestTime = entry.lastAccessed;
          oldestAddress = address;
        }
      }
  
      return oldestAddress;
    }
  
    calculateSize(data) {
      return JSON.stringify(data).length;
    }
  
    getMemoryStats() {
      const totalAccesses = this.accessHistory.length;
      const recentAccesses = this.accessHistory.slice(-100);
      
      return {
        totalSize: this.size,
        usedMemory: this.memory.size,
        cacheStats: {
          L1: {
            size: this.cache.L1.size,
            hitRate: totalAccesses > 0 ? (this.hitRates.L1 / totalAccesses) * 100 : 0
          },
          L2: {
            size: this.cache.L2.size,
            hitRate: totalAccesses > 0 ? (this.hitRates.L2 / totalAccesses) * 100 : 0
          },
          L3: {
            size: this.cache.L3.size,
            hitRate: totalAccesses > 0 ? (this.hitRates.L3 / totalAccesses) * 100 : 0
          }
        },
        recentAccesses,
        performance: this.calculatePerformance()
      };
    }
  
    calculatePerformance() {
      const recentAccesses = this.accessHistory.slice(-50);
      const avgLatency = recentAccesses.reduce((sum, access, index, arr) => {
        if (index === 0) return 0;
        return sum + (access.timestamp - arr[index - 1].timestamp);
      }, 0) / Math.max(recentAccesses.length - 1, 1);
  
      return {
        averageLatency: avgLatency,
        throughput: recentAccesses.length / 10,
        efficiency: this.calculateEfficiency()
      };
    }
  
    calculateEfficiency() {
      const totalHits = this.hitRates.L1 + this.hitRates.L2 + this.hitRates.L3;
      const totalAccesses = this.accessHistory.length;
      return totalAccesses > 0 ? (totalHits / totalAccesses) * 100 : 0;
    }
  }
  
  module.exports = ClassicalMemory;
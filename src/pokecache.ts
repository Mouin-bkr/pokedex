 type  CacheEntry <T>  = {
   createdAt: number;
   val : T
}

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  #interval: number;

  public constructor(interval: number) {
    this.#interval = interval;
    this.#startReapLoop();
  }

   #reap() {
    const now = Date.now();
    for (const [key, entry] of this.#cache.entries()) {
      if (now - entry.createdAt >= this.#interval) {
        this.#cache.delete(key);
      }
    }
  }

   #startReapLoop() {
    this.#reapIntervalId = setInterval(() => {
      this.#reap();
    }, this.#interval);
  }

   stopReapLoop() {
    if (this.#reapIntervalId) {
      clearInterval(this.#reapIntervalId);
      this.#reapIntervalId = undefined;
    }
  }

  add<T>(key:string, val: T) {
    const cacheEntry: CacheEntry<T> = {
      createdAt: Date.now(),
      val: val
    }
    this.#cache.set(key, cacheEntry);
 }

  get<T>(key:string) {
    const cacheEntry = this.#cache.get(key);
    if (cacheEntry) {
      return cacheEntry.val as T;
    }
    else {
      return undefined;
    }
}

}



 type  CacheEntry <T>  = {
   createdAt: [number],
   val : T
}

export class Cache {
  #cache = new Map<string, CacheEntry<any>>();
  #reapIntervalId: NodeJS.Timeout | undefined = undefined;
  #interval: number;
}

export function add<T>(key:string, val: <T>) {
  cache.add(<key, val >);
}
export function get<T>(key:string) {
  for (key in cache) {
    result =  cache.find(key);
  }
  if (!result) {
    return undefined
  }
  return result;
}

function #reap() {
  if (this.#interval > Date.now()) {
    cache.pop()
}

  function #startRealLoop() {

}

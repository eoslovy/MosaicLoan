export class SeededRandom {
    private seed: number;
  
    constructor(seed: number) {
      this.seed = seed;
    }

    next(): number {
      this.seed = (this.seed * 9301 + 49297) % 233280;
      return this.seed / 233280;
    }

    nextInt(min: number, max: number): number {
      return Math.floor(this.next() * (max - min + 1)) + min;
    }

    nextFloat(min: number, max: number): number {
      return this.next() * (max - min) + min;
    }

    choice<T>(items: T[]): T {
      return items[this.nextInt(0, items.length - 1)];
    }

    weightedChoice<T>(items: T[], getWeight: (item: T) => number): T {
      const totalWeight = items.reduce((sum, item) => sum + getWeight(item), 0);
      let random = this.next() * totalWeight;
      
      for (const item of items) {
        random -= getWeight(item);
        if (random <= 0) {
          return item;
        }
      }
      
      return items[items.length - 1];
    }
  }


class SeededRandom {
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
    const random = this.next() * totalWeight;

    let accumulated = 0;
    const chosen = items.find((item) => {
      accumulated += getWeight(item);
      return random <= accumulated;
    });

    return chosen ?? items[items.length - 1];
  }
}

export default SeededRandom;

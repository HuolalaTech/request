export abstract class BaseMPO {
  canIUse(name: string) {
    if (name === 'request') return true;
    return false;
  }
}

class RequestAbortSignal implements AbortSignal {
  private listeners: Record<string, ((e: Event) => void)[]>;
  private et: EventTarget;

  public onabort: ((this: AbortSignal, ev: Event) => void) | null;
  public readonly aborted: boolean;
  public readonly reason: unknown;

  constructor() {
    this.et = new EventTarget();
    this.listeners = Object.create(null);
    this.onabort = null;
    this.aborted = false;
    this.reason = undefined;

    this.addEventListener('abort', (e) => {
      if (this.onabort) this.onabort(e);
    });
  }

  public addEventListener(type: 'abort', listener: (e: Event) => void): void {
    this.et.addEventListener(type, listener);
  }

  public removeEventListener(type: 'abort', listener: (e: Event) => void): void {
    this.et.removeEventListener(type, listener);
  }

  public dispatchEvent(event: Event): boolean {
    return this.et.dispatchEvent(event);
  }

  public throwIfAborted(): void {
    if (this.aborted) throw this.reason;
  }
}

export class RequestController implements AbortController {
  constructor() {
    this.signal = new RequestAbortSignal();
  }
  public abort(reason?: unknown): void {
    const { signal } = this;
    if (signal.aborted) return;
    Object.defineProperties(signal, {
      aborted: { configurable: true, enumerable: true, value: true },
      reason: { configurable: true, enumerable: true, value: reason ?? new Error('signal is aborted without reason') },
    });
    this.signal.dispatchEvent(new Event('abort'));
  }
  public readonly signal: AbortSignal;
}

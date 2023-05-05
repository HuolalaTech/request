/* eslint-disable prefer-promise-reject-errors */

import { Interceptor } from '../Interceptor';

interface A {
  a: number;
}

const addOne = ({ a }: A) => ({ a: a + 1 });
const mulThree = ({ a }: A) => ({ a: a * 3 });

test('order', async () => {
  const icpt = new Interceptor<A, Record<string, never>>();

  icpt.use(addOne);
  // 1 + 1 = 2
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 1 }), {})).resolves.toMatchObject({ a: 2 });

  icpt.use(mulThree);
  // (1 * 3) + 1 = 4
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 1 }), {})).resolves.toMatchObject({ a: 4 });

  icpt.eject(addOne);
  // 1 * 3 = 3
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 1 }), {})).resolves.toMatchObject({ a: 3 });

  icpt.use(addOne);
  // (1 + 1) * 3 = 6
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 1 }), {})).resolves.toMatchObject({ a: 6 });

  icpt.eject(addOne);
  icpt.eject(mulThree);

  // 1 = 1
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 1 }), {})).resolves.toMatchObject({ a: 1 });
});

test('catchAndAddOne', async () => {
  const icpt = new Interceptor<A, Record<string, never>>();

  const catchAndAddOne = (e: unknown) => addOne(e as A);
  icpt.use(undefined, catchAndAddOne);
  // Nothing to do
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 1 }), {})).resolves.toMatchObject({ a: 1 });
  // Change "reject" to "resolve", and 1 + 1 = 2
  await expect(Interceptor.pipeline(icpt, Promise.reject({ a: 1 }), {})).resolves.toMatchObject({ a: 2 });

  icpt.eject(undefined, catchAndAddOne);

  // Nothing to do
  await expect(Interceptor.pipeline(icpt, Promise.reject({ a: 1 }), {})).rejects.toMatchObject({ a: 1 });
});

test('throw', async () => {
  const icpt = new Interceptor<A, Record<string, never>>();

  const hehe = new Error('hehe');
  const haha = new Error('haha');

  const throwHehe = () => {
    throw hehe;
  };

  icpt.use(null, throwHehe);
  await expect(Interceptor.pipeline(icpt, Promise.reject({ a: 1 }), {})).rejects.toMatchObject(hehe);
  icpt.eject(null, throwHehe);

  icpt.use(
    ({ a }) => {
      if (typeof a === 'number') return { a: a * 5 };
      return { a: 0 };
    },
    (e) => {
      const { a } = Object(e);
      if (typeof a === 'number') return { a: a * 3 };
      throw haha;
    },
  );
  await expect(Interceptor.pipeline(icpt, Promise.reject({ a: 3 }), {})).resolves.toMatchObject({ a: 9 });
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 3 }), {})).resolves.toMatchObject({ a: 15 });

  icpt.use(null, throwHehe);
  await expect(Interceptor.pipeline(icpt, Promise.reject({ a: 1 }), {})).rejects.toMatchObject(haha);
});

test('partial change', async () => {
  interface A {
    a: number;
    b: number;
  }
  const icipt = new Interceptor<A, Record<string, never>>();
  const addOne = ({ a }: A) => ({ a: a + 1 });
  icipt.use(addOne);
  await expect(Interceptor.pipeline(icipt, Promise.resolve({ a: 3, b: 9 }), {})).resolves.toMatchObject({ a: 4, b: 9 });
});

test('void', async () => {
  interface A {
    a: number;
    b: number;
  }
  const icpt = new Interceptor<A, Record<string, never>>();
  icpt.use(() => {
    /* noop */
  });
  await expect(Interceptor.pipeline(icpt, Promise.resolve({ a: 3, b: 9 }), {})).resolves.toMatchObject({ a: 3, b: 9 });
});

test('reassign param', async () => {
  interface A {
    a: number;
    b: number;
  }
  const icpt = new Interceptor<A, Record<string, never>>();
  icpt.use((o) => {
    /* eslint-disable no-param-reassign */
    o.a++;
    o.b++;
  });
  const src = { a: 3, b: 9 };
  await expect(Interceptor.pipeline(icpt, Promise.resolve(src), {})).resolves.toMatchObject({
    a: 4,
    b: 10,
  });
  // src must not be changed.
  await expect(Promise.resolve(src)).resolves.toMatchObject({ a: 3, b: 9 });
});

test('return value of eject', async () => {
  interface A {
    a: number;
  }
  const icpt = new Interceptor<A, Record<string, never>>();
  const addOne = ({ a }: A) => ({ a: a + 1 });
  icpt.use(addOne);
  expect(icpt.eject(addOne)).toBeTruthy();
  expect(icpt.eject(addOne)).toBeFalsy();
});

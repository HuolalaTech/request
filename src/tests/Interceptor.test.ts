/* eslint-disable prefer-promise-reject-errors */

import { Interceptor } from "../Interceptor";

test("basic", async () => {
  interface A {
    a: number;
  }
  const icpt = new Interceptor<A>();

  const addOne = ({ a }: A) => ({ a: a + 1 });
  const mulTwo = ({ a }: A) => ({ a: a * 2 });
  const hehe = new Error("hehe");
  const haha = new Error("haha");
  const throwHehe = () => {
    throw hehe;
  };

  icpt.use(addOne);
  await expect(
    Interceptor.wrap(icpt, Promise.resolve({ a: 1 }))
  ).resolves.toMatchObject({ a: 2 }); // 1 + 1

  icpt.use(mulTwo);
  await expect(
    Interceptor.wrap(icpt, Promise.resolve({ a: 1 }))
  ).resolves.toMatchObject({ a: 4 }); // (1 + 1) * 2

  icpt.eject(addOne);
  await expect(
    Interceptor.wrap(icpt, Promise.resolve({ a: 1 }))
  ).resolves.toMatchObject({ a: 2 }); // 1 * 2

  icpt.use(addOne);
  await expect(
    Interceptor.wrap(icpt, Promise.resolve({ a: 1 }))
  ).resolves.toMatchObject({ a: 3 }); // 1 * 2 + 1

  icpt.eject(addOne);
  icpt.eject(mulTwo);
  const catchAndAddOne = (e: unknown) => addOne(e as A);
  icpt.use(null, catchAndAddOne);
  await expect(
    Interceptor.wrap(icpt, Promise.resolve({ a: 1 }))
  ).resolves.toMatchObject({ a: 1 }); // Nothing to do
  await expect(
    Interceptor.wrap(icpt, Promise.reject({ a: 1 }))
  ).resolves.toMatchObject({ a: 2 }); // change "reject" to "resolve", 1 + 1

  icpt.eject(null, catchAndAddOne);
  await expect(
    Interceptor.wrap(icpt, Promise.reject({ a: 1 }))
  ).rejects.toMatchObject({ a: 1 }); // Nothing to do

  icpt.use(null, throwHehe);
  await expect(
    Interceptor.wrap(icpt, Promise.reject({ a: 1 }))
  ).rejects.toMatchObject(hehe);

  icpt.use(
    ({ a }) => {
      if (typeof a === "number") return { a: a * 5 };
      return { a: 0 };
    },
    (e) => {
      const { a } = Object(e);
      if (typeof a === "number") return { a: a * 3 };
      throw haha;
    }
  );
  await expect(
    Interceptor.wrap(icpt, Promise.reject({ a: 1 }))
  ).rejects.toMatchObject(haha);

  icpt.eject(null, throwHehe);
  await expect(
    Interceptor.wrap(icpt, Promise.reject({ a: 3 }))
  ).resolves.toMatchObject({ a: 9 });
  await expect(
    Interceptor.wrap(icpt, Promise.resolve({ a: 3 }))
  ).resolves.toMatchObject({ a: 15 });
});

test("partial change", async () => {
  interface A {
    a: number;
    b: number;
  }
  const icipt = new Interceptor<A>();
  const addOne = ({ a }: A) => ({ a: a + 1 });
  icipt.use(addOne);
  await expect(
    Interceptor.wrap(icipt, Promise.resolve({ a: 3, b: 9 }))
  ).resolves.toMatchObject({ a: 4, b: 9 });
});

test("void", async () => {
  interface A {
    a: number;
    b: number;
  }
  const icpt = new Interceptor<A>();
  icpt.use(() => {
    /* noop */
  });
  await expect(
    Interceptor.wrap(icpt, Promise.resolve({ a: 3, b: 9 }))
  ).resolves.toMatchObject({ a: 3, b: 9 });
});

test("reassign param", async () => {
  interface A {
    a: number;
    b: number;
  }
  const icpt = new Interceptor<A>();
  icpt.use((o) => {
    /* eslint-disable no-param-reassign */
    o.a++;
    o.b++;
  });
  const src = { a: 3, b: 9 };
  await expect(
    Interceptor.wrap(icpt, Promise.resolve(src))
  ).resolves.toMatchObject({
    a: 4,
    b: 10,
  });
  // src must not be changed.
  await expect(Promise.resolve(src)).resolves.toMatchObject({ a: 3, b: 9 });
});

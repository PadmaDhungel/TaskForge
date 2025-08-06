export function runStressTest(
    fn: () => any,
    iterations = 1_000_000,
    maxTimeMs = 2000
) {
    const start = Date.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(maxTimeMs);
}

export function runInvalidTypeTest(fn: (input: any) => any, expected = false) {
    const invalidInputs = [
        null,
        undefined,
        {},
        [],
        123,
        true,
        Symbol('x'),
        () => { },
        new Date(),
    ];

    for (const input of invalidInputs) {
        expect(() => fn(input)).not.toThrow();
        expect(fn(input)).toBe(expected);
    }
}

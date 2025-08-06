import { validatePassword } from '../../../src/utils/validatePassword';
import { runInvalidTypeTest } from '../../helpers/commonTests';

describe('validatePassword()', () => {
    // --- Length checks ---
    it('rejects passwords shorter than 8 characters', () => {
        expect(validatePassword('A1$ab')).toBe(false);
    });

    it('rejects passwords longer than 64 characters', () => {
        const longPassword = 'A1$' + 'a'.repeat(62); // 65 total
        expect(validatePassword(longPassword)).toBe(false);
    });

    it('accepts a valid password with exactly 64 characters', () => {
        const validPassword = 'A1$' + 'a'.repeat(61); // 64 total
        expect(validatePassword(validPassword)).toBe(true);
    });

    // --- Required character checks ---
    it('rejects passwords without a number', () => {
        expect(validatePassword('Abcdefgh$')).toBe(false);
    });

    it('rejects passwords without a special character', () => {
        expect(validatePassword('Abcdefgh1')).toBe(false);
    });

    it('rejects passwords without an uppercase letter', () => {
        expect(validatePassword('abcd$123')).toBe(false);
    });

    it('rejects passwords without a lowercase letter', () => {
        expect(validatePassword('ABCD$123')).toBe(false);
    });

    // --- Edge cases ---
    it('rejects empty string', () => {
        expect(validatePassword('')).toBe(false);
    });

    it('rejects password with only spaces', () => {
        expect(validatePassword('        ')).toBe(false);
    });

    it('rejects password with only emoji/unicode', () => {
        expect(validatePassword('😀😀😀😀😀😀😀😀')).toBe(false);
    });
    // --- Security / type safety ---
    it('handles non-string inputs safely', () => {
        runInvalidTypeTest(validatePassword);
    });

    it('accepts a fully valid password', () => {
        expect(validatePassword('Abcd$123')).toBe(true);
    });
});

export const validatePassword = (password: unknown): boolean => {
    if (typeof password !== 'string') return false;
    const trimmed = password.trim();
    const hasMinLength = trimmed.length >= 8 && trimmed.length <= 64;
    const hasNumber = /\d/.test(trimmed);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(trimmed);
    const hasUpperChar = /[A-Z]/.test(trimmed);
    const hasLowerChar = /[a-z]/.test(trimmed);
    return hasMinLength && hasNumber && hasSpecialChar && hasUpperChar && hasLowerChar;
}
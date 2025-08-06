export const validatePassword = (password: string): boolean => {
    const hasMinLength = password.length >= 8 && password.length <= 64;
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpperChar = /[A-Z]/.test(password);
    const hasLowerChar = /[a-z]/.test(password);
    return hasMinLength && hasNumber && hasSpecialChar && hasUpperChar && hasLowerChar;
}
import { validatePassword } from '../../../src/utils/validatePassword';
import { runStressTest } from '../../helpers/commonTests';

describe('validatePassword() Stress Test', () => {
    it('executes 1 million times under 2 seconds', () => {
        runStressTest(() => validatePassword('Abcd$123'));
    });
});

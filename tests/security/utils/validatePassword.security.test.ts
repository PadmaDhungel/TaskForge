import { validatePassword } from '../../../src/utils/validatePassword';
import { runInvalidTypeTest } from '../../helpers/commonTests';

describe('validatePassword() Security/Fuzz Test', () => {
    it('handles various invalid inputs safely', () => {
        runInvalidTypeTest(validatePassword);
    });
});

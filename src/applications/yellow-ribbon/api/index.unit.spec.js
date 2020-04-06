// Dependencies.
import { fetchResultsApi } from './index';

describe('Yellow Ribbon api functions', () => {
  describe('fetchResultsApi', () => {
    it('should return a normalized API response', async () => {
      const apiCall = await fetchResultsApi({ mockRequest: true });
      expect(apiCall).toBeInstanceOf(Object);
    });
  });
});

import * as selectors from '../selectors';

describe('feature-toggle selectors', () => {
  describe('toggleValues selector', () => {
    it('returns the `featureToggles` object from the Redux store', () => {
      const state = {
        featureToggles: {
          flag1: true,
          flag2: false,
        },
      };
      expect(selectors.toggleValues(state)).toEqual(state.featureToggles);
    });
    it('returns an empty object if the `featureToggles` is not set', () => {
      const state = {
        foo: 'bar',
      };
      expect(selectors.toggleValues(state)).toEqual({});
    });
  });

  describe('isProduction selector', () => {
    it('returns the `production` value if it is set on `featureToggles`', () => {
      const state = {
        featureToggles: {
          production: true,
        },
      };
      expect(selectors.isProduction(state)).toBe(true);
    });
    it('returns `undefined` if `production` is not set on `featureToggles`', () => {
      const state = {
        featureToggles: {},
      };
      expect(selectors.isProduction(state)).toBeUndefined();
    });
    it('returns `undefined` if `featureToggles` is not set', () => {
      const state = {};
      expect(selectors.isProduction(state)).toBeUndefined();
    });
  });
});

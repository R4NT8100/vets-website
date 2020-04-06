// Dependencies.
import YellowRibbonApp from '../containers/YellowRibbonApp';
import routes from './index';

describe('Yellow Ribbon routes', () => {
  it('should have the main route', () => {
    const expectedRoutes = {
      path: '/',
      component: YellowRibbonApp,
    };

    expect(routes).toEqual(expectedRoutes);
  });
});

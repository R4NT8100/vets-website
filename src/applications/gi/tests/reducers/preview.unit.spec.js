import previewReducer from '../../reducers/preview';

const initialState = {
  display: false,
  version: {},
};

describe('preview reducer', () => {
  it('should enter preview mode', () => {
    const state = previewReducer(initialState, {
      type: 'ENTER_PREVIEW_MODE',
      version: 1,
    });

    expect(state.display).toBe(true);
    expect(state.version).toBe(1);
  });

  it('should exit preview mode', () => {
    const state = previewReducer(
      { display: true },
      {
        type: 'EXIT_PREVIEW_MODE',
      },
    );

    expect(state.display).toBe(false);
    expect(state.version).toEqual({});
  });

  it('should set version correctly', () => {
    const state = previewReducer(initialState, {
      type: 'SET_VERSION',
      version: 2,
    });

    expect(state.display).toBe(false);
    expect(state.version).toBe(2);
  });
});

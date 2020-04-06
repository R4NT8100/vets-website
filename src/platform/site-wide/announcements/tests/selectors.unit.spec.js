import * as selectors from '../selectors';

describe('selectAnnouncement', () => {
  let state = null;
  let config = null;

  beforeEach(() => {
    state = {
      announcements: {
        isInitialized: true,
        dismissed: [],
      },
    };

    config = {
      announcements: [
        {
          name: 'dummy1',
          paths: /^(\/some-route-1\/)$/,
        },
        {
          name: 'dummy2',
          paths: /^(\/some-route-2\/)$/,
        },
        {
          name: 'dummy3',
          paths: /^(\/some-route-3\/)$/,
        },
        {
          name: 'dummy4',
          paths: /^(\/some-route-4\/)$/,
        },
        {
          name: 'dummy5',
          paths: /^(\/some-route-5\/)$/,
        },
        {
          name: 'disabled dummy6',
          paths: /^(\/some-route-6\/)$/,
          disabled: true,
        },
        {
          name: 'dummy6',
          paths: /^(\/some-route-6\/)$/,
        },
        {
          name: 'dummy7',
          paths: /^(\/unique-route\/)$/,
          expiresAt: '2019-11-11',
        },
        {
          name: 'dummy8',
          paths: /^(\/unique-route-2\/)$/,
          startsAt: '2022-11-11',
        },
        {
          name: 'dummy9',
          paths: /^(\/unique-route-3\/)$/,
          startsAt: '2019-11-11',
          expiresAt: '2022-11-11',
        },
      ],
    };
  });

  it('returns undefined when there is no announcement', () => {
    const emptyConfig = {
      announcements: [],
    };

    let result = selectors.selectAnnouncement(state, emptyConfig, '/dummy');
    expect(result).toBeUndefined();

    result = selectors.selectAnnouncement(state, config, '/not-a-match');
    expect(result).toBeUndefined();
  });

  it('selects an announcement based on path and configuration', () => {
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/some-route-3/',
    );
    expect(result.name).toBe('dummy3');
  });

  it('returns undefined when a matched annoucement has been dismissed', () => {
    state.announcements.dismissed.push('dummy3');
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/some-route-3/',
    );
    expect(result).toBeUndefined();
  });

  it('returns the next matched announcement when the first matched annoucement has been dismissed', () => {
    state.announcements.dismissed.push('dummy3');

    config.announcements.push({
      name: 'dummy3-conflict',
      paths: /^(\/some-route-3\/)$/,
    });

    const result = selectors.selectAnnouncement(
      state,
      config,
      '/some-route-3/',
    );
    expect(result.name).toBe('dummy3-conflict');
  });

  it('bypasses disabled announcements and looks instead for the next match', () => {
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/some-route-6/',
    );
    expect(result.name).toBe('dummy6');
  });

  it('filters our expired announcements', () => {
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/unique-route/',
    );

    expect(result).toBeUndefined();
  });

  it('filters announcements that have not started yet', () => {
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/unique-route-2/',
    );

    expect(result).toBeUndefined();
  });

  it('includes announcements where `startsAt` <= now <= `expiresAt`', () => {
    const result = selectors.selectAnnouncement(
      state,
      config,
      '/unique-route-3/',
    );

    expect(result).toBeDefined();
  });
});

import * as actions from '../../actions';
import reducer from '../../reducers';

const accounts = [
  {
    id: 'fake-id',
    type: 'connected_accounts',
    attributes: {
      title: 'Something Totally Made Up',
    },
  },
];

const errors = [{ status: 404 }];

const loadedState = {
  accounts,
  loading: false,
  errors: [],
};

describe('connectedAccounts', () => {
  it('receives a loading accounts type', () => {
    const state = reducer.connectedAccounts(null, {
      type: actions.LOADING_CONNECTED_ACCOUNTS,
    });
    expect(state.loading).toBe(true);
  });

  it('receives a finished accounts state', () => {
    const state = reducer.connectedAccounts(null, {
      type: actions.FINISHED_CONNECTED_ACCOUNTS,
      data: accounts,
    });
    expect(state.loading).toBe(false);
    expect(state.accounts[0].id).toBe('fake-id');
  });

  it('receives a errors accounts state', () => {
    const state = reducer.connectedAccounts(null, {
      type: actions.ERROR_CONNECTED_ACCOUNTS,
      errors,
    });
    expect(state.loading).toBe(false);
    expect(state.errors[0].status).toBe(404);
  });

  it('receives a deleting account state', () => {
    const state = reducer.connectedAccounts(loadedState, {
      type: actions.DELETING_CONNECTED_ACCOUNT,
      accountId: 'fake-id',
    });
    expect(state.accounts[0].deleting).toBe(true);
  });

  it('receives a finished deleting account state', () => {
    const state = reducer.connectedAccounts(loadedState, {
      type: actions.FINISHED_DELETING_CONNECTED_ACCOUNT,
      accountId: 'fake-id',
    });
    expect(state.accounts.filter(account => !account.deleted).length).toBe(0);
  });

  it('removes an account after alert dismissed', () => {
    const state = reducer.connectedAccounts(loadedState, {
      type: actions.DELETED_ACCOUNT_ALERT_DISMISSED,
      accountId: 'fake-id',
    });
    expect(state.accounts.length).toBe(0);
  });

  it('receives an error deleting account state', () => {
    const state = reducer.connectedAccounts(loadedState, {
      type: actions.ERROR_DELETING_CONNECTED_ACCOUNT,
      accountId: 'fake-id',
      errors,
    });
    expect(state.accounts[0].errors[0].status).toBe(404);
  });
});

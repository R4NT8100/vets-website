import backendServices from 'platform/user/profile/constants/backendServices';

import {
  TRANSACTION_STATUS,
  TRANSACTION_CATEGORY_TYPES,
  INIT_VET360_ID,
  VET360_INITIALIZATION_STATUS,
} from '../constants';

import * as selectors from '../selectors';

let state = null;

const hooks = {
  beforeEach() {
    const user = {
      profile: {
        services: [backendServices.VET360],
        vet360: {},
      },
    };

    const vet360 = {
      modal: null,
      formFields: {},
      transactions: [],
      fieldTransactionMap: {},
      metadata: {
        mostRecentErroredTransactionId: '',
      },
    };

    state = {
      user,
      vet360,
    };
  },
};

describe('selectors', () => {
  describe('selectIsVet360AvailableForUser', () => {
    beforeEach(hooks.beforeEach);
    it('returns true if vet660 is found in the profile.services list or when the environment is localhost', () => {
      const old = { document: global.document };
      global.document = {
        location: {
          hostname: 'localhost',
        },
      };

      let result = selectors.selectIsVet360AvailableForUser(state);
      // returns true when on localhost so the local mock Vet360 will run
      expect(result).toBe(true);

      global.document.location.hostname = 'staging.vets.gov';
      result = selectors.selectIsVet360AvailableForUser(state);
      // returns true when the environment is not localhost but Vet360 is in the profile services array
      expect(result).toBe(true);

      state.user.profile.services = [];
      result = selectors.selectIsVet360AvailableForUser(state);
      // returns false when the environment is not localhost and Vet360 is not in the services array
      expect(result).toBe(false);

      global.document = old.document;
    });
  });

  describe('selectVet360Field', () => {
    beforeEach(hooks.beforeEach);
    it('looks up a field from the user vet360 data', () => {
      state.user.profile.vet360 = { someField: 'data' };
      expect(selectors.selectVet360Field(state, 'someField')).toBe('data');
    });
  });

  describe('selectVet360Transaction', () => {
    beforeEach(hooks.beforeEach);
    it('accepts a field name to look up a transaction and transaction request using the field-transaction map', () => {
      const fieldName = 'someField';
      const transactionId = 'transaction_1';
      const transaction = {
        data: {
          attributes: {
            transactionId,
          },
        },
      };
      const transactions = [transaction];
      const transactionRequest = { transactionId };
      const fieldTransactionMap = {
        [fieldName]: transactionRequest,
      };

      state.vet360 = { transactions, fieldTransactionMap };

      let result = selectors.selectVet360Transaction(state, fieldName);
      expect(result).toEqual({ transaction, transactionRequest });

      result = selectors.selectVet360Transaction(state, 'someOtherField');
      // returns a null transaction for a field that has no data in the field-transaction map
      expect(result).toEqual({
        transaction: null,
        transactionRequest: null,
      });
    });
  });

  describe('selectVet360FailedTransactions', () => {
    beforeEach(hooks.beforeEach);
    it('returns only failed transactions from a list of transactions', () => {
      const failed = [
        {
          data: {
            attributes: {
              transactionStatus: TRANSACTION_STATUS.COMPLETED_FAILURE,
            },
          },
        },
        {
          data: {
            attributes: { transactionStatus: TRANSACTION_STATUS.REJECTED },
          },
        },
      ];

      state.vet360.transactions = [
        ...failed,
        {
          data: {
            attributes: { transactionStatus: TRANSACTION_STATUS.RECEIVED },
          },
        },
        {
          data: {
            attributes: {
              transactionStatus: TRANSACTION_STATUS.COMPLETED_SUCCESS,
            },
          },
        },
        {
          data: {
            attributes: {
              transactionStatus:
                TRANSACTION_STATUS.COMPLETED_NO_CHANGES_DETECTED,
            },
          },
        },
      ];

      const result = selectors.selectVet360FailedTransactions(state);

      expect(result).toEqual(expect.arrayContaining([failed[0]]));
      expect(result).toEqual(expect.arrayContaining([failed[1]]));
    });
  });

  describe('selectMostRecentErroredTransaction', () => {
    beforeEach(hooks.beforeEach);
    it('selects the transaction of the ID stored in the metadata mostRecentErroredTransactionId', () => {
      const transactionId = 'transaction_id';
      const transaction = { data: { attributes: { transactionId } } };
      state.vet360.transactions = [transaction];
      state.vet360.metadata.mostRecentErroredTransactionId = transactionId;
      expect(selectors.selectMostRecentErroredTransaction(state)).toBe(
        transaction,
      );
    });
  });

  describe('selectVet360PendingCategoryTransactions', () => {
    beforeEach(hooks.beforeEach);
    it('selects transactions of the passed transaction category type that is still pending and without field-level data', () => {
      const type = TRANSACTION_CATEGORY_TYPES.ADDRESS;
      const pendingAddressTransactions = [
        {
          data: {
            attributes: {
              type,
              transactionId: 'transaction_1',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
        {
          data: {
            attributes: {
              type,
              transactionId: 'transaction_2',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
      ];

      const transactions = [
        ...pendingAddressTransactions,
        {
          data: {
            attributes: {
              type: TRANSACTION_CATEGORY_TYPES.EMAIL,
              transactionId: 'transaction_3',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
        {
          data: {
            attributes: {
              type: TRANSACTION_CATEGORY_TYPES.PHONE,
              transactionId: 'transaction_4',
              transactionStatus: TRANSACTION_STATUS.RECEIVED,
            },
          },
        },
        {
          data: {
            attributes: {
              type: TRANSACTION_CATEGORY_TYPES.ADDRESS,
              transactionId: 'transaction_5',
              transactionStatus: TRANSACTION_STATUS.COMPLETED_SUCCESS,
            },
          },
        },
      ];

      state.vet360.transactions = transactions;

      const result = selectors.selectVet360PendingCategoryTransactions(
        state,
        type,
      );

      expect(result).toEqual(
        expect.arrayContaining([pendingAddressTransactions[0]]),
      );
      expect(result).toEqual(
        expect.arrayContaining([pendingAddressTransactions[1]]),
      );
    });
  });

  describe('selectEditedFormField', () => {
    beforeEach(hooks.beforeEach);
    it('looks up the form value in state for a given field name', () => {
      const fieldName = 'someField';
      const fieldValue = 'someFieldValue';
      state.vet360.formFields[fieldName] = fieldValue;

      expect(selectors.selectEditedFormField(state, fieldName)).toBe(
        fieldValue,
      );
    });
  });

  describe('selectCurrentlyOpenEditModal', () => {
    beforeEach(hooks.beforeEach);
    it('looks up the form value in state for a given field name', () => {
      const currentlyOpenModal = 'someField';
      state.vet360.modal = currentlyOpenModal;

      expect(selectors.selectCurrentlyOpenEditModal(state)).toBe(
        currentlyOpenModal,
      );
    });
  });
});

describe('selectVet360InitializationStatus', () => {
  const old = { document: global.document };

  beforeEach(() => {
    hooks.beforeEach();
    global.document = {
      location: {
        hostname: 'staging.vets.gov',
      },
    };
  });

  afterEach(() => {
    global.document = old.document;
  });

  it('returns UNINITIALIZED if Vet360 is not found in the services array and there is not an associated transaction', () => {
    state.user.profile.services = [];
    const result = selectors.selectVet360InitializationStatus(state);
    expect(result.status).toBe(VET360_INITIALIZATION_STATUS.UNINITALIZED);
  });

  it('returns INITIALIZED if Vet360 is found in the services array', () => {
    const result = selectors.selectVet360InitializationStatus(state);
    expect(result.status).toBe(VET360_INITIALIZATION_STATUS.INITIALIZED);
  });

  it('returns INITIALIZING if there is an ongoing transaction', () => {
    const transactionId = 'transaction_1';
    state.user.profile.services = [];
    state.vet360.transactions = [
      {
        data: {
          attributes: {
            transactionId,
            transactionStatus: TRANSACTION_STATUS.RECEIVED,
          },
        },
      },
    ];
    state.vet360.fieldTransactionMap[INIT_VET360_ID] = { transactionId };
    const result = selectors.selectVet360InitializationStatus(state);
    expect(result.status).toBe(VET360_INITIALIZATION_STATUS.INITIALIZING);
  });

  it('returns INITIALIZATION_FAILURE if there is a failed transaction', () => {
    const transactionId = 'transaction_1';
    state.user.profile.services = [];
    state.vet360.transactions = [
      {
        data: {
          attributes: {
            transactionId,
            transactionStatus: TRANSACTION_STATUS.REJECTED,
          },
        },
      },
    ];
    state.vet360.fieldTransactionMap[INIT_VET360_ID] = { transactionId };
    const result = selectors.selectVet360InitializationStatus(state);
    expect(result.status).toBe(
      VET360_INITIALIZATION_STATUS.INITIALIZATION_FAILURE,
    );
  });
});

describe('vaProfileUseAddressValidation', () => {
  it('returns `true` if the feature flag is set', () => {
    expect(
      selectors.vaProfileUseAddressValidation({
        featureToggles: {
          vaProfileAddressValidation: true,
        },
      }),
    ).toBe(true);
  });
  it('returns `undefined` if the feature flag is not set', () => {
    expect(
      selectors.vaProfileUseAddressValidation({
        featureToggles: {
          anotherFeatureFlag: true,
        },
      }),
    ).toBeUndefined();
  });
});

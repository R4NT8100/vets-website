import {
  createDirectDepositAnalyticsDataObject,
  hasAccountFlaggedError,
  hasRoutingNumberFlaggedError,
  hasInvalidHomePhoneNumberError,
} from '../../util';

describe('profile utils', () => {
  describe('createEventDataObjectWithErrors', () => {
    const createEventDataObjectWithError = error => ({
      event: 'profile-edit-failure',
      'profile-action': 'save-failure',
      'profile-section': 'direct-deposit-information',
      'error-key': error,
    });
    const defaultDataObject = createEventDataObjectWithError(
      'other-error-update',
    );
    const badAddressDataObject = createEventDataObjectWithError(
      'mailing-address-error-update',
    );
    const badHomePhoneDataObject = createEventDataObjectWithError(
      'home-phone-error-update',
    );
    const badWorkPhoneDataObject = createEventDataObjectWithError(
      'work-phone-error-update',
    );
    const accountFlaggedForFraudDataObject = createEventDataObjectWithError(
      'account-flagged-for-fraud-error-update',
    );
    const routingNumberFlaggedForFraudDataObject = createEventDataObjectWithError(
      'routing-number-flagged-for-fraud-error-update',
    );
    const invalidRoutingNumberDataObject = createEventDataObjectWithError(
      'invalid-routing-number-error-update',
    );
    const paymentRestrictionIndicatorsDataObject = createEventDataObjectWithError(
      'payment-restriction-indicators-error-update',
    );
    it('returns the correct data when passed nothing', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject();
      expect(eventDataObject).toEqual(defaultDataObject);
    });
    it('returns the correct data when passed an empty array', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([]);
      expect(eventDataObject).toEqual(defaultDataObject);
    });
    it('returns the correct data when a bad address error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'cnp.payment.generic.error.message',
                severity: 'ERROR',
                text:
                  'Generic CnP payment update error. Update response: Update Failed: Required field not entered for mailing address update',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).toEqual(badAddressDataObject);
    });
    it('returns the correct data when a work phone number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'cnp.payment.generic.error.message',
                severity: 'ERROR',
                text:
                  'Generic CnP payment update error. Update response: Update Failed: Day phone number is invalid, must be 7 digits',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).toEqual(badWorkPhoneDataObject);
    });
    it('returns the correct data when a day phone number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'cnp.payment.generic.error.message',
                severity: 'ERROR',
                text:
                  'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).toEqual(badHomePhoneDataObject);
    });
    it('returns the correct data when a routing number flagged for fraud error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          code: '135',
          detail: 'Routing number related to potential fraud',
          meta: {
            messages: [
              {
                key: 'cnp.payment.routing.number.fraud.message',
                severity: 'ERROR',
                text: 'Routing number related to potential fraud',
              },
            ],
          },
          source: 'EVSS::PPIU::Service',
          status: '422',
          title: 'Potential Fraud',
        },
      ]);
      expect(eventDataObject).toEqual(routingNumberFlaggedForFraudDataObject);
    });
    it('returns the correct data when an account flagged for fraud error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          code: '136',
          detail: 'The account has been flagged',
          meta: {
            messages: [
              {
                key: 'cnp.payment.flashes.on.record.message',
                severity: 'ERROR',
                text: 'Flashes on record',
              },
            ],
          },
          source: 'EVSS::PPIU::Service',
          status: '422',
          title: 'Account Flagged',
        },
      ]);
      expect(eventDataObject).toEqual(accountFlaggedForFraudDataObject);
    });
    it('returns the correct data when an invalid routing number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'payment.accountRoutingNumber.invalidCheckSum',
                severity: 'ERROR',
                text: '',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).toEqual(invalidRoutingNumberDataObject);
    });
    it('returns the correct data when an invalid routing number error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'cnp.payment.generic.error.message',
                severity: 'ERROR',
                text: 'Invalid Routing Number',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).toEqual(invalidRoutingNumberDataObject);
    });
    it('returns the correct data when a payment restriction indicators error is passed', () => {
      const eventDataObject = createDirectDepositAnalyticsDataObject([
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'payment.restriction.indicators.present',
                severity: 'ERROR',
                text: '',
              },
            ],
          },
        },
      ]);
      expect(eventDataObject).toEqual(paymentRestrictionIndicatorsDataObject);
    });
  });

  describe('PaymentInformation error parsing methods', () => {
    it('hasRoutingNumberFlaggedError returns true on error', () => {
      const errors = [
        {
          code: '135',
          detail: 'Routing number related to potential fraud',
          meta: {
            messages: [
              {
                key: 'cnp.payment.routing.number.fraud.message',
                severity: 'ERROR',
                text: 'Routing number related to potential fraud',
              },
            ],
          },
          source: 'EVSS::PPIU::Service',
          status: '422',
          title: 'Potential Fraud',
        },
      ];
      expect(hasRoutingNumberFlaggedError(errors)).toBe(true);
    });

    it('hasAccountFlaggedError returns true on error', () => {
      const errors = [
        {
          title: 'Account Flagged',
          detail: 'The account has been flagged',
          code: '136',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'cnp.payment.flashes.on.record.message',
                severity: 'ERROR',
                text: 'Flashes on record',
              },
            ],
          },
        },
      ];
      expect(hasAccountFlaggedError(errors)).toBe(true);
    });

    it('hasInvalidHomePhoneNumberError returns false if text does not contain night phone', () => {
      const errors = [
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'cnp.payment.generic.error.message',
                severity: 'ERROR',
                text:
                  'Generic CnP payment update error. Update response: Update Failed: Some other random error',
              },
            ],
          },
        },
      ];
      expect(hasInvalidHomePhoneNumberError(errors)).toBe(false);
    });

    it('should return false with multiple errors with text not matching desired error conditions', () => {
      const errors = [
        {
          title: 'Unprocessable Entity',
          detail: 'One or more unprocessable user payment properties',
          code: '126',
          source: 'EVSS::PPIU::Service',
          status: '422',
          meta: {
            messages: [
              {
                key: 'cnp.payment.generic.error.message',
                severity: 'ERROR',
                text: "some error we don't know about",
              },
              {
                key: 'unknown.key',
                severity: 'ERROR',
                text:
                  'Generic CnP payment update error. Update response: Update Failed: Night area number is invalid, must be 3 digits',
              },
            ],
          },
        },
      ];
      expect(hasInvalidHomePhoneNumberError(errors)).toBe(false);
    });
  });
});

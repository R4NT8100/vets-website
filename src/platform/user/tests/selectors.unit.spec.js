import * as selectors from '../selectors';

describe('user selectors', () => {
  describe('selectVet360', () => {
    it('pulls out the state.profile.vet360 data', () => {
      const state = {
        user: {
          profile: {
            vet360: {
              email: {
                emailAddress: '123@va.com',
              },
            },
          },
        },
      };
      expect(selectors.selectVet360(state)).toEqual(state.user.profile.vet360);
    });
    it('returns undefined if there is no vet360 on the profile', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectVet360(state)).toBeUndefined();
    });
  });

  describe('selectVet360EmailAddress', () => {
    it('pulls out the state.profile.vet360.emailAddress', () => {
      const state = {
        user: {
          profile: {
            vet360: {
              email: {
                createdAt: '2019-10-11T12:42:14.000Z',
                emailAddress: 'testertester2@mail.com',
                effectiveEndDate: null,
                effectiveStartDate: '2019-10-11T12:41:06.000Z',
                id: 70619,
                sourceDate: '2019-10-11T12:41:06.000Z',
                sourceSystemUser: null,
                transactionId: '5fda71d0-7e4c-468c-aee7-21c16405ca1f',
                updatedAt: '2019-10-11T12:42:14.000Z',
                vet360Id: '139281',
              },
            },
          },
        },
      };
      expect(selectors.selectVet360EmailAddress(state)).toBe(
        state.user.profile.vet360.email.emailAddress,
      );
    });
    it('returns undefined if there is no vet360 on the profile', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectVet360EmailAddress(state)).toBeUndefined();
    });
    it('returns undefined if there is no email', () => {
      const state = {
        user: {
          profile: {
            vet360: {},
          },
        },
      };
      expect(selectors.selectVet360EmailAddress(state)).toBeUndefined();
    });
  });

  describe('phone number selectors', () => {
    const phoneNumberData = {
      areaCode: '415',
      countryCode: '1',
      createdAt: '2019-10-22T13:39:19.000Z',
      extension: null,
      effectiveEndDate: null,
      effectiveStartDate: '2019-10-22T13:41:02.000Z',
      id: 82709,
      isInternational: false,
      isTextable: null,
      isTextPermitted: null,
      isTty: null,
      isVoicemailable: null,
      phoneNumber: '8453210',
      phoneType: 'MOBILE',
      sourceDate: '2019-10-22T13:41:02.000Z',
      sourceSystemUser: null,
      transactionId: '5d83b4cd-da19-42fd-8c90-40382c4b61cb',
      updatedAt: '2019-10-22T13:41:03.000Z',
      vet360Id: '139281',
    };

    describe('selectVet360MobilePhone', () => {
      it('pulls out the state.profile.vet360.mobilePhone data object', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhone(state)).toEqual(
          state.user.profile.vet360.mobilePhone,
        );
      });
      it('returns undefined if there is no vet360 on the profile', () => {
        const state = {
          user: {
            profile: {},
          },
        };
        expect(selectors.selectVet360MobilePhone(state)).toBeUndefined();
      });
      it('returns undefined if there is no mobile phone', () => {
        const state = {
          user: {
            profile: {
              vet360: {},
            },
          },
        };
        expect(selectors.selectVet360MobilePhone(state)).toBeUndefined();
      });
    });

    describe('selectVet360MobilePhoneString', () => {
      it('pulls out the mobile phone number as a single string if it exists', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhoneString(state)).toBe(
          '4158453210',
        );
      });
      it('properly handles phone numbers with an extension', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: { ...phoneNumberData, extension: '1234' },
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhoneString(state)).toBe(
          '4158453210x1234',
        );
      });
      it('properly handles phone numbers with an extension of "0000"', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                mobilePhone: { ...phoneNumberData, extension: '0000' },
              },
            },
          },
        };
        expect(selectors.selectVet360MobilePhoneString(state)).toBe(
          '4158453210',
        );
      });
    });

    describe('selectVet360HomePhone', () => {
      it('pulls out the state.profile.vet360.homePhone data object', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                homePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360HomePhone(state)).toEqual(
          state.user.profile.vet360.homePhone,
        );
      });
      it('returns undefined if there is no vet360 on the profile', () => {
        const state = {
          user: {
            profile: {},
          },
        };
        expect(selectors.selectVet360HomePhone(state)).toBeUndefined();
      });
      it('returns undefined if there is no mobile phone', () => {
        const state = {
          user: {
            profile: {
              vet360: {},
            },
          },
        };
        expect(selectors.selectVet360HomePhone(state)).toBeUndefined();
      });
    });

    describe('selectVet360HomePhoneString', () => {
      it('pulls out the home phone number as a single string if it exists', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                homePhone: phoneNumberData,
              },
            },
          },
        };
        expect(selectors.selectVet360HomePhoneString(state)).toBe('4158453210');
      });
      it('properly handles phone numbers with an extension', () => {
        const state = {
          user: {
            profile: {
              vet360: {
                homePhone: { ...phoneNumberData, extension: '1234' },
              },
            },
          },
        };
        expect(selectors.selectVet360HomePhoneString(state)).toBe(
          '4158453210x1234',
        );
      });
    });
  });

  describe('selectPatientFacilities', () => {
    it('pulls out the state.profile.facilities array', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '983', isCerner: false },
              { facilityId: '984', isCerner: false },
            ],
          },
        },
      };
      expect(selectors.selectPatientFacilities(state)).toEqual(
        state.user.profile.facilities,
      );
    });
    it('returns undefined if there is no facilities on the profile', () => {
      const state = {
        user: {
          profile: {},
        },
      };
      expect(selectors.selectPatientFacilities(state)).toBeNull();
    });
  });
  describe('selectIsCernerOnlyPatient', () => {
    it('should return true if Cerner only', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
      };
      expect(selectors.selectIsCernerOnlyPatient(state)).toBe(true);
    });
    it('should return false if not Cerner only', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: true },
              { facilityId: '124', isCerner: false },
            ],
          },
        },
      };
      expect(selectors.selectIsCernerOnlyPatient(state)).toBe(false);
    });
  });
  describe('selectIsCernerPatient', () => {
    it('should return true if single cerner response', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '123', isCerner: true }],
          },
        },
      };
      expect(selectors.selectIsCernerPatient(state)).toBe(true);
    });
    it('should return true if atleast 1 cerner facility', () => {
      const state = {
        user: {
          profile: {
            facilities: [
              { facilityId: '123', isCerner: true },
              { facilityId: '124', isCerner: false },
            ],
          },
        },
      };
      expect(selectors.selectIsCernerPatient(state)).toBe(true);
    });
    it('should return false if no cerner facilities', () => {
      const state = {
        user: {
          profile: {
            facilities: [{ facilityId: '124', isCerner: false }],
          },
        },
      };
      expect(selectors.selectIsCernerPatient(state)).toBe(false);
    });
  });
});

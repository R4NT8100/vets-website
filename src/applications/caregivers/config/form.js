import ConfirmationPage from 'applications/caregivers/containers/ConfirmationPage';
import environment from 'platform/utilities/environment';
import fullSchema from 'vets-json-schema/dist/10-10CG-schema.json';
import IntroductionPage from 'applications/caregivers/containers/IntroductionPage';
import NeedHelpFooter from 'applications/caregivers/components/NeedHelpFooter';
import PreSubmitInfo from 'applications/caregivers/components/PreSubmitInfo';
import SubmitError from 'applications/caregivers/components/SubmitError';
import FormFooter from 'platform/forms/components/FormFooter';
import { VA_FORM_IDS } from 'platform/forms/constants';
import { externalServices } from 'platform/monitoring/DowntimeNotification';

import {
  submitTransform,
  hasSecondaryCaregiverOne,
  hasSecondaryCaregiverTwo,
} from 'applications/caregivers/helpers';
import definitions, {
  addressWithoutCountryUI,
} from 'applications/caregivers/definitions/caregiverUI';
import {
  vetInfoPage,
  vetContactInfoPage,
  vetMedicalCenterPage,
  primaryInfoPage,
  primaryContactInfoPage,
  primaryMedicalPage,
  hasSecondaryCaregiverPage,
  secondaryCaregiverInfoPage,
  secondaryCaregiverContactPage,
  secondaryTwoInfoPage,
  secondaryTwoContactPage,
} from './pages';

import manifest from '../manifest.json';

const {
  address,
  date,
  email,
  phone,
  gender,
  vetRelationship,
  ssn,
  fullName,
} = fullSchema.definitions;

const { contactInfoTitle } = definitions.sharedItems;
const { secondaryCaregiversUI } = definitions;

/* Chapters
 * 1 - Vet/Service Member (required)
 * 2 - Primary Family Caregiver (required)
 * 3 - Secondary & secondaryTwo Family Caregiver (optional -- up to 2 conditionally)
 */
const formConfig = {
  rootUrl: manifest.rootUrl,
  urlPrefix: '/',
  submitUrl: `${environment.API_URL}/v0/caregivers_assistance_claims`,
  transformForSubmit: submitTransform,
  trackingPrefix: 'caregivers-10-10cg-',
  introduction: IntroductionPage,
  footerContent: FormFooter,
  getHelp: NeedHelpFooter,
  preSubmitInfo: PreSubmitInfo,
  confirmation: ConfirmationPage,
  submissionError: SubmitError,
  formId: VA_FORM_IDS.FORM_10_10CG,
  saveInProgress: {
    // messages: {
    //   inProgress: 'Your [savedFormDescription] is in progress.',
    //   expired: 'Your saved [savedFormDescription] has expired. If you want to apply for [benefitType], please start a new [appType].',
    //   saved: 'Your [benefitType] [appType] has been saved.',
    // },
  },
  version: 0,
  prefillEnabled: false,
  downtime: {
    dependencies: [externalServices.mvi, externalServices.carma],
  },
  title:
    'Apply for the Program of Comprehensive Assistance for Family Caregivers',
  subTitle: 'Form 10-10CG',
  defaultDefinitions: {
    address,
    addressWithoutCountryUI,
    date,
    email,
    fullName,
    gender,
    phone,
    ssn,
    vetRelationship,
  },
  chapters: {
    veteranChapter: {
      title: 'Veteran information',
      pages: {
        veteranInfoOne: {
          path: 'vet-1',
          title: 'Veteran information',
          uiSchema: vetInfoPage.uiSchema,
          schema: vetInfoPage.schema,
        },
        veteranInfoTwo: {
          path: 'vet-2',
          title: contactInfoTitle,
          uiSchema: vetContactInfoPage.uiSchema,
          schema: vetContactInfoPage.schema,
        },
        veteranInfoThree: {
          path: 'vet-3',
          title: 'VA medical center',
          uiSchema: vetMedicalCenterPage.uiSchema,
          schema: vetMedicalCenterPage.schema,
        },
      },
    },
    primaryCaregiverChapter: {
      title: 'Primary Family Caregiver applicant information',
      pages: {
        primaryCaregiverInfoOne: {
          path: 'primary-1',
          title: 'Primary Family Caregiver information',
          uiSchema: primaryInfoPage.uiSchema,
          schema: primaryInfoPage.schema,
        },
        primaryCaregiverInfoTwo: {
          path: 'primary-2',
          title: contactInfoTitle,
          uiSchema: primaryContactInfoPage.uiSchema,
          schema: primaryContactInfoPage.schema,
        },
        primaryCaregiverInfoThree: {
          path: 'primary-3',
          title: 'Health care coverage',
          uiSchema: primaryMedicalPage.uiSchema,
          schema: primaryMedicalPage.schema,
        },
      },
    },
    secondaryCaregiversChapter: {
      title: 'Secondary Family Caregiver applicant information',
      depends: formData => hasSecondaryCaregiverOne(formData),
      pages: {
        secondaryCaregiverOneIntro: {
          path: 'secondary-one-1',
          title: 'Secondary Family Caregiver information',
          uiSchema: hasSecondaryCaregiverPage.uiSchema,
          schema: hasSecondaryCaregiverPage.schema,
        },
        secondaryCaregiverOne: {
          path: 'secondary-one-2',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: secondaryCaregiverInfoPage.uiSchema,
          schema: secondaryCaregiverInfoPage.schema,
        },
        secondaryCaregiverOneThree: {
          path: 'secondary-one-3',
          title: 'Secondary Family Caregiver information',
          depends: formData => hasSecondaryCaregiverOne(formData),
          uiSchema: secondaryCaregiverContactPage.uiSchema,
          schema: secondaryCaregiverContactPage.schema,
        },
      },
    },
    secondaryCaregiversTwoChapter: {
      title: secondaryCaregiversUI.secondaryTwoChapterTitle,
      depends: formData => hasSecondaryCaregiverTwo(formData),
      pages: {
        secondaryCaregiverTwo: {
          path: 'secondary-two-1',
          title: 'Secondary Family Caregiver (2) applicant information',
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: secondaryTwoInfoPage.uiSchema,
          schema: secondaryTwoInfoPage.schema,
        },
        secondaryCaregiverTwoTwo: {
          path: 'secondary-two-2',
          title: secondaryCaregiversUI.secondaryTwoChapterTitle,
          depends: formData => hasSecondaryCaregiverTwo(formData),
          uiSchema: secondaryTwoContactPage.uiSchema,
          schema: secondaryTwoContactPage.schema,
        },
      },
    },
  },
};

export default formConfig;

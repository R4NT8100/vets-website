import React from 'react';
import { expect } from 'chai';
import moment from 'moment';
import { fireEvent } from '@testing-library/react';
import environment from 'platform/utilities/environment';
import { setFetchJSONResponse } from 'platform/testing/unit/helpers';
import {
  getVARequestMock,
  getVAFacilityMock,
  getMessageMock,
} from '../../mocks/v0';
import { mockAppointmentInfo, mockFacilitiesFetch } from '../../mocks/helpers';
import { renderWithStoreAndRouter } from '../../mocks/setup';

import FutureAppointmentsList from '../../../appointment-list/components/FutureAppointmentsList';

const initialState = {
  featureToggles: {
    vaOnlineSchedulingCancel: true,
  },
};

describe('VAOS integration: pending appointments', () => {
  describe('for va', () => {
    it('should show information with basic facility info', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        appointmentType: 'Primary care',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        optionDate2: moment()
          .add(4, 'days')
          .format('MM/DD/YYYY'),
        optionTime2: 'AM',
        optionDate3: moment()
          .add(5, 'days')
          .format('MM/DD/YYYY'),
        optionTime3: 'PM',
        facility: {
          ...appointment.facility,
          facilityCode: '983GC',
        },
        friendlyLocationName: 'Some facility name',
      };
      mockAppointmentInfo({ requests: [appointment] });

      const {
        findByText,
        baseElement,
        getByText,
        queryByText,
      } = renderWithStoreAndRouter(<FutureAppointmentsList />, {
        initialState,
      });

      const dateHeader = await findByText(/primary care appointment/i);
      expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

      expect(baseElement).to.contain.text('VA Appointment');
      expect(baseElement).to.contain.text('Pending');
      expect(baseElement).to.contain('.fa-exclamation-triangle');
      expect(dateHeader).to.have.tagName('h3');

      expect(getByText(/view facility information/i)).to.have.attribute(
        'href',
        '/find-locations/facility/vha_442GC',
      );
      expect(baseElement).to.contain.text('Preferred date and time');
      expect(baseElement).to.contain.text(
        `${moment()
          .add(3, 'days')
          .format('ddd, MMMM D, YYYY')} in the morning`,
      );
      expect(baseElement).to.contain.text(
        `${moment()
          .add(4, 'days')
          .format('ddd, MMMM D, YYYY')} in the morning`,
      );
      expect(baseElement).to.contain.text(
        `${moment()
          .add(5, 'days')
          .format('ddd, MMMM D, YYYY')} in the afternoon`,
      );

      expect(baseElement).not.to.contain.text('Add to calendar');
      expect(getByText(/cancel request/i)).to.have.tagName('button');
    });

    it('should show information with full facility info', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        appointmentType: 'Primary care',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        facility: {
          ...appointment.facility,
          facilityCode: '983GC',
        },
        friendlyLocationName: 'Some facility name',
      };
      mockAppointmentInfo({ requests: [appointment] });
      const facility = {
        id: 'vha_442GC',
        attributes: {
          ...getVAFacilityMock().attributes,
          uniqueId: '442GC',
          name: 'Cheyenne VA Medical Center',
          address: {
            physical: {
              zip: '82001-5356',
              city: 'Cheyenne',
              state: 'WY',
              address1: '2360 East Pershing Boulevard',
            },
          },
          phone: {
            main: '307-778-7550',
          },
        },
      };
      mockFacilitiesFetch('vha_442GC', [facility]);

      const { findByText, baseElement, queryByText } = renderWithStoreAndRouter(
        <FutureAppointmentsList />,
        {
          initialState,
        },
      );

      await findByText(/east pershing/i);
      expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

      expect(baseElement).to.contain.text('VA Appointment');
      expect(baseElement).to.contain.text('Pending');
      expect(baseElement).to.contain('.fa-exclamation-triangle');

      expect(queryByText(/view facility information/i)).not.to.exist;
      expect(queryByText(/directions/i)).to.have.attribute(
        'href',
        'https://maps.google.com?saddr=Current+Location&daddr=2360 East Pershing Boulevard, Cheyenne, WY 82001-5356',
      );
      expect(baseElement).to.contain.text('Cheyenne VA Medical Center');
      expect(baseElement).to.contain.text('2360 East Pershing Boulevard');
      expect(baseElement).to.contain.text('Cheyenne, WY 82001-5356');
      expect(baseElement).to.contain.text('307-778-7550');
    });

    it('should show correct status for cancelled appointments', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Cancelled',
        appointmentType: 'Primary care',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        facility: {
          ...appointment.facility,
          facilityCode: '983GC',
        },
        friendlyLocationName: 'Some facility name',
      };
      mockAppointmentInfo({ requests: [appointment] });

      const { findByText, baseElement, queryByText } = renderWithStoreAndRouter(
        <FutureAppointmentsList />,
        {
          initialState,
        },
      );

      const dateHeader = await findByText(/primary care appointment/i);
      expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

      expect(baseElement).to.contain.text('VA Appointment');
      expect(baseElement).to.contain.text('Canceled');
      expect(baseElement).to.contain('.fa-exclamation-circle');
      expect(dateHeader).to.have.tagName('h3');

      expect(queryByText(/cancel appointment/i)).not.to.exist;
    });

    it('should not show cancelled appointments without a future date option', () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Cancelled',
        appointmentType: 'Primary care',
        optionDate1: moment()
          .add(-3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        facility: {
          ...appointment.facility,
          facilityCode: '983GC',
        },
        friendlyLocationName: 'Some facility name',
      };
      mockAppointmentInfo({ requests: [appointment] });

      const { findByText } = renderWithStoreAndRouter(
        <FutureAppointmentsList />,
        {
          initialState,
        },
      );

      return expect(findByText(/You don’t have any appointments/i)).to
        .eventually.be.ok;
    });

    it('should not show resolved appointments', () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Resolved',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
      };
      mockAppointmentInfo({ requests: [appointment] });

      const { findByText } = renderWithStoreAndRouter(
        <FutureAppointmentsList />,
        {
          initialState,
        },
      );

      return expect(findByText(/You don’t have any appointments/i)).to
        .eventually.be.ok;
    });

    it('should show additional reason and contact information', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        purposeOfVisit: 'New Issue',
        bestTimetoCall: ['Morning'],
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });
      const message = getMessageMock();
      message.attributes = {
        ...message.attributes,
        messageText: 'A message from the patient',
      };
      setFetchJSONResponse(
        global.fetch.withArgs(
          `${environment.API_URL}/vaos/v0/appointment_requests/1234/messages`,
        ),
        { data: [message] },
      );

      const { baseElement, findByText } = renderWithStoreAndRouter(
        <FutureAppointmentsList />,
        {
          initialState,
        },
      );

      const showMoreButton = await findByText(/show more/i);
      expect(baseElement).not.to.contain.text('New issue');

      fireEvent.click(showMoreButton);
      await findByText(/a message from the patient/i);

      expect(baseElement).to.contain.text('Call morning');
      expect(baseElement).to.contain.text('New issue');
      expect(baseElement).to.contain.text('Your contact details');
      expect(baseElement).to.contain.text('patient.test@va.gov');
      expect(baseElement).to.contain.text('5555555566');
    });

    it('should show video request', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        appointmentType: 'Primary care',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        optionDate2: moment()
          .add(4, 'days')
          .format('MM/DD/YYYY'),
        optionTime2: 'AM',
        optionDate3: moment()
          .add(5, 'days')
          .format('MM/DD/YYYY'),
        optionTime3: 'PM',
        visitType: 'Video Conference',
        facility: {
          ...appointment.facility,
          facilityCode: '983GC',
        },
        friendlyLocationName: 'Some facility name',
      };
      mockAppointmentInfo({ requests: [appointment] });

      const {
        findByText,
        baseElement,
        getByText,
        queryByText,
      } = renderWithStoreAndRouter(<FutureAppointmentsList />, {
        initialState,
      });

      const dateHeader = await findByText(/primary care appointment/i);
      expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

      expect(baseElement).to.contain.text('VA Video Connect');
      expect(baseElement).to.contain.text('Pending');
      expect(baseElement).to.contain('.fa-exclamation-triangle');
      expect(dateHeader).to.have.tagName('h3');

      expect(getByText(/view facility information/i)).to.have.attribute(
        'href',
        '/find-locations/facility/vha_442GC',
      );
      expect(baseElement).to.contain.text('Preferred date and time');
      expect(baseElement).to.contain.text(
        `${moment()
          .add(3, 'days')
          .format('ddd, MMMM D, YYYY')} in the morning`,
      );

      expect(baseElement).not.to.contain.text('Add to calendar');
      expect(getByText(/cancel request/i)).to.have.tagName('button');
    });
  });

  describe('for community care', () => {
    it('should show provider info', async () => {
      const appointment = getVARequestMock();
      appointment.attributes = {
        ...appointment.attributes,
        status: 'Submitted',
        appointmentType: 'Primary care',
        optionDate1: moment()
          .add(3, 'days')
          .format('MM/DD/YYYY'),
        optionTime1: 'AM',
        typeOfCareId: 'CCAUDHEAR',
        bestTimetoCall: ['Morning'],
        email: 'patient.test@va.gov',
        phoneNumber: '5555555566',
        ccAppointmentRequest: {
          preferredProviders: [
            {
              firstName: 'Jane',
              lastName: 'Doe',
              practiceName: 'My drs office',
              address: {
                zipCode: '01060',
              },
              providerZipCode: '01060',
            },
          ],
        },
      };
      appointment.id = '1234';
      mockAppointmentInfo({ requests: [appointment] });
      const message = getMessageMock();
      message.attributes = {
        ...message.attributes,
        messageText: 'A message from the patient',
      };
      setFetchJSONResponse(
        global.fetch.withArgs(
          `${environment.API_URL}/vaos/v0/appointment_requests/1234/messages`,
        ),
        { data: [message] },
      );

      const {
        findByText,
        baseElement,
        getByText,
        queryByText,
      } = renderWithStoreAndRouter(<FutureAppointmentsList />, {
        initialState,
      });

      const dateHeader = await findByText(/primary care appointment/i);
      expect(queryByText(/You don’t have any appointments/i)).not.to.exist;

      expect(baseElement).to.contain.text('Community Care');
      expect(baseElement).to.contain.text('Pending');
      expect(baseElement).to.contain('.fa-exclamation-triangle');
      expect(dateHeader).to.have.tagName('h3');

      expect(baseElement).to.contain.text('Preferred provider');
      expect(baseElement).to.contain.text('My drs office');
      expect(baseElement).to.contain.text('Jane Doe');
      expect(baseElement).to.contain.text(
        `${moment()
          .add(3, 'days')
          .format('ddd, MMMM D, YYYY')} in the morning`,
      );
      expect(getByText(/cancel request/i)).to.have.tagName('button');
      fireEvent.click(await findByText(/show more/i));
      await findByText(/a message from the patient/i);
      expect(baseElement).to.contain.text('Call morning');
      expect(baseElement).to.contain.text('Your contact details');
      expect(baseElement).to.contain.text('patient.test@va.gov');
      expect(baseElement).to.contain.text('5555555566');
    });
  });
});

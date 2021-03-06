import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount } from 'enzyme';
import moment from 'moment';
import PastAppointmentsDateDropdown from '../../../../appointment-list/components/PastAppointmentsList/PastAppointmentsDateDropdown';
import { getPastAppointmentDateRangeOptions } from '../../../../appointment-list/components/PastAppointmentsList';

const dateRanges = getPastAppointmentDateRangeOptions(moment('2020-02-02'));

describe('VAOS <PastAppointmentsDateDropdown/>', () => {
  it('should render options', () => {
    const onChange = sinon.spy();

    const tree = mount(
      <PastAppointmentsDateDropdown
        onChange={onChange}
        options={dateRanges}
        currentRange={0}
      />,
    );

    const label = tree.find('label');
    expect(label.props().htmlFor).to.equal('options');
    const options = tree.find('option');
    expect(tree.find('select').exists()).to.be.true;
    expect(options.length).to.equal(6);
    tree.unmount();
  });

  it('should call onChange event', () => {
    const onChange = sinon.spy();

    const tree = mount(
      <PastAppointmentsDateDropdown
        onChange={onChange}
        options={dateRanges}
        currentRange={0}
      />,
    );

    tree.find('select').simulate('change', { target: { value: 1 } });
    tree.find('button').simulate('click');
    expect(onChange.called).to.be.true;
    tree.unmount();
  });

  it('should NOT call onChange event when date range has not changed', () => {
    const onChange = sinon.spy();

    const tree = mount(
      <PastAppointmentsDateDropdown
        onChange={onChange}
        options={dateRanges}
        currentRange={1}
      />,
    );

    tree.find('select').simulate('change', { target: { value: 1 } });
    tree.find('button').simulate('click');
    expect(onChange.called).to.be.false;
    tree.unmount();
  });
});

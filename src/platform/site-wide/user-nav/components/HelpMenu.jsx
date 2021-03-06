import PropTypes from 'prop-types';
import React from 'react';

import DropDownPanel from '@department-of-veterans-affairs/formation-react/DropDownPanel';
import IconHelp from '@department-of-veterans-affairs/formation-react/IconHelp';
import recordEvent from 'platform/monitoring/record-event';
import Telephone, {
  CONTACTS,
  PATTERNS,
} from '@department-of-veterans-affairs/formation-react/Telephone';

import isVATeamSiteSubdomain from '../../../utilities/environment/va-subdomain';
import facilityLocatorManifest from 'applications/facility-locator/manifest.json';

const FACILITY_LOCATOR_URL = facilityLocatorManifest.rootUrl;

function HelpMenu({ clickHandler, cssClass, isOpen }) {
  const facilityLocatorUrl = isVATeamSiteSubdomain()
    ? `https://www.va.gov${FACILITY_LOCATOR_URL}`
    : FACILITY_LOCATOR_URL;
  const icon = <IconHelp color="#fff" role="presentation" />;

  const dropDownContents = (
    <div className="va-helpmenu-contents">
      <p>
        <a href={`${facilityLocatorUrl}`}>Find a VA Location</a>
      </p>
      <p>
        <a href="https://iris.custhelp.va.gov/app/ask">Ask a Question</a>
      </p>
      <p>
        Call us: <Telephone contact={CONTACTS.VA_311} />
      </p>
      <p>
        TTY: <Telephone contact={CONTACTS['711']} pattern={PATTERNS['911']} />
      </p>
    </div>
  );

  return (
    <DropDownPanel
      onClick={() => recordEvent({ event: 'nav-jumplink-click' })}
      buttonText="Contact us"
      clickHandler={clickHandler}
      cssClass={cssClass}
      id="help-menu"
      icon={icon}
      isOpen={isOpen}
    >
      {dropDownContents}
    </DropDownPanel>
  );
}

HelpMenu.propTypes = {
  cssClass: PropTypes.string,
  clickHandler: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default HelpMenu;

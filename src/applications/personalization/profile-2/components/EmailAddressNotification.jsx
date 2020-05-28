import React from 'react';

const EmailAddressNotification = ({ signInServiceName }) => {
  let link;
  let buttonText;

  if (signInServiceName === 'idme') {
    link = 'https://wallet.id.me/settings';
    buttonText = 'ID.me';
  }

  if (signInServiceName === 'dslogon') {
    link = 'https://myaccess.dmdc.osd.mil/identitymanagement';
    buttonText = 'DS Logon';
  }

  if (signInServiceName === 'mhv') {
    link = 'https://www.myhealth.va.gov';
    buttonText = 'My HealtheVet';
  }

  return (
    <>
      <p className="vads-u-margin--0">
        To update the email address you use to sign in, go to the account where
        you manage your settings and identity information. Any email updates you
        make there will automatically update on VA.gov.
      </p>
      <p className="vads-u-margin-bottom--0">
        <a href={link} target="_blank" rel="noopener noreferrer">
          Update email address on {buttonText}
        </a>
      </p>
    </>
  );
};

export default EmailAddressNotification;
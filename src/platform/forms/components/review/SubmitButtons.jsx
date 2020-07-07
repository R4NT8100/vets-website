// libs
import React from 'react';
import PropTypes from 'prop-types';

// platform - forms-system components
import Column from 'platform/forms/components/common/grid/Column';
import ProgressButton from 'platform/forms-system/src/js/components/ProgressButton';
import Row from 'platform/forms/components/common/grid/Row';

// platform - forms containers
import PreSubmitSection from 'platform/forms/containers/review/PreSubmitSection';

function SubmitButtons(props) {
  const { goBack, formConfig, onSubmit } = props;

  return (
    <>
      <Row>
        <Column />
      </Row>
      <PreSubmitSection formConfig={formConfig} />
      <Row classNames="form-progress-buttons">
        <Column classNames="small-6 medium-5">
          <ProgressButton
            onButtonClick={goBack}
            buttonText="Back"
            buttonClass="usa-button-secondary"
            beforeText="«"
          />
        </Column>
        <Column classNames="small-6 medium-5">
          <ProgressButton
            onButtonClick={onSubmit}
            buttonText="Submit application"
            buttonClass="usa-button-primary"
          />
        </Column>
        <Column classNames="small-1 medium-1 end">
          <div className="hidden">&nbsp;</div>
        </Column>
      </Row>
    </>
  );
}

SubmitButtons.propTypes = {
  goBack: PropTypes.func.isRequired,
  formConfig: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SubmitButtons;

import React from 'react';
import ViewDependentsLists from './ViewDependentsLists';
import ViewDependentsSidebar from '../components/ViewDependentsSidebar/ViewDependentsSidebar';
import ViewDependentsHeader from '../components/ViewDependentsHeader/ViewDependentsHeader';
import ViewDependentsSidebarBlock from '../components/ViewDependentsSidebar/ViewDependentsSidebarBlock';
import {
  firstSidebarBlock,
  secondSidebarBlock,
  thirdSidebarBlock,
} from '../components/ViewDependentsSidebar/ViewDependentsSidebarBlockStates/ViewDependentSidebarBlockStates';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import { isServerError, isClientError } from '../util';
import { errorFragment, infoFragment } from './helpers';

function ViewDependentsLayout(props) {
  let mainContent;

  if (props.error && isServerError(props.error.code)) {
    mainContent = <AlertBox content={errorFragment} status="error" />;
  } else if (props.error && isClientError(props.error.code)) {
    mainContent = <AlertBox content={infoFragment} status="info" />;
  } else if (
    props.onAwardDependents == null &&
    props.notOnAwardDependents == null
  ) {
    mainContent = <AlertBox content={infoFragment} status="info" />;
  } else {
    mainContent = (
      <ViewDependentsLists
        loading={props.loading}
        onAwardDependents={props.onAwardDependents}
        notOnAwardDependents={props.notOnAwardDependents}
      />
    );
  }

  const layout = (
    <div className="vads-l-row">
      <div className="vads-l-col--12 medium-screen:vads-l-col--8">
        <ViewDependentsHeader />
        {mainContent}
      </div>
      <div className="vads-l-col--12 medium-screen:vads-l-col--4">
        <ViewDependentsSidebar>
          <ViewDependentsSidebarBlock
            heading={firstSidebarBlock.heading}
            content={firstSidebarBlock.content}
          />
          <ViewDependentsSidebarBlock
            heading={secondSidebarBlock.heading}
            content={secondSidebarBlock.content}
          />
          <ViewDependentsSidebarBlock
            heading={thirdSidebarBlock.heading}
            content={thirdSidebarBlock.content}
          />
        </ViewDependentsSidebar>
      </div>
    </div>
  );

  return <div>{layout}</div>;
}

export default ViewDependentsLayout;

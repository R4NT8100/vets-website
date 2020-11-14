import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Link } from 'react-router';

import SortableTable from '@department-of-veterans-affairs/formation-react/SortableTable';
import Table from '@department-of-veterans-affairs/formation-react/Table';
import { formattedDate } from '../utils/helpers';

import backendServices from 'platform/user/profile/constants/backendServices';
import { fetchFolder, fetchRecipients } from '../actions/messaging';
import { recordDashboardClick } from '../helpers';
import { isAuthenticatedWithSSOe } from 'platform/user/authentication/selectors';
import { mhvUrl } from 'platform/site-wide/mhv/utilities';

class MessagingWidget extends React.Component {
  componentDidMount() {
    if (this.props.canAccessMessaging) {
      this.props.fetchRecipients();
      this.props.fetchFolder(0, { page: 1, sort: '-sent_date' });
    }
  }

  render() {
    const {
      canAccessMessaging,
      recipients,
      authenticatedWithSSOe,
    } = this.props;

    if (!canAccessMessaging || (recipients && recipients.length === 0)) {
      // do not show widget if user is not a VA patient
      // or if user does not have access to messaging
      return null;
    }

    const fields = [
      { label: 'From', value: 'senderName', nonSortable: true },
      { label: 'Subject line', value: 'subject', nonSortable: true },
      { label: 'Date', value: 'sentDate', nonSortable: true },
    ];

    // eslint-disable-next-line no-unused-vars
    const makeMessageLink = (content, id) => (
      // Messaging temporarily disabled.
      // See: https://github.com/department-of-veterans-affairs/vets.gov-team/issues/14499
      // <Link href={`/health-care/messaging/inbox/${id}`}>{content}</Link>
      <Link>{content}</Link>
    );

    let content;
    let { messages } = this.props;
    messages = messages || [];

    messages = messages.filter(message => message.readReceipt !== 'READ');

    const data = messages.map(message => {
      const id = message.messageId;
      const rowClass = classNames({
        'messaging-message-row': true,
      });

      const attachmentIcon = message.attachment ? (
        <i
          className="fa fa-paperclip vads-u-flex--auto"
          aria-label="Message has an attachment"
        />
      ) : null;

      return {
        id,
        rowClass,
        hasAttachment: attachmentIcon,
        recipientName: message.recipientName,
        senderName: message.senderName,
        subject: (
          <div className="vads-u-display--flex">
            <span className="vads-u-flex--fill">{message.subject}</span>
            {attachmentIcon}
          </div>
        ),
        sentDate: formattedDate(message.sentDate),
      };
    });

    if (messages && messages.length > 0) {
      content = <Table data={data} fields={fields} />;
    } else {
      content = (
        <p>You don’t have any unread messages from your health care team.</p>
      );
    }

    return (
      <div id="msg-widget" data-testid="non-cerner-messaging-widget">
        <h3>Check secure messages</h3>
        {content}
        <p>
          <a
            href={mhvUrl(authenticatedWithSSOe, 'secure-messaging')}
            onClick={recordDashboardClick('view-all-messages')}
            rel="noopener noreferrer"
            target="_blank"
          >
            View all your secure messages
          </a>
        </p>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const msgState = state.health.msg;
  const folder = msgState.folders.data.currentItem;
  const profileState = state.user.profile;
  const canAccessMessaging = profileState.services.includes(
    backendServices.MESSAGING,
  );

  const { attributes, messages, pagination, sort } = folder;

  return {
    attributes,
    loading: msgState.loading,
    messages,
    recipients: msgState.recipients.data,
    sort,
    pagination,
    canAccessMessaging,
    authenticatedWithSSOe: isAuthenticatedWithSSOe(state),
  };
};

const mapDispatchToProps = {
  fetchFolder,
  fetchRecipients,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MessagingWidget);
export { MessagingWidget };

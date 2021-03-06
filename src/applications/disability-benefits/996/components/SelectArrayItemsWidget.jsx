import React from 'react';

import get from 'platform/utilities/data/get';
import set from 'platform/utilities/data/set';

import { SELECTED } from '../constants';

export default class SelectArrayItemsWidget extends React.Component {
  onChange = (index, checked) => {
    const items = set(`[${index}].${SELECTED}`, checked, this.props.value);
    this.props.onChange(items);
  };

  render() {
    const { value: items, id, options, required, formContext } = this.props;
    // Need customTitle to set error message above title.
    const { label: Label, disabled } = options;

    // inReviewMode = true (review page view, not in edit mode)
    // inReviewMode = false (in edit mode)
    const onReviewPage = formContext.onReviewPage;
    const inReviewMode = onReviewPage && formContext.reviewMode;
    const customTitle = (options.customTitle || '').trim();

    const hasSelections = items?.reduce(
      (result, item) => result || !!get(SELECTED, item),
      false,
    );

    const Tag = formContext.onReviewPage ? 'h4' : 'h3';

    return (
      <>
        {customTitle &&
          items && <Tag className="vads-u-font-size--h5">{customTitle}</Tag>}
        {items?.length && (!inReviewMode || (inReviewMode && hasSelections)) ? (
          items.map((item, index) => {
            const itemIsSelected = !!get(SELECTED, item);

            // Don't show un-selected ratings in review mode
            if (inReviewMode && !itemIsSelected) {
              return null;
            }

            const checkboxVisible =
              !onReviewPage || (onReviewPage && !inReviewMode);

            const itemIsDisabled =
              typeof disabled === 'function' ? disabled(item) : false;

            const labelWithData = (
              <Label
                {...item}
                name={item.attributes.issue}
                className={
                  checkboxVisible
                    ? 'vads-u-display--inline'
                    : 'vads-u-margin-top--0p5'
                }
              />
            );
            // On the review & submit page, there may be more than one
            // of these components in edit mode with the same content, e.g. 526
            // ratedDisabilities & unemployabilityDisabilities causing
            // duplicate input ids/names... an `appendId` value is added to the
            // ui:options
            const appendId = options.appendId ? `_${options.appendId}` : '';
            const elementId = `${id}_${index}${appendId}`;

            const widgetClasses = [
              'form-checkbox',
              options.widgetClassNames,
              itemIsSelected ? 'selected' : '',
            ].join(' ');

            const labelClass = [
              'schemaform-label',
              checkboxVisible ? '' : 'vads-u-margin-top--0',
            ].join(' ');

            // When a `customTitle` option is included, the ObjectField is set
            // to wrap its contents in a div instead of a dl, so we don't need
            // a include dt and dd elements in the markup; this change fixes an
            // accessibility issue
            const content = (
              <React.Fragment key={index}>
                <dt className={widgetClasses}>
                  {checkboxVisible && (
                    <input
                      type="checkbox"
                      id={elementId}
                      name={elementId}
                      checked={
                        typeof itemIsSelected === 'undefined'
                          ? false
                          : itemIsSelected
                      }
                      required={required}
                      disabled={itemIsDisabled}
                      onChange={event =>
                        this.onChange(index, event.target.checked)
                      }
                    />
                  )}
                  {inReviewMode ? (
                    <div className={labelClass}>{labelWithData}</div>
                  ) : (
                    <label className={labelClass} htmlFor={elementId}>
                      {labelWithData}
                    </label>
                  )}
                </dt>
                <dd />
              </React.Fragment>
            );
            return formContext.reviewMode ? (
              content
            ) : (
              <dl className="review" key={index}>
                {content}
              </dl>
            );
          })
        ) : (
          // this section _shouldn't_ ever been seen
          <p>
            {onReviewPage ? (
              'No items selected'
            ) : (
              <strong>No items found</strong>
            )}
          </p>
        )}
      </>
    );
  }
}

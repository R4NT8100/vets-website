import React from 'react';

/*
 * This is a copy of the form system RadioWidget, but with custom
 * code to disable certain options. This isn't currently supported by the
 * form system.
 */
export default function FacilitiesRadioWidget({
  options,
  value,
  onChange,
  id,
  formContext,
}) {
  const { enumOptions } = options;
  const { facilities } = formContext;
  return (
    <div>
      {enumOptions.map((option, i) => {
        const facility = facilities.find(f => f.id === option.value);
        const checked = option.value === value;

        return (
          <div className="form-radio-buttons" key={option.value}>
            <input
              type="radio"
              checked={checked}
              id={`${id}_${i}`}
              name={`${id}`}
              value={option.value}
              onChange={_ => onChange(option.value)}
            />
            <label htmlFor={`${id}_${i}`}>
              <span className="vads-u-display--block vads-u-font-weight--bold">
                {facility.name}
              </span>
              <span className="vads-u-display--block vads-u-font-size--sm">
                {facility.address?.city}, {facility.address?.state}
              </span>
            </label>
          </div>
        );
      })}
    </div>
  );
}

import React from 'react';
import { expect } from 'chai';
import SkinDeep from 'skin-deep';
import ReactTestUtils from 'react-dom/test-utils';
import sinon from 'sinon';

import { getFormDOM } from 'platform/testing/unit/schemaform-utils';
import ObjectField from '../../../src/js/fields/ObjectField';

describe('Schemaform: ObjectField', () => {
  it('should render', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('shouldUpdate(SchemaField)')).not.to.be.empty;
  });
  it('should not render hidden items', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          'ui:hidden': true,
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('shouldUpdate(SchemaField)')).to.be.empty;
  });
  it('should render description', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:description': 'Blah',
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.text()).to.contain('Blah');
  });
  it('should render jsx description', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:description': <div className="test-class" />,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('.test-class')).not.to.be.empty;
  });
  it('should render component description', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:description': () => <div className="test-class" />,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.text()).to.contain('uiDescription');
  });
  it('should render title', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('TitleField')).is.not.empty;
  });
  it('should render component title', () => {
    const schema = {
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': () => <div className="test-class" />,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        uiSchema={uiSchema}
        schema={schema}
        idSchema={{}}
        formData={{}}
        onChange={f => f}
        onBlur={f => f}
      />,
    );

    expect(tree.text()).to.contain('uiTitle');
  });
  it('should hide expand under items when false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
          'ui:collapsed': true,
        },
      },
    };
    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test',
        },
      },
    };
    const formData = {
      test: false,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('ExpandingGroup')).not.to.be.empty;
    expect(tree.subTree('ExpandingGroup').props.open).to.be.false;
  });
  it('should not hide expand under items when true', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'boolean',
        },
        test2: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      test2: {
        'ui:options': {
          expandUnder: 'test',
        },
      },
    };
    const formData = {
      test: true,
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        uiSchema={uiSchema}
        idSchema={{}}
        formData={formData}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    expect(tree.everySubTree('ExpandingGroup')).not.to.be.empty;
    expect(tree.subTree('ExpandingGroup').props.open).to.be.true;
  });
  it('should handle change', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    tree.getMountedInstance().onPropertyChange('test')('value');

    expect(onChange.firstCall.args[0]).to.eql({
      test: 'value',
    });
  });
  it('should handle blur', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        test: {
          type: 'string',
        },
      },
    };
    const tree = SkinDeep.shallowRender(
      <ObjectField
        schema={schema}
        idSchema={{}}
        onChange={onChange}
        onBlur={onBlur}
      />,
    );

    tree.getMountedInstance().onPropertyBlur('test')();

    expect(onBlur.firstCall.args[0]).to.eql(['test']);
  });

  it('should render non-unique IDs on regular pages', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const formContext = {
      onReviewPage: false,
    };
    const schema1 = {
      properties: {
        type: 'object',
        test: {
          type: 'string',
        },
      },
    };
    const schema2 = {
      properties: {
        type: 'object',
        test2: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
    };
    const idSchema1 = {
      $id: 'root',
      test: {
        $id: 'root_test',
      },
    };
    const idSchema2 = {
      $id: 'root',
      test2: {
        $id: 'root_test2',
      },
    };
    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <ObjectField
          formContext={formContext}
          uiSchema={uiSchema}
          schema={schema1}
          idSchema={idSchema1}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
        <ObjectField
          formContext={formContext}
          uiSchema={uiSchema}
          schema={schema2}
          idSchema={idSchema2}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(form);
    const ids = formDOM.querySelectorAll('legend');
    expect(ids).to.have.length(2);

    const id0 = ids[0].id;
    const id1 = ids[1].id;
    expect(id0).to.equal('root__title');
    expect(id0).to.equal(id1);
  });
  it('should render unique IDs on review & submit page', () => {
    // This occurs on form 526 when "ratedDisabilities" &
    // "unempolyabilityDisabilities" both render the same list of rated
    // disabilities
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const formContext = {
      onReviewPage: true,
    };
    const schema = {
      properties: {
        type: 'object',
        test: {
          type: 'string',
        },
        test2: {
          type: 'string',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Blah',
    };
    const idSchema1 = {
      $id: 'root',
      test: {
        $id: 'root_test',
      },
    };
    const idSchema2 = {
      $id: 'root',
      test2: {
        $id: 'root_test2',
      },
    };
    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <ObjectField
          formContext={formContext}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema1}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
        <ObjectField
          formContext={formContext}
          uiSchema={uiSchema}
          schema={schema}
          idSchema={idSchema2}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(form);
    const ids = formDOM.querySelectorAll('legend');
    expect(ids).to.have.length(2);

    const id0 = ids[0].id;
    const id1 = ids[1].id;
    expect(id0).to.equal('root_test__title');
    expect(id1).to.equal('root_test2__title');
  });
  it('should render without a fieldset when showFieldLabel is true', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        prop1: {
          type: 'boolean',
        },
        prop2: {
          type: 'boolean',
        },
        prop3: {
          type: 'boolean',
        },
        prop4: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Test title',
      'ui:options': {
        showFieldLabel: true,
      },
      prop1: { 'ui:title': 'title1' },
      prop2: { 'ui:title': 'title2' },
      prop3: { 'ui:title': 'title3' },
      prop4: { 'ui:title': 'title4' },
    };

    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          idSchema={{}}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(form);
    const fieldsets = formDOM.querySelectorAll('fieldset');
    expect(fieldsets.length).to.equal(0);
  });
  it('should render with a single fieldset when showFieldLabel is false', () => {
    const onChange = sinon.spy();
    const onBlur = sinon.spy();
    const schema = {
      type: 'object',
      properties: {
        prop1: {
          type: 'boolean',
        },
        prop2: {
          type: 'boolean',
        },
        prop3: {
          type: 'boolean',
        },
        prop4: {
          type: 'boolean',
        },
      },
    };
    const uiSchema = {
      'ui:title': 'Test title',
      'ui:options': {
        showFieldLabel: false,
      },
      prop1: { 'ui:title': 'title1' },
      prop2: { 'ui:title': 'title2' },
      prop3: { 'ui:title': 'title3' },
      prop4: { 'ui:title': 'title4' },
    };

    const form = ReactTestUtils.renderIntoDocument(
      <div>
        <ObjectField
          uiSchema={uiSchema}
          schema={schema}
          idSchema={{}}
          formData={{}}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>,
    );
    const formDOM = getFormDOM(form);
    const fieldsets = formDOM.querySelectorAll('fieldset');
    expect(fieldsets.length).to.equal(1);
  });
});

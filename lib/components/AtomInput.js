'use babel';

// pulled from https://raw.githubusercontent.com/facebook/nuclide/master/pkg/nuclide-ui/lib/AtomInput.js
// current npm version is not compatable with React 15
/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

import classNames from 'classnames';
import { CompositeDisposable } from 'atom'; // eslint-disable-line import/no-extraneous-dependencies
import { React } from 'react-for-atom';

const { PropTypes } = React;

/**
 * An input field rendered as an <atom-text-editor mini />.
 */
export default class AtomInput extends React.Component {

  static defaultProps = {
    disabled: false,
    initialValue: '',
    tabIndex: '0', // Default to all <AtomInput /> components being in tab order
    onClick: () => {},
    onDidChange: () => {},
    onFocus: () => {},
    onBlur: () => {},
    unstyled: false,
  };

  static propTypes = {
    className: PropTypes.string,
    disabled: PropTypes.bool,
    initialValue: PropTypes.string,
    onBlur: PropTypes.func,
    onCancel: PropTypes.func,
    onClick: PropTypes.func,
    onConfirm: PropTypes.func,
    onDidChange: PropTypes.func,
    onFocus: PropTypes.func,
    placeholderText: PropTypes.string,
    size: PropTypes.number,
    tabIndex: PropTypes.string,
    unstyled: PropTypes.bool,
    width: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.initialValue,
    };
  }

  componentDidMount() {
    const disposables = this.disposables = new CompositeDisposable();

    // There does not appear to be any sort of infinite loop where calling
    // setState({value}) in response to onDidChange() causes another change
    // event.
    const textEditor = this.getTextEditor();
    const textEditorElement = this.getTextEditorElement();
    disposables.add(
      atom.commands.add(textEditorElement, {
        'core:confirm': () => {
          if (this.props.onConfirm != null) {
            this.props.onConfirm();
          }
        },
        'core:cancel': () => {
          if (this.props.onCancel != null) {
            this.props.onCancel();
          }
        },
      })
    );
    const placeholderText = this.props.placeholderText;
    if (placeholderText != null) {
      textEditor.setPlaceholderText(placeholderText);
    }
    this.getTextEditorElement().setAttribute('tabindex', this.props.tabIndex);
    if (this.props.disabled) {
      this.updateDisabledState(true);
    }

    // Set the text editor's initial value and keep the cursor at the beginning of the line. Cursor
    // position was documented in a test and is retained here after changes to how text is set in
    // the text editor. (see focus-related spec in AtomInput-spec.js)
    this.setText(this.state.value);
    this.getTextEditor().moveToBeginningOfLine();

    // Begin listening for changes only after initial value is set.
    disposables.add(textEditor.onDidChange(() => {
      this.setState({ value: textEditor.getText() });
      this.props.onDidChange.call(null, textEditor.getText());
    }));

    this.updateWidth();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.disabled !== this.props.disabled) {
      this.updateDisabledState(nextProps.disabled);
    }
  }

  componentDidUpdate(prevProps) {
    this.updateWidth(prevProps.width);
  }

  componentWillUnmount() {
    // Note that destroy() is not part of TextEditor's public API.
    this.getTextEditor().destroy();

    if (this.disposables) {
      this.disposables.dispose();
      this.disposables = null;
    }
  }

  onDidChange(callback) {
    return this.getTextEditor().onDidChange(callback);
  }

  getTextEditor() {
    return this.getTextEditorElement().getModel();
  }

  getText() {
    return this.state.value;
  }

  getTextEditorElement() {
    return this.root;
  }

  setText(text) {
    this.getTextEditor().setText(text);
  }

  updateDisabledState(isDisabled) {
    // Hack to set TextEditor to read-only mode, per https://github.com/atom/atom/issues/6880
    if (isDisabled) {
      this.getTextEditorElement().removeAttribute('tabindex');
    } else {
      this.getTextEditorElement().setAttribute('tabindex', this.props.tabIndex);
    }
  }

  updateWidth(prevWidth) {
    if (this.props.width !== prevWidth) {
      const width = this.props.width == null ? undefined : this.props.width;
      this.getTextEditorElement().setWidth(width);
    }
  }

  focus() {
    this.getTextEditor().moveToEndOfLine();
    this.getTextEditorElement().focus();
  }

  render() {
    const className = classNames(this.props.className, {
      'atom-text-editor-unstyled': this.props.unstyled,
      [`atom-text-editor-${this.props.size}`]: (this.props.size != null),
    });

    return (
      // Because the contents of `<atom-text-editor>` elements are managed by its custom web
      // component class when "Use Shadow DOM" is disabled, this element should never have children.
      // If an element has no children, React guarantees it will never re-render the element (which
      // would wipe out the web component's work in this case).
      <atom-text-editor
        ref={(ref) => { this.root = ref; }}
        class={className}
        mini
        onClick={this.props.onClick}
        onFocus={this.props.onFocus}
        onBlur={this.props.onBlur}
      />
    );
  }
}

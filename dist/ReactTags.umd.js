(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('prop-types')) :
  typeof define === 'function' && define.amd ? define(['react', 'prop-types'], factory) :
  (global = global || self, global.ReactTags = factory(global.React, global.PropTypes));
}(this, function (React, PropTypes) { 'use strict';

  React = React && React.hasOwnProperty('default') ? React['default'] : React;
  PropTypes = PropTypes && PropTypes.hasOwnProperty('default') ? PropTypes['default'] : PropTypes;

  function Tag (props) { return (
    React.createElement( 'button', { type: 'button', className: props.classNames.selectedTag, title: props.removeButtonText, onClick: props.onDelete },
      React.createElement( 'span', { className: props.classNames.selectedTagName }, props.tag.name)
    )
  ); }

  var SIZER_STYLES = {
    position: 'absolute',
    width: 0,
    height: 0,
    visibility: 'hidden',
    overflow: 'scroll',
    whiteSpace: 'pre'
  };

  var STYLE_PROPS = [
    'fontSize',
    'fontFamily',
    'fontWeight',
    'fontStyle',
    'letterSpacing'
  ];

  var Input = /*@__PURE__*/(function (superclass) {
    function Input (props) {
      superclass.call(this, props);
      this.state = { inputWidth: null };

      this.input = React.createRef();
      this.sizer = React.createRef();
    }

    if ( superclass ) Input.__proto__ = superclass;
    Input.prototype = Object.create( superclass && superclass.prototype );
    Input.prototype.constructor = Input;

    Input.prototype.componentDidMount = function componentDidMount () {
      if (this.props.autoresize) {
        this.copyInputStyles();
        this.updateInputWidth();
      }
    };

    Input.prototype.componentDidUpdate = function componentDidUpdate () {
      this.updateInputWidth();
    };

    Input.prototype.copyInputStyles = function copyInputStyles () {
      var this$1 = this;

      var inputStyle = window.getComputedStyle(this.input.current);

      STYLE_PROPS.forEach(function (prop) {
        this$1.sizer.current.style[prop] = inputStyle[prop];
      });
    };

    Input.prototype.updateInputWidth = function updateInputWidth () {
      var inputWidth;

      if (this.props.autoresize) {
        // scrollWidth is designed to be fast not accurate.
        // +2 is completely arbitrary but does the job.
        inputWidth = Math.ceil(this.sizer.current.scrollWidth) + 2;
      }

      if (inputWidth !== this.state.inputWidth) {
        this.setState({ inputWidth: inputWidth });
      }
    };

    Input.prototype.render = function render () {
      var ref = this.props;
      var id = ref.id;
      var query = ref.query;
      var placeholderText = ref.placeholderText;
      var expanded = ref.expanded;
      var classNames = ref.classNames;
      var inputAttributes = ref.inputAttributes;
      var inputEventHandlers = ref.inputEventHandlers;
      var index = ref.index;

      return (
        React.createElement( 'div', { className: classNames.searchWrapper },
          React.createElement( 'input', Object.assign({},
            inputAttributes, inputEventHandlers, { ref: this.input, value: query, placeholder: placeholderText, className: classNames.searchInput, role: 'combobox', 'aria-autocomplete': 'list', 'aria-label': placeholderText, 'aria-owns': id, 'aria-activedescendant': index > -1 ? (id + "-" + index) : null, 'aria-expanded': expanded, style: { width: this.state.inputWidth } })),
          React.createElement( 'div', { ref: this.sizer, style: SIZER_STYLES }, query || placeholderText)
        )
      )
    };

    return Input;
  }(React.Component));

  function escapeForRegExp (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&')
  }

  function matchAny (string) {
    return new RegExp(escapeForRegExp(string), 'gi')
  }

  function matchPartial (string) {
    return new RegExp(("(?:^|\\s)" + (escapeForRegExp(string))), 'i')
  }

  function matchExact (string) {
    return new RegExp(("^" + (escapeForRegExp(string)) + "$"), 'i')
  }

  function markIt (name, query) {
    var regexp = matchAny(query);
    return name.replace(regexp, '<mark>$&</mark>')
  }

  var DefaultSuggestionComponent = function (ref) {
    var item = ref.item;
    var query = ref.query;

    return (
    React.createElement( 'span', { dangerouslySetInnerHTML: { __html: markIt(item.name, query) } })
  );
  };

  var Suggestions = /*@__PURE__*/(function (superclass) {
    function Suggestions () {
      superclass.apply(this, arguments);
    }

    if ( superclass ) Suggestions.__proto__ = superclass;
    Suggestions.prototype = Object.create( superclass && superclass.prototype );
    Suggestions.prototype.constructor = Suggestions;

    Suggestions.prototype.onMouseDown = function onMouseDown (item, e) {
      // focus is shifted on mouse down but calling preventDefault prevents this
      e.preventDefault();
      this.props.addTag(item);
    };

    Suggestions.prototype.render = function render () {
      var this$1 = this;

      if (!this.props.expanded || !this.props.options.length) {
        return null
      }

      var SuggestionComponent = this.props.suggestionComponent || DefaultSuggestionComponent;

      var options = this.props.options.map(function (item, index) {
        var key = (this$1.props.id) + "-" + index;
        var classNames = [];

        if (this$1.props.index === index) {
          classNames.push(this$1.props.classNames.suggestionActive);
        }

        if (item.disabled) {
          classNames.push(this$1.props.classNames.suggestionDisabled);
        }

        return (
          React.createElement( 'li', {
            id: key, key: key, role: 'option', className: classNames.join(' '), 'aria-disabled': item.disabled === true, onMouseDown: this$1.onMouseDown.bind(this$1, item) },
            React.createElement( SuggestionComponent, { item: item, query: this$1.props.query })
          )
        )
      });

      return (
        React.createElement( 'div', { className: this.props.classNames.suggestions },
          React.createElement( 'ul', { role: 'listbox', id: this.props.id }, options)
        )
      )
    };

    return Suggestions;
  }(React.Component));

  var KEYS = {
    ENTER: 'Enter',
    TAB: 'Tab',
    BACKSPACE: 'Backspace',
    UP_ARROW: 'ArrowUp',
    UP_ARROW_COMPAT: 'UP',
    DOWN_ARROW: 'ArrowDown',
    DOWN_ARROW_COMPAT: 'Down'
  };

  var CLASS_NAMES = {
    root: 'react-tags',
    rootFocused: 'is-focused',
    selected: 'react-tags__selected',
    selectedTag: 'react-tags__selected-tag',
    selectedTagName: 'react-tags__selected-tag-name',
    search: 'react-tags__search',
    searchWrapper: 'react-tags__search-wrapper',
    searchInput: 'react-tags__search-input',
    suggestions: 'react-tags__suggestions',
    suggestionActive: 'is-active',
    suggestionDisabled: 'is-disabled'
  };

  function pressDelimiter () {
    var this$1 = this;

    if (this.state.query.length >= this.props.minQueryLength) {
      // Check if the user typed in an existing suggestion.
      var match = this.state.options.findIndex(function (option) {
        return matchExact(this$1.state.query).test(option.name)
      });

      var index = this.state.index === -1 ? match : this.state.index;

      if (index > -1) {
        this.addTag(this.state.options[index]);
      } else if (this.props.allowNew) {
        this.addTag({ name: this.state.query });
      }
    }
  }

  function pressUpKey (e) {
    e.preventDefault();

    // if first item, cycle to the bottom
    var size = this.state.options.length - 1;
    this.setState({ index: this.state.index <= 0 ? size : this.state.index - 1 });
  }

  function pressDownKey (e) {
    e.preventDefault();

    // if last item, cycle to top
    var size = this.state.options.length - 1;
    this.setState({ index: this.state.index >= size ? 0 : this.state.index + 1 });
  }

  function pressBackspaceKey () {
    // when backspace key is pressed and query is blank, delete the last tag
    if (!this.state.query.length) {
      this.deleteTag(this.props.tags.length - 1);
    }
  }

  function filterSuggestions (query, suggestions, suggestionsFilter) {
    if (!suggestionsFilter) {
      var regexp = matchPartial(query);
      suggestionsFilter = function (item) { return regexp.test(item.name); };
    }

    return suggestions.filter(suggestionsFilter)
  }

  var ReactTags = /*@__PURE__*/(function (superclass) {
    function ReactTags (props) {
      superclass.call(this, props);

      this.state = {
        query: '',
        focused: false,
        options: [],
        index: -1
      };

      this.inputEventHandlers = {
        // Provide a no-op function to the input component to avoid warnings
        // <https://github.com/i-like-robots/react-tags/issues/135>
        // <https://github.com/facebook/react/issues/13835>
        onChange: function () {},
        onBlur: this.onBlur.bind(this),
        onFocus: this.onFocus.bind(this),
        onInput: this.onInput.bind(this),
        onKeyDown: this.onKeyDown.bind(this)
      };

      this.input = React.createRef();
      this.suggestions = React.createRef();
    }

    if ( superclass ) ReactTags.__proto__ = superclass;
    ReactTags.prototype = Object.create( superclass && superclass.prototype );
    ReactTags.prototype.constructor = ReactTags;

    ReactTags.prototype.onInput = function onInput (e) {
      var query = e.target.value;

      if (this.props.onInput) {
        this.props.onInput(query);
      }

      if (query !== this.state.query) {
        var filtered = filterSuggestions(query, this.props.suggestions, this.props.suggestionsFilter);
        var options = filtered.slice(0, this.props.maxSuggestionsLength);

        this.setState({ query: query, options: options });
      }
    };

    ReactTags.prototype.onKeyDown = function onKeyDown (e) {
      // when one of the terminating keys is pressed, add current query to the tags
      if (this.props.delimiters.indexOf(e.key) > -1) {
        if (this.state.query || this.state.index > -1) {
          e.preventDefault();
        }

        pressDelimiter.call(this);
      }

      // when backspace key is pressed and query is blank, delete the last tag
      if (e.key === KEYS.BACKSPACE && this.props.allowBackspace) {
        pressBackspaceKey.call(this, e);
      }

      if (e.key === KEYS.UP_ARROW || e.key === KEYS.UP_ARROW_COMPAT) {
        pressUpKey.call(this, e);
      }

      if (e.key === KEYS.DOWN_ARROW || e.key === KEYS.DOWN_ARROW_COMPAT) {
        pressDownKey.call(this, e);
      }
    };

    ReactTags.prototype.onClick = function onClick (e) {
      if (document.activeElement !== e.target) {
        this.input.current.input.current.focus();
      }
    };

    ReactTags.prototype.onBlur = function onBlur () {
      this.setState({ focused: false, index: -1 });

      if (this.props.onBlur) {
        this.props.onBlur();
      }

      if (this.props.addOnBlur) {
        pressDelimiter.call(this);
      }
    };

    ReactTags.prototype.onFocus = function onFocus () {
      this.setState({ focused: true });

      if (this.props.onFocus) {
        this.props.onFocus();
      }
    };

    ReactTags.prototype.addTag = function addTag (tag) {
      if (tag.disabled) {
        return
      }

      if (typeof this.props.onValidate === 'function' && !this.props.onValidate(tag)) {
        return
      }

      this.props.onAddition(tag);

      // reset the state
      this.setState({
        query: '',
        index: 0
      });
    };

    ReactTags.prototype.deleteTag = function deleteTag (i) {
      this.props.onDelete(i);
    };

    ReactTags.prototype.clearInput = function clearInput () {
      this.setState({ query: '' });
    };

    ReactTags.prototype.render = function render () {
      var this$1 = this;

      var TagComponent = this.props.tagComponent || Tag;

      var expanded = this.state.focused && this.state.query.length >= this.props.minQueryLength;
      var classNames = [this.props.classNames.root];

      this.state.focused && classNames.push(this.props.classNames.rootFocused);

      return (
        React.createElement( 'div', { className: classNames.join(' '), onClick: this.onClick.bind(this) },
          React.createElement( 'div', {
            className: this.props.classNames.selected, 'aria-relevant': 'additions removals', 'aria-live': 'polite' },
            this.props.tags.map(function (tag, i) { return (
              React.createElement( TagComponent, {
                key: i, tag: tag, removeButtonText: this$1.props.removeButtonText, classNames: this$1.props.classNames, onDelete: this$1.deleteTag.bind(this$1, i) })
            ); })
          ),
          React.createElement( 'div', { className: this.props.classNames.search },
            React.createElement( Input, Object.assign({},
              this.state, { id: this.props.id, ref: this.input, classNames: this.props.classNames, inputAttributes: this.props.inputAttributes, inputEventHandlers: this.inputEventHandlers, autoresize: this.props.autoresize, expanded: expanded, placeholderText: this.props.placeholderText })),
            React.createElement( Suggestions, Object.assign({},
              this.state, { id: this.props.id, ref: this.suggestions, classNames: this.props.classNames, expanded: expanded, addTag: this.addTag.bind(this), suggestionComponent: this.props.suggestionComponent }))
          )
        )
      )
    };

    return ReactTags;
  }(React.Component));

  ReactTags.defaultProps = {
    id: 'ReactTags',
    tags: [],
    placeholderText: 'Add new tag',
    removeButtonText: 'Click to remove tag',
    suggestions: [],
    suggestionsFilter: null,
    autoresize: true,
    classNames: CLASS_NAMES,
    delimiters: [KEYS.TAB, KEYS.ENTER],
    minQueryLength: 2,
    maxSuggestionsLength: 6,
    allowNew: false,
    allowBackspace: true,
    addOnBlur: false,
    tagComponent: null,
    suggestionComponent: null,
    inputAttributes: {}
  };

  ReactTags.propTypes = {
    id: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.object),
    placeholderText: PropTypes.string,
    removeButtonText: PropTypes.string,
    suggestions: PropTypes.arrayOf(PropTypes.object),
    suggestionsFilter: PropTypes.func,
    autoresize: PropTypes.bool,
    delimiters: PropTypes.arrayOf(PropTypes.string),
    onDelete: PropTypes.func.isRequired,
    onAddition: PropTypes.func.isRequired,
    onInput: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onValidate: PropTypes.func,
    minQueryLength: PropTypes.number,
    maxSuggestionsLength: PropTypes.number,
    classNames: PropTypes.object,
    allowNew: PropTypes.bool,
    allowBackspace: PropTypes.bool,
    addOnBlur: PropTypes.bool,
    tagComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element
    ]),
    suggestionComponent: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.element
    ]),
    inputAttributes: PropTypes.object
  };

  return ReactTags;

}));

import React, { createRef } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';

import SearchResult from './SearchResult';
import HeaderDropdownToggle from '../content/CustomDropdowns/HeaderDropdownToggle';
import { ReactComponent as SearchIcon } from '../../../_metronic/layout/assets/layout-svg-icons/Search.svg';
import * as general from '../../../app/store/ducks/general.duck';
import { data } from './searchOptions';

const perfectScrollbarOptions = {
  wheelSpeed: 2,
  wheelPropagation: false
};

class SearchDropdown extends React.Component {
  buttonRef = createRef();
  state = { loading: false, data: null, searchValue: '', show: false }

  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ loading: false, data: null, searchValue: '', show: false })
    }
  }

  clearTimeout() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  handleOptionClick = (item) => {
    this.props.setGeneralSearch({
      searchValue: this.state.searchValue,
      module: item.module,
      tabIndex: item.tabIndex
    })
    this.setState({ loading: false, data: null, searchValue: '', show: false })
    this.props.history.push(`/${item.module}`)
  }

  handleKeyDown = event => {
    if (event.key === 'Enter') {
      this.props.setGeneralSearch({
        searchValue: this.state.searchValue,
        module: 'assets',
        tabIndex: 0
      })
      this.setState({ loading: false, data: null, searchValue: '', show: false })
      this.props.history.push('/assets')
    }
  }

  handleSearchChange = event => {
    this.setState({ data: null, searchValue: event.target.value });
    if (event.target.value.length) {
      this.clearTimeout();

      this.setState({ loading: true });

      // simulate getting search result
      this.timeoutId = setTimeout(() => {
        this.setState({ data: data, loading: false });
      }, 500);
    }
  };


  clear = () => {
    this.setState({ data: null, searchValue: '' });
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    this.clearTimeout();
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  render() {
    const { data, loading, searchValue } = this.state;
    const { useSVG, icon, iconType } = this.props;
    return (
      <Dropdown
        alignRight
        className='kt-header__topbar-item kt-header__topbar-item--search'
        drop='down'
        onToggle={() => {
          this.setState({
            data: null,
            loading: false,
            searchValue: ''
          });
        }}
        show={this.state.show}
        id='dropdown'
      >
        <Dropdown.Toggle
          as={HeaderDropdownToggle}
          id='dropdown-toggle-search'
          onClick={() => this.setState({
            ...this.state,
            show: true
          })}>
          <span
            className={clsx('kt-header__topbar-icon', {
              [`kt-header__topbar-icon--${iconType}`]: iconType
            })}
          >
            {!useSVG ? (
              <i className={icon} />
            ) : (
              <span className='kt-svg-icon'>
                <SearchIcon />
              </span>
            )}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className='dropdown-menu-fit dropdown-menu-right dropdown-menu-anim dropdown-menu-lg'>
          <div
            id='kt_quick_search_dropdown'
            className={clsx(
              'kt-quick-search kt-quick-search--dropdown kt-quick-search--result-compact',
              {
                'kt-quick-search--has-result': data && data.length
              }
            )}
            ref={(nodo) => this.state.show ? this.setWrapperRef(nodo) : null}
          >
            <div className='kt-quick-search__form'>
              <div
                className={clsx('input-group', {
                  'kt-spinner kt-spinner--input kt-spinner--sm kt-spinner--brand kt-spinner--right': loading
                })}
              >
                <div className='input-group-prepend'>
                  <span className='input-group-text'>
                    <i className='flaticon2-search-1' />
                  </span>
                </div>

                <input
                  type='text'
                  autoFocus={true}
                  placeholder='Search...'
                  value={searchValue}
                  onChange={this.handleSearchChange}
                  onKeyDown={this.handleKeyDown}
                  className='form-control kt-quick-search__input'
                />

                <div className='input-group-append'>
                  <span className='input-group-text'>
                    <i
                      style={{ display: 'flex' }}
                      onClick={this.clear}
                      hidden={!data || (data && !data.length)}
                      className='la la-close kt-quick-search__close'
                    />
                  </span>
                </div>
              </div>
            </div>
            <PerfectScrollbar
              className='kt-quick-search__wrapper kt-scroll'
              data-height='325'
              data-mobile-height='200'
              data-scroll='true'
              options={perfectScrollbarOptions}
              style={{ maxHeight: '40vh' }}
            >
              <SearchResult data={data} handleClick={(item) => this.handleOptionClick(item)} />
            </PerfectScrollbar>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

export default compose(
  withRouter,
  connect(null, general.actions)
)(SearchDropdown);

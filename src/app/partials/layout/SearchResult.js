/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import clsx from "clsx";
import SearchIcon from '@material-ui/icons/Search';

export default class SearchResult extends React.Component {
  render() {
    const { data, handleClick } = this.props;

    if (!data) {
      return null;
    }

    if (data.length === 0) {
      return (
        <div className="kt-quick-search__result">
          <div className="kt-quick-search__message kt-hidden">
            No record found
          </div>
        </div>
      );
    }

    return (
      <div className="kt-quick-search__result">
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {item.type === 1 && (
              <div className="kt-quick-search__item">
                <div className={clsx({"kt-quick-search__item-img": item.icon, "kt-quick-search__item-icon": item.iconClassName})}>
                  <SearchIcon />
                </div>

                <div className="kt-quick-search__item-wrapper" onClick={() => handleClick(item)}>
                  <a href="#" className="kt-quick-search__item-title">
                    {item.text}
                  </a>
                </div>
              </div>
            )}

            {item.type === 0 && (
              <div className="kt-quick-search__category">{item.text}</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
}

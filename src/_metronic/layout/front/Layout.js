import React from "react";
import { connect } from "react-redux";

function Layout({ children, selfLayout }) {
  // scroll to top after location changes
  // window.scrollTo(0, 0);
  return selfLayout !== "blank" ? (
    <>
      <div className="kt-grid kt-grid--hor kt-grid--root">
        {/* <!-- begin::Body --> */}
        <div className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--ver kt-page">
          <div
            className="kt-grid__item kt-grid__item--fluid kt-grid kt-grid--hor kt-wrapper"
            id="kt_wrapper"
          >
            {children}
          </div>
        </div>
        {/* <!-- end:: Body --> */}
      </div>
    </>
  ) : (
    // BLANK LAYOUT
    <div className="kt-grid kt-grid--ver kt-grid--root">Blank Layout</div>
  );
}

const mapStateToProps = ({ builder: { layoutConfig } }) => ({});

export default connect(mapStateToProps)(Layout);

import classNames from "classnames/bind";
import styles from "./container.module.scss";
const cx = classNames.bind(styles);

// create instance of classnames with bind styles

import React from "react";

const Container = ({ children }) => {
  return <div className={cx('container')} >{children}</div>;
};

export default Container;

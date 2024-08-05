import classNames from 'classnames';
import React from 'react';
import styles from './styles.module.css';

export const Loader = () => {
    return <div className={classNames(styles.loader, styles.simpleCircle)}/>;
};

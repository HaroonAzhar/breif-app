import React, {useState} from 'react';
import styles from './styles.module.css';

export function LegalPopup() {
    const terms = localStorage.getItem('accepted-terms');
    const [termsAccepted, setTermsAccepted] = useState(false);

    const acceptButton = () => {
        localStorage.setItem('accepted-terms', 'true');
        setTermsAccepted(true);
    };

    if (terms === 'true' || termsAccepted) {
        return null;
    }

    return (
        <div className={styles.popupWrapper}>
            <div className={styles.popupText}>
                This site uses cookies to provide you with a fantastic user experience.
                <br/>
                By using brief® you accept, in full, our{' '}
                <a
                    className={styles.link}
                    href='https://drive.google.com/file/d/1fntI3X-Bnf8KJSImwXomvDEWsTJRqyDP/view?usp=sharing'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    use of cookies
                </a>{' '}
                and{' '}
                <a
                    className={styles.link}
                    href='https://drive.google.com/open?id=1rzXyOXNUMe-1VkIOiiHCH8mwc8lfOBNP'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    website T{'&'}C’s
                </a>
                .<br/>
                <a
                    className={styles.link}
                    href='https://drive.google.com/open?id=1ifHGbVKPtD9SWJ5ZgKYVZIDAdLg_1cJK'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                    Website Disclaimer
                </a>
                .
            </div>
            <div className={styles.acceptButtonWrapper} onClick={acceptButton}>
                <span className={styles.acceptButton}>ACCEPT</span>
            </div>
        </div>
    );
}

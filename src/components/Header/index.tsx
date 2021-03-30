import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  return (
    <header className={`${commonStyles.container} ${styles.header}`}>
      <a href="/">
        <img src="/Logo.png" alt="logo" />
      </a>
    </header>
  );
}

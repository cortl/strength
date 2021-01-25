import styles from '../styles/Button.module.css';

const Button = ({onClick, text, pushed}) => (
    <button className={`${styles.button} ${pushed ? styles.pushed : ''} `} onClick={onClick}>
        {text}
    </button>
)

export default Button;
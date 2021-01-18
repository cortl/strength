import styles from '../styles/Card.module.css'

const Card = (props) => {
    let split;
    if (props.full) {
        split = styles.full;
    } else if (props.quarter) {
        split = styles.quarter;
    } else if (props.half) {
        split = styles.half;
    } else if (props.thirds) {
        split = styles.thirds;
    }


    return props.link ?
        (
            <a href={props.to} className={`${styles.card} ${split}`}>
                {props.children}
            </a>
        )
        : (
            <div className={`${styles.card} ${split}`}>
                {props.children}
            </div>
        )
}

export default Card;
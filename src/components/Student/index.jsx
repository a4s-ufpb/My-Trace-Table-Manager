import { BsLinkedin } from 'react-icons/bs';
import styles from './style.module.css';

export default function Student({ img, name, linkedin }) {
    return (
        <div>
            <img src={img} alt={name} className={styles.image} />
            <p className={styles.participantName}>
                {name}
                {linkedin && (
                    <a href={linkedin} target="_blank" rel="noopener noreferrer">
                        <BsLinkedin className={styles.linkedinIcon} />
                    </a>
                )}
            </p>
        </div>
    )
}
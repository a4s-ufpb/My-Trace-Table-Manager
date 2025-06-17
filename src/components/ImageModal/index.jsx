import styles from './styles.module.css';

export default function ImageModal({ isOpen, onClose, imageSrc}) {
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <span className={styles.close} onClick={onClose}>
        X
      </span>
      <img className={styles.modalContent} src={imageSrc}/>
    </div>
  );
}
import React from "react";
import styles from "../../../../styles/support/support.module.scss";

export default function SupportCard({ link, img, header, description }) {
  return (
    <div className="text-center">
      <a
        href={link}
        rel="noreferrer"
        target="_blank"
        className={styles.support_card_background}
      >
        <div>
          <div className={styles.img_container}>{img}</div>
          <p className={`mb-0 ${styles.support_link_header}`}>{header}</p>
        </div>
      </a>
      <div className="py-2">
        <p className={`mb-0 ${styles.support_link_description}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

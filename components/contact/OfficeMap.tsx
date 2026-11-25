import styles from "@/app/contact/contact.module.css";

export function OfficeMap({ src }: { src: string }) {
  return (
    <div className={styles.map} data-motion-item>
      <iframe
        src={src}
        title="Map showing the RC Architecture main office"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

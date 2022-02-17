import styles from "./styles/globalStyles.module.scss";
import OndcRoutes from "./router";
import "./api/firebase-init";

function App() {
  return (
    <div className={styles.background}>
      <OndcRoutes />
    </div>
  );
}

export default App;

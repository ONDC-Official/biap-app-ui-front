import styles from "./styles/globalStyles.module.scss";
import OndcRoutes from "./router";

function App() {
  return (
    <div className={styles.background}>
      <OndcRoutes />
    </div>
  );
}

export default App;

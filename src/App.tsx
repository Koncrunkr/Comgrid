import type { Component } from 'solid-js';

import styles from './App.module.css';
import { IndexPage } from "./main/IndexPage";

const App: Component = () => {
  return (
    <div class={styles.App}>
      <IndexPage />
    </div>
  );
};

export default App;

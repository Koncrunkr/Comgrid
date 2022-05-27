import type { Component } from 'solid-js';
import { createEffect } from 'solid-js';
import { Route, Routes } from 'solid-app-router';
import { IndexPage } from './main/pages';
import { Header } from './main/Header';
import { useTheme } from './theme/Theme';

export interface PageInfo {
  name: string;
  path: string;
}

export const IndexPageInfo: PageInfo = {
  name: 'index',
  path: '/',
};

export const TablesPageInfo: PageInfo = {
  name: 'pages',
  path: '/pages',
};

const App: Component = () => {
  const [theme] = useTheme();
  createEffect(() => {
    // @ts-ignore
    document.body.style = `background: ${theme().colors.background};`;
  });
  return (
    <>
      <Header currentPage={IndexPageInfo} pages={[IndexPageInfo]} />
      <Routes>
        <Route path={IndexPageInfo.path} element={<IndexPage />} />
      </Routes>
    </>
  );
};

export default App;

import type { Component } from 'solid-js';
import { createEffect, createResource } from 'solid-js';
import { Route, Routes } from 'solid-app-router';
import { IndexPage } from './main/pages';
import { Header } from './main/Header';
import { useTheme } from './theme/Theme';
import { LoginPage } from './main/pages/LoginPage';
import { TablePage } from './main/pages/TablePage';
import { TableResponse } from './util/request/CreateTableRequest';
import { getHttpClient } from './util/HttpClient';
import { UserInfoRequest } from './util/request/UserInfoRequest';

export interface PageInfo {
  name: string;
  path: string;
}

export const IndexPageInfo: PageInfo = {
  name: 'index',
  path: '/',
};

export const TablesPageInfo: PageInfo = {
  name: 'tables',
  path: '/',
};

export const TablePageInfo: PageInfo = {
  name: 'page',
  path: '/table',
};

const App: Component = () => {
  const [theme] = useTheme();
  createEffect(() => {
    // @ts-ignore
    document.body.style = `background: ${theme().colors.background};`;
  });
  return (
    <div
      style={{
        height: '100vh',
        margin: '0',
        display: 'flex',
        'flex-direction': 'column',
      }}
    >
      <Header currentPage={IndexPageInfo} pages={[IndexPageInfo]} />
      <Routes>
        <Route
          path={IndexPageInfo.path}
          element={<IndexPage />}
          data={() =>
            createResource<TableResponse[]>(() =>
              getHttpClient()
                .proceedRequest(new UserInfoRequest({ includeChats: true }))
                .then(value => value.chats!)
                .catch(() => []),
            )[0]
          }
        />
        <Route path={TablePageInfo.path} element={<TablePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <footer
        class="text-center"
        style={{
          'background-color': theme().colors.secondaryBackground,
          color: theme().colors.secondaryText,
          'margin-top': 'auto',
        }}
      >
        <small>
          <i class="far fa-copyright"></i> Koncrunkr
        </small>
      </footer>
    </div>
  );
};

export default App;

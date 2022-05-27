import { useTheme } from '../theme/Theme';
import { useStrings } from '../assets/localization/localization';
import { createEffect } from 'solid-js';

import { PageInfo, TablesPageInfo } from '../App';
import { Link } from 'solid-app-router';
import { SimpleButton } from '../common/SimpleButton';

export const Header = (props: { currentPage: PageInfo; pages: PageInfo[] }) => {
  const [theme] = useTheme();
  return (
    <header>
      <nav
        class="navbar navbar-expand justify-content-between"
        style={{
          'background-color': theme().colors.secondaryBackground,
        }}
      >
        <div class="navbar-nav mx-2">
          <LogoItem />
          <HeaderPageItem page={TablesPageInfo} />
          <div class="navbar-elem ml-3">
            <div id="id-keeper" class="nav-link active"></div>
          </div>
        </div>
        <div class="navbar-nav" style={{ background: theme().colors.button }}>
          <SearchItem />
        </div>
        <div class="navbar-nav">
          <ChangeThemeItem />
        </div>
        <AuthorizationItem />
      </nav>
    </header>
  );
};

export const LogoItem = () => {
  const [theme] = useTheme();
  return (
    <Link
      class="navbar-brand"
      href="#"
      style={{
        color: theme().colors.text,
      }}
    >
      <i
        class="fas fa-table"
        style={{
          'margin-right': '10px',
        }}
      ></i>
      Comgrid
    </Link>
  );
};

const HeaderPageItem = (props: { page: PageInfo }) => {
  const [getString] = useStrings();
  createEffect(() => console.log(getString('pages')()));
  const [theme] = useTheme();
  return (
    <div class="navbar-elem ml-3">
      <Link
        id={'page-item-' + props.page.name}
        class="nav-link active"
        href={props.page.path}
        style={{ color: theme().colors.text }}
      >
        {getString(props.page.name)()}
      </Link>
    </div>
  );
};

export const SearchItem = () => {
  const [getString] = useStrings();

  return <SimpleButton onClick={() => null}>{getString('search')}</SimpleButton>;
};

export const ChangeThemeItem = () => {
  const [_, __, changeTheme] = useTheme();
  const [getString] = useStrings();
  return <SimpleButton onClick={changeTheme}>{getString('change_theme')}</SimpleButton>;
};

export const AuthorizationItem = () => {
  return (
    <div class="navbar-nav">
      <div class="clickable navbar-elem mx-3" id="sign-in-div">
        <button class="btn btn-light" data-toggle="modal" data-target="#sign-in-menu">
          Sign in
        </button>
      </div>
      <div class="clickable navbar-elem mx-3 d-none" id="sign-out-div">
        <a class="nav-link text-dark" id="sign-out" href="#">
          Sign out
        </a>
      </div>
    </div>
  );
};

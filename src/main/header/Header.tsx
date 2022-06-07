import { useTheme } from '../../theme/Theme';
import { useStrings } from '../../assets/localization/localization';

import { PageInfo, TablesPageInfo } from '../../App';
import { Link } from 'solid-app-router';
import { SimpleButton } from '../../common/SimpleButton';
import { AuthorizationItem } from './AuthorizationItem';
import { SearchItem } from './SearchItem';

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
        </div>
        <div class="navbar-nav">
          <SearchItem />
        </div>
        <div class="navbar-nav">
          <ChangeThemeItem />
        </div>
        <div class="navbar-nav">
          <AuthorizationItem />
        </div>
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

export const ChangeThemeItem = () => {
  const [_, __, changeTheme] = useTheme();
  const [getString] = useStrings();
  return <SimpleButton onClick={changeTheme}>{getString('change_theme')}</SimpleButton>;
};

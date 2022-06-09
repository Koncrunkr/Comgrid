import { useTheme } from '../../theme/Theme';
import { Link } from 'solid-app-router';

export const LogoItem = () => {
  const [theme] = useTheme();
  return (
    <Link
      class="navbar-brand"
      href={window.location.protocol + '//' + window.location.host}
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

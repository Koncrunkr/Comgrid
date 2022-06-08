import { User } from '../../../util/State';
import { useStrings } from '../../../assets/localization/localization';
import { useTheme } from '../../../theme/Theme';
import { createEffect, For } from 'solid-js';

export const UsersInfoItem = (props: { users?: User[] }) => {
  const [getString] = useStrings();
  const [theme] = useTheme();
  createEffect(() => {
    console.log(props.users);
  });
  return (
    <div class="user-container">
      <div
        class="no-deletable card container mt-2"
        style={{
          'background-color': theme().colors.invertedBackground,
          color: theme().colors.invertedText,
        }}
      >
        <div class="card-body row p-2 align-items-center">
          <div class="ml-1 pl-0 col">{getString('table_users')}:</div>
        </div>
      </div>
      <For each={props.users}>{user => <UserInfoItem user={user} />}</For>
    </div>
  );
};

export const UserInfoItem = (props: { user: User }) => {
  const [theme] = useTheme();
  return (
    <div
      class="user-card card container"
      style={{
        'background-color': theme().colors.background,
        color: theme().colors.text,
        border: theme().colors.borderColor,
      }}
    >
      <div class="card-body p-1 row media align-items-center">
        <div class="col-lg-1 p-1 m-n1">
          <img class="img-fluid rounded-circle" src={props.user.avatar.link} />
        </div>
        <div class="col-lg-11">
          <h5 class="card-title username text-truncate w-100">{props.user.name}</h5>
          <div class="text-truncate">
            <span class="text-secondary user-id">{props.user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

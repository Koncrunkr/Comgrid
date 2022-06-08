import { useTheme } from '../../../theme/Theme';
import { Table } from '../../../table/Table';
import { ModalItem } from '../../../common/ModalItem';
import { InvitationLinkItem } from './InvitationLinkItem';
import { UsersInfoItem } from './UsersInfoItem';
import { AddUserToTableItem } from './AddUserToTableItem';

export const TableInfoItem = (props: { table: () => Table | undefined }) => {
  const [theme] = useTheme();

  return (
    <>
      <button
        class="btn"
        data-toggle="modal"
        data-target="#table_info_menu"
        style={{
          'background-color': theme().colors.button.background,
          color: theme().colors.button.text,
          'margin-left': '1rem',
        }}
      >
        {props.table()?.name}
      </button>
      <ModalItem formId="table_info">
        <InvitationLinkItem />
        <UsersInfoItem users={props.table()?.participants} />
        <AddUserToTableItem />
      </ModalItem>
    </>
  );
};

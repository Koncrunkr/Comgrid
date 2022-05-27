import { Theme, useTheme } from '../../theme/Theme';
import { createEffect } from 'solid-js';

export const IndexPage = () => {
  const [theme] = useTheme();
  createEffect(
    (theme: () => Theme) => console.log(theme().colors.invertedBackground),
    theme,
  );
  return (
    <main>
      <div class="container w-75 h-100 my-w-lg-50">
        <div
          class="no-deletable card container mt-2"
          style={{
            'background-color': theme().colors.invertedBackground,
            color: theme().colors.invertedText,
          }}
        >
          <div class="card-body row p-2 align-items-center">
            <div class="ml-1 pl-0 col">Мои чаты</div>
            <div class="col text-right">
              <button
                class="btn btn-sm btn-light"
                data-toggle="modal"
                data-target="#create-table-menu"
              >
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="chat-container scrolling-element overflow-auto"></div>
      </div>
    </main>
  );
};

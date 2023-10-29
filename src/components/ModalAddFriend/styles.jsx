import styled from "styled-components";

export const Wraper = styled.div``;

export const Container = styled.div`
  .modal-overlay {
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    inset: 0 0 0 0;
    animation-name: fadeIn;
    animation-duration: 0.2s;
    user-select: none;
    .modal-container {
      padding: 0px 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      .modal-content {
        animation-name: zoom;
        animation-duration: 0.5s;
        position: absolute;
        width: 374px;
        max-width: 100%;
        z-index: 2;
        border-radius: 4px;
        background-color: #fff;
        &__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 8px 0 16px;
          font-size: 16px;
          font-weight: 500;
          height: 48px;
          min-height: 48px;
          border-bottom: 1px solid var(--boder-dividing-color);
          .icon-close {
            width: 30px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border-radius: 50%;
            cursor: pointer;
            &:hover {
              background-color: #f1f1f1;
            }
            i {
              font-size: 20px;
              color: #858282;
            }
          }
        }
        &__content {
          position: relative;
          .box-image {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: -40px;
            margin-bottom: 16px;
            .box-image__item {
              position: relative;
            }
            .photo-avatar {
              width: 90px;
              height: 90px;
              border: 2px solid #fff;
              border-radius: 50%;
              bottom: -36px;
              left: 0;
              right: 0;
              margin: 0 auto;
              object-fit: cover;
            }
            .display-name {
              font-weight: 500;
              font-size: 18px;
              margin-top: 12px;
              text-align: center;
            }
          }
          .photo-cover {
            width: 100%;
            height: 130px;
            object-fit: cover;
          }
          .box-area-edit {
            padding: 0 16px;
            margin-bottom: 16px;
            position: relative;
            .area-edit {
              width: 100%;
              height: 110px;
              font-size: 14px;
              padding: 10px;
              user-select: text;
              border: 1px solid var(--boder-dividing-color);
              outline: none !important;
              border-radius: 5px;
              resize: none; /* Tắt tính năng co giãn */
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
                "Droid Sans", "Helvetica Neue", sans-serif;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
              flex: 1;
              overflow: hidden;
              overflow-y: auto;
              ::-webkit-scrollbar {
                width: 14px;
              }
              ::-webkit-scrollbar-thumb {
                border: 5px solid rgba(0, 0, 0, 0);
                background-clip: padding-box;
                border-radius: 8px;
                background-color: #aaaaaa;
              }
            }
            .tracking-text-length{
              position: absolute;
              right: 0;
              bottom: 0;
              margin-bottom: 10px;
              margin-right: 30px;
              color: #7589A3;
            }
          }
          .block-view-logs {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 0 16px 20px;
            background-color: #f1f1f1;
            height: 44px;
            padding: 0 16px;
            border-radius: 3px;
            i.btn-off {
              font-size: 28px;
              color: #b1b5b9;
              cursor: pointer;
            }
            i.btn-on {
              font-size: 28px;
              color: #0068ff;
              cursor: pointer;
            }
          }
        }
        &__footer {
          height: 68px;
          padding: 14px 16px;
          border-top: 1px solid var(--boder-dividing-color);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          > * {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 3px;
            padding: 0 16px;
          }
          .btn-view-info {
            background-color: #eaedf0;
            color: #081c36;
            margin-right: 8px;
            cursor: pointer;
            &:hover {
              background-color: #dfe2e7;
            }
          }
          .btn-add-friend {
            color: #fff;
            background-color: #0091ff;
            pointer-events: auto;
            cursor: pointer;
            &:hover {
              opacity: 0.9;
            }
          }
        }
      }
    }
  }
`;

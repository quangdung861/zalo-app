import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .phonebook {
    display: flex;
    .section-left {
      user-select: none;
      min-width: 350px;
      height: 100vh;
      border-right: 1px solid var(--boder-dividing-color);
      &__header {
        display: flex;
        align-items: center;
        padding: 0 16px;
        height: 64px;
        gap: 4px;
        .search {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 4px;
          height: 32px;
          border-radius: 4px;
          background-color: rgb(234, 237, 240);
          overflow: hidden;
          padding: 0px 10px;
          > input {
            height: 32px;
            border: none;
            background-color: rgb(234, 237, 240);
            outline: none;
            width: 100%;
          }
        }
        .icon {
          font-size: 16px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          cursor: pointer;
          color: #7a7979;
          :hover {
            background-color: #dfe2e7;
          }
        }
      }
      &__content {
        .content-list {
          .content-item {
            height: 56px;
            padding: 0 12px;
            line-height: 56px;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            > i {
              width: 24px;
            }
            :hover {
              background-color: #f1f1f1;
            }
          }
          .content-item--active {
            background-color: rgb(229, 239, 255);
            :hover {
              background-color: rgb(229, 239, 255);
            }
          }
        }
      }
    }
    .section-right {
      flex: 1;
    }
  }
`;

import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .friendlist {
    .friendlist-header {
      height: 65px;
      padding: 0 19px;
      line-height: 65px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      border-bottom: 1px solid var(--boder-dividing-color);
      user-select: none;
      > i {
        width: 24px;
      }
    }
    .friendlist-content {
      padding: 0 12px;
      min-height: 100vh;
      background-color: #f1f1f1;
      .total-friends {
        height: 64px;
        line-height: 64px;
        font-weight: 500;
      }
      .filter-friends {
        height: 64px;
        line-height: 64px;
        padding: 0 16px;
        background-color: #fff;
      }
      .list-friends {
        background-color: #fff;
        .item-friend {
          height: 72px;
          padding: 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
          cursor: pointer;
          &__left {
            display: flex;
            align-items: center;
            gap: 12px;
            > img {
              border-radius: 50%;
              object-fit: cover;
              width: 48px;
              height: 48px;
            }
          }
          &__right {
            width: 32px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            > i {
              color: #7589a3;
            }
            :hover {
              background-color: #dfe2e7;
            }
          }
          :hover {
            background-color: #f1f1f1;
          }
        }
        .item-friend:not(:last-child):before {
          content: "";
          position: absolute;
          right: 0;
          bottom: 0;
          width: calc(100% - 72px);
          border-bottom: 1px solid var(--boder-dividing-color);
        }
      }
    }
  }
`;

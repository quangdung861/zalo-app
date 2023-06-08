import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .friendlist {
    user-select: none;
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
        border-top-right-radius: 4px;
        border-top-left-radius: 4px;
        background-color: #fff;
      }
      .list-friends {
        background-color: #fff;
        border-bottom-right-radius: 4px;
        border-bottom-left-radius: 4px;
        .item-friend {
          height: 72px;
          padding: 0 16px;
          position: relative;
          cursor: pointer;
          &__left {
            height: 72px;
            display: flex;
            align-items: center;
            gap: 12px;
            > img {
              border-radius: 50%;
              object-fit: cover;
              width: 48px;
              height: 48px;
            }
            > span {
              font-size: 16px;
              font-weight: 500;
            }
          }
          &__right {
            width: 32px;
            height: 32px;
            position: absolute;
            right: 0;
            top: 20px;
            right: 16px;
            /* display: flex;
            justify-content: center;
            align-items: center; */
            border-radius: 4px;
            > i {
              width: 32px;
              height: 32px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #7589a3;
            }
            :hover {
              background-color: #dfe2e7;
            }
          }
          .dropdown-menu {
            z-index: 1;
            width: 170px;
            padding: 8px 0;
            position: absolute;
            top: 32px;
            right: 0;
            background-color: #fff;
            box-shadow: var(--box-shadow-default);
            border-radius: 4px;
            &__item {
              height: 36px;
              line-height: 36px;
              padding: 0 8px;
              :hover {
                background-color: #f1f1f1;
              }
            }
            .divding-line {
              border-bottom: 1px solid var(--boder-dividing-color);
              margin: 0px 8px;
            }
            .unfriend {
              color: rgb(211, 14, 14);
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
        .container-empty {
          margin: 0 auto;
          padding: 62px 0;
          background-color: #f1f1f1;
          text-align: center;
          > img {
            margin-bottom: 12px;
          }
          > div {
            font-weight: 500;
            color: #97a4b5;
          }
        }
      }
    }
  }
`;

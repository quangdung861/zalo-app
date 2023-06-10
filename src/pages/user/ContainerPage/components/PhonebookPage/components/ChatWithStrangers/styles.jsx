import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  user-select: none;
  .strangerlist {
    user-select: none;
    .strangerlist-header {
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
    .strangerlist-content {
      max-height: calc(100vh - 65px);
      min-height: calc(100vh - 65px);
      padding: 0 16px;
      background-color: #f1f1f1;
      overflow: hidden;
      overflow-y: auto;
      &::-webkit-scrollbar {
        -webkit-appearance: none;
      }
      &::-webkit-scrollbar:vertical {
        width: 8px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 10px;
      }
      .total-strangers {
        height: 64px;
        line-height: 64px;
        font-weight: 500;
      }
      .filter-strangers {
        height: 64px;
        line-height: 64px;
        padding: 0 16px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        background-color: #fff;
      }
      .list-strangers {
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        background-color: #fff;
        margin-bottom: 24px;
        .item-stranger {
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
            flex: 1;
            gap: 12px;
            > img {
              border-radius: 50%;
              object-fit: cover;
              width: 48px;
              height: 48px;
            }
            > span {
              font-weight: 500;
              font-size: 16px;
            }
          }
          &__right {
            width: 32px;
            height: 32px;
            position: absolute;
            right: 0;
            top: 20px;
            right: 16px;
            border-radius: 4px;
            > i {
              width: 32px;
              height: 32px;
              display: flex;
              justify-content: center;
              align-items: center;
              color: #7589a3;
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
              .add-friend {
                color: #1b9c85;
              }
            }
            :hover {
              background-color: #dfe2e7;
            }
          }
          :hover {
            background-color: #f1f1f1;
          }
        }
        .item-stranger:not(:last-child):before {
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

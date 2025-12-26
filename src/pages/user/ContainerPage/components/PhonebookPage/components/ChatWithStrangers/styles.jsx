import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .strangerlist {
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
      .btn-come-back {
        display: none;
        min-width: 32px;
        min-height: 32px;
        border-radius: 50%;
        margin-right: 8px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover {
          background-color: #f1f1f1;
        }
      }
      > i {
        width: 24px;
      }
    }
    .strangerlist-content {
      max-height: calc(100dvh - 65px);
      min-height: calc(100dvh - 65px);
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
        width: 100%;
        height: 64px;
        padding: 0 16px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        background-color: #fff;
        display: flex;
        align-items: center;
        gap: 12px;
        .filter-item {
          height: 32px;
          flex: 1;
          position: relative;
        }
        .search {
          border: 1px solid #ccc;
          border-radius: 4px;
          height: 32px;
          display: flex;
          align-items: center;
          > input {
            width: 100%;
            border: none;
            height: 32px;
            padding: 0 6px;
            background-color: transparent;
            outline: none;
            color: #7589a3;
          }
          > i {
            padding: 0 6px;
            color: #7589a3;
          }
        }
        .asc-desc-order {
          &__current {
            display: flex;
            align-items: center;
            border-radius: 4px;
            height: 32px;
            background-color: #eaedf0;
            cursor: pointer;
            > i {
              padding: 0 12px;
            }
            > span {
              flex: 1;
            }
            &:hover {
              filter: brightness(95%);
            }
          }
          &__current--active {
            background-color: #e5efff;
            * {
              color: #005ae0;
            }
          }
          &__dropdown {
            width: 100%;
            position: absolute;
            top: 38px;
            background-color: #fff;
            box-shadow: var(--box-shadow-default);
            border-radius: 4px;
            padding: 8px 0;
            z-index: 2;
            > * {
              height: 36px;
              padding: 0 12px;
              line-height: 36px;
              .pick {
                width: 24px;
                display: inline-block;
                > i {
                  padding-right: 12px;
                }
              }

              &:hover {
                cursor: pointer;
                background-color: #f1f1f1;
              }
            }
            .asc-filter {
            }
            .desc-filter {
            }
          }
        }
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
            overflow: hidden;
            text-overflow: ellipsis;
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
  @media only screen and (max-width: 992px) {
    .strangerlist {
      .strangerlist-header {
        .btn-come-back {
          display: flex;
        }
      }
    }
  }
`;

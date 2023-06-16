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
        .category-order {
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
            &:hover {
              filter: brightness(95%);
              cursor: pointer;
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

            .filter-category {
              position: relative;
              display: flex;
              justify-content: space-between;
              align-items: center;
              &__dropdown {
                display: none;
                position: absolute;
                padding: 8px 0;
                top: 0px;
                right: calc(100% + 4px);
                background-color: #fff;
                width: 190px;
                box-shadow: var(--box-shadow-default);
                border-radius: 4px;
                .category-dropdown-item {
                  padding: 0 12px;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  > i {
                    margin-right: 12px;
                  }
                  &:hover {
                    background-color: #f1f1f1;
                    cursor: pointer;
                  }
                }
              }
              &__dropdown--active {
                display: block;
              }
            }
            > * {
              height: 36px;
              padding: 0 12px;
              line-height: 36px;
              > i {
                padding-right: 12px;
              }
              &:hover {
                background-color: #f1f1f1;
                cursor: pointer;
              }
            }
          }
        }
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
            > .box-info {
              > span {
                font-size: 16px;
                font-weight: 500;
              }
              > div {
                margin-top: 4px;
              }
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

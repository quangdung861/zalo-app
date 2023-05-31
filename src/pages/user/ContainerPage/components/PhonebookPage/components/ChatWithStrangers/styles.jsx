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
      padding: 0 12px;
      min-height: 100vh;
      background-color: #f1f1f1;
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
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            position: relative;
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
  .modal-overlay {
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    inset: 0 0 0 0;
  }
  .container-account-info {
    padding: 0px 12px;
    .account-info {
      position: absolute;
      height: 95vh;
      width: 352px;
      max-width: 100%;
      top: 20px;
      left: 0;
      right: 0;
      margin: 0 auto;
      z-index: 2;
      border-radius: 6px;
      background-color: #fff;
      .title {
        height: 48px;
        padding: 0 8px 0 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 500;
        font-size: 16px;
        > i {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          :hover {
            background-color: #f1f1f1;
          }
        }
      }
      .box-account-info {
        max-height: calc(95vh - 48px);
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
        .header {
          position: relative;
          .box-image {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: -40px;
            .photo-avatar {
              width: 72px;
              height: 72px;
              border: 2px solid #fff;
              border-radius: 50%;
              bottom: -36px;
              left: 0;
              right: 0;
              margin: 0 auto;
            }
            .display-name {
              font-weight: 500;
              font-size: 18px;
              margin-top: 12px;
            }
            .btn-texting {
              height: 32px;
              line-height: 32px;
              font-size: 16px;
              font-weight: 500;
              background-color: #f1f1f1;
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 4px;
              width: 50%;
              margin-top: 16px;
              margin-bottom: 16px;
              cursor: pointer;
              :hover {
                filter: brightness(95%);
              }
            }
          }
          .photo-cover {
            width: 100%;
            height: 130px;
            object-fit: cover;
          }
        }
        .content {
          padding-left: 20px;
          border-top: 8px solid #eef0f1;
          .title {
            margin: 14px 0;
            font-weight: 500;
          }
          .content-detail {
            &__item {
              display: flex;
              align-items: center;
              margin-bottom: 14px;
              .label {
                width: 110px;
                min-width: 110px;
                color: #7589a3;
              }
            }
          }
        }
        .footer {
          border-top: 8px solid #eef0f1;
          .action-list {
            .action-item {
              padding-left: 20px;
              height: 48px;
              display: flex;
              align-items: center;
              position: relative;
              cursor: pointer;
              > i {
                font-size: 16px;
                margin-right: 4px;
                width: 28px;
              }
              :hover {
                background-color: #f1f1f1;
              }
            }
            .action-item:not(:last-child)::before {
              content: "";
              position: absolute;
              right: 0;
              bottom: 0;
              width: calc(100% - 50px);
              border-bottom: 1px solid var(--boder-dividing-color);
            }
          }
        }
      }
    }
  }
`;

import styled from "styled-components";

import bgInstead from "assets/avatar-mac-dinh-1.png";

export const Wrapper = styled.div`
  width: 100%;
`;

export const Container = styled.div`
  width: 100%;
  user-select: none;
  z-index: 98;
  .message {
    display: flex;
    width: 100%;
    .section-left {
      min-width: var(--section-left-width);
      height: 100vh;
      border-right: 1px solid var(--boder-dividing-color);
      transition: min-width 0.3s ease;
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
        .menu {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 16px 8px 16px;
          border-bottom: 1px solid var(--boder-dividing-color);
          position: relative;
          &__left {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            .menu-left__item {
              cursor: pointer;
              :hover {
                color: #005ae0;
              }
            }
          }
          &__right {
            display: flex;
            align-items: center;
            gap: 4px;
            .menu-right__item {
              cursor: pointer;
              border-radius: 20px;
              padding: 2px 10px;
              &:hover {
                background-color: #f1f1f1;
              }
            }
            .menu-right__item--more {
              border-radius: 50%;
              padding: 0;
              width: 22px;
              height: 22px;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .category-dropdown {
              position: absolute;
              top: 32px;
              background-color: #fff;
              border-radius: 4px;
              padding: 8px 0;
              box-shadow: var(--box-shadow-default);
              z-index: 99;
              &__item {
                width: 190px;
                height: 40px;
                padding: 0 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                > i {
                  font-size: 16px;
                }
                &:hover {
                  cursor: pointer;
                  background-color: #f1f1f1;
                }
              }
            }
          }
          .dividing-selected {
            width: ${({ width }) => width && `${width}px`};
            left: ${({ left }) => left && `${left}px`};
            height: 2px;
            background-color: #005ae0;
            position: absolute;
            bottom: 0;
            transition: all 0.3s;
          }
        }
        .room-list {
          height: calc(100vh - 64px - 32px);
          position: relative;
          overflow-y: scroll;
          overflow-x: visible;
          position: relative;
          &::-webkit-scrollbar {
            -webkit-appearance: none;
          }
          &::-webkit-scrollbar:vertical {
            width: 0px;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
          }
          .container-room-item {
            position: relative;
            .room-item {
              height: 72px;
              padding: 0 16px;
              /* background-color: #ccc; */
              display: flex;
              align-items: center;
              justify-content: space-between;
              cursor: pointer;
              position: relative;
              &__left {
                display: flex;
                align-items: center;
                gap: 12px;
                flex: 1;
                > img {
                  width: 48px;
                  flex-shrink: 0;
                  height: 48px;
                  object-fit: cover;
                  border-radius: 50%;
                }

                .info {
                  .room-name {
                    font-size: 16px;
                    font-weight: 500;
                    margin-bottom: 6px;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 160px;
                    text-overflow: ellipsis;
                  }
                  .new-message {
                    color: #7589a3;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 160px;
                    text-overflow: ellipsis;
                    &__author {
                      color: #7589a3;
                    }
                    &__text {
                      color: #7589a3;
                    }
                  }
                }
              }
              &__right {
                height: 100%;
                padding-top: 12px;
                font-size: 12px;
                color: #7589a3;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                .icon-tagname {
                  color: #005ae0;
                  font-size: 20px;
                  margin-top: 3px;
                }
                .unseen {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 16px;
                  height: 16px;
                  font-size: 12px;
                  line-height: 12px;
                  margin-top: 8px;
                  border-radius: 50%;
                  color: #fff;
                  background-color: #c31818;
                }
              }
              :hover {
                background-color: #f1f1f1;
              }
            }
            .dropdown-menu {
              background-color: #fff;
              width: 220px;
              position: absolute;
              right: 0px;
              top: 12px;
              border-radius: 4px;
              box-shadow: var(--box-shadow-default);
              padding: 8px 0px;
              z-index: 11;
              .menu-item {
                padding: 0 8px;
                height: 36px;
                display: flex;
                align-items: center;
                padding: 12px;
                > i {
                  margin-right: 16px;
                  font-size: 16px;
                  color: rgb(117, 137, 163);
                }
                :hover {
                  cursor: pointer;
                  background-color: #f1f1f1;
                }
              }
            }

            .btn-show-option {
              display: none;
              width: 24px;
              height: 24px;
              position: absolute;
              right: 10px;
              top: 10px;
              justify-content: center;
              align-items: center;
              border-radius: 4px;
              cursor: pointer;
              z-index: 10;
              &:hover {
                background-color: #e3e0e0;
              }
            }

            &:hover {
              .btn-show-option {
                display: flex;
              }
              .room-item {
                &__right {
                  .date {
                    visibility: hidden;
                  }
                }
              }
            }
          }

          .room-item--active {
            background-color: #e5efff;
            :hover {
              background-color: #e5efff;
            }
          }

          .btn-show-option--active:hover {
            &:hover {
              background-color: #c6daf8;
            }
            > i {
              color: #005ae0;
            }
          }

          .notification-compatible {
            user-select: none;
            width: 93%;
            max-width: 324px;
            position: sticky;
            z-index: 98;
            margin: 0 auto;
            top: 436px;
            bottom: 16px;
            left: 0;
            right: 0;
            background-color: #fff;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: var(--box-shadow-default);
            &__header {
              > img {
                width: 100%;
                height: 150px;
                object-fit: cover;
              }
            }
            &__content {
              padding: 6px 12px 12px 12px;
              .title {
                font-weight: 500;
                margin-bottom: 8px;
              }
              .description {
                margin-bottom: 16px;
              }
              .footer {
                display: flex;
                justify-content: flex-end;
                .remind-me-later-btn {
                  background-color: #eaedf0;
                  display: inline-block;
                  padding: 2px 20px;
                  border-radius: 4px;
                  font-weight: 500;
                  margin-right: 12px;
                  &:hover {
                    opacity: 0.9;
                    cursor: pointer;
                  }
                }
                .dowload-now {
                  font-weight: 500;
                  > i {
                    margin-left: 5px;
                    color: #005ae0;
                  }
                  > span {
                    color: #005ae0;
                  }
                  &:hover {
                    opacity: 0.9;
                    cursor: pointer;
                  }
                }
              }
            }
          }
          .empty-message {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            > img {
              margin: 30px 12px 16px;
              width: 120px;
              height: 120px;
            }
            > span {
              color: #7589a3;
              font-weight: 500;
            }
            .btn-tag {
              background-color: #e5efff;
            }
            .btn-tag:hover {
              background-color: #c7e0ff;
            }
          }
        }
      }
    }
    .section-right {
      flex: 1;
      .content-welcome {
        padding: 0 16px;
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 0 auto;
        user-select: none;
        &__header {
          width: 380px;
          max-width: 100%;
          margin-bottom: 24px;
          h2 {
            margin-bottom: 18px;
          }
        }
        .slide-list {
          display: grid; // có cái này slide mới chuẩn kích thước
          width: 90%;
          .slide-item {
            .slide-item__image {
              display: flex;
              justify-content: center;
              > img {
                max-width: 380px;
                width: 100%;
                height: auto;
                object-fit: cover;
              }
            }
            .slide-item__text {
              .title {
                font-size: 18px;
                font-weight: 500;
                color: #005ae0;
                margin: 16px 0;
              }
              .description {
                padding: 0 30px;
                margin-bottom: 12px;
              }
            }
          }
          .next-arrow-slide {
            z-index: 1;
            position: absolute;
            inset: 120px -16px auto auto;
            width: 32px;
            height: 32px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            cursor: pointer;
            i {
              font-size: 12px;
            }
          }

          .prev-arrow-slide {
            z-index: 1;
            position: absolute;
            inset: 120px auto auto -16px;
            width: 32px;
            height: 32px;
            background-color: #fff;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
            cursor: pointer;
            i {
              font-size: 12px;
            }
          }

          .next-arrow-slide,
          .prev-arrow-slide {
            &:hover {
              i {
                color: #000;
                transition: all 0.1s ease;
                transform: scale(1.1);
              }
            }
          }
        }
      }
    }

    @media only screen and (max-width: 768px) {
      .section-left {
        display: ${({ isShowBoxChatGroup, isShowBoxChat }) =>
          isShowBoxChat || isShowBoxChatGroup ? "none" : "block"};
      }
      .section-right {
        display: none;
      }
    }
  }

  @media only screen and (max-width: 992px) {
    .message {
      .section-left {
        min-width: 100%;
        display: ${({ isShowBoxChatGroup, isShowBoxChat }) =>
          isShowBoxChat || isShowBoxChatGroup ? "none" : "block"};

        &__content {
          .room-list {
            .notification-compatible {
              margin: 0 0 0 auto;
              right: 12px;
            }
          }
        }
      }
    }
  }
`;

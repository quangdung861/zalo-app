import styled from "styled-components";

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
            gap: 10px;
            .menu-right__item {
              cursor: pointer;
            }
          }
        }
        .room-list {
          height: calc(100vh - 64px - 32px);
          position: relative;
          overflow: hidden;
          overflow-y: auto;
          &::-webkit-scrollbar {
            -webkit-appearance: none;
          }
          &::-webkit-scrollbar:vertical {
            width: 0px;
          }
          &::-webkit-scrollbar-thumb {
            border-radius: 10px;
          }
          .room-item {
            height: 72px;
            padding: 0 16px;
            /* background-color: #ccc; */
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            &__left {
              display: flex;
              align-items: center;
              gap: 12px;
              flex: 1;
              > img{
                width: 48px;
                flex-shrink: 0;
                height: 48px;
                object-fit: cover;
                border-radius: 50%;
              }
              > .image-temporary {
                width: 48px;
                flex-shrink: 0;
                height: 48px;
                border-radius: 50%;
                background-color: red;
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
              align-items: end;
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
          .room-item--active {
            background-color: #e5efff;
            :hover {
              background-color: #e5efff;
            }
          }
          .notification-compatible {
            user-select: none;
            width: 93%;
            position: absolute;
            z-index: 98;
            margin: 0 auto;
            left: 0;
            right: 0;
            bottom: 14px;
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
                justify-content: end;
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
  }

  @media only screen and (max-width: 992px) {
    .message {
      .section-left {
        display: none;
      }
    }
  }
`;

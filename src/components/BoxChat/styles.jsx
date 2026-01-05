import styled from "styled-components";
import messageBg from "assets/messageBg.jpg";
import cloudBg from "assets/cloudBg.jpg";

export const Wrapper = styled.div`
  min-width: calc(100% - var(--section-left-width) - var(--sidebar-width));
  @media only screen and (max-width: 992px) {
    min-width: calc(100% - var(--sidebar-width));
  }
`;

export const Container = styled.div`
  .box-chat {
    --header-height: 68px;
    --footer-height: ${(props) => (props.isReplyMessage ? "187px" : "105px")};
    position: relative;
    &__header {
      height: var(--header-height);
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
      z-index: 100;
      .left {
        display: flex;
        align-items: center;
        max-width: 100%;
        width: 380px;
        overflow: hidden;
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
        .avatar {
          position: relative;
          > img {
            border-radius: 50%;
            width: 48px;
            height: 48px;
            margin-right: 12px;
            object-fit: cover;
            cursor: pointer;
            &:hover {
              opacity: 0.9;
            }
          }
          > i {
            position: absolute;
            bottom: 5px;
            right: 9px;
            font-size: 11px;
            color: #37b361;
          }
        }
        .user-info {
          white-space: nowrap;
          .display-name {
            font-size: 18px;
            margin-bottom: 2px;
            font-weight: 500;
          }
          .new-seperator {
            background: #d6dbe1;
            height: 12px;
            width: 1px;
            min-width: 1px;
            margin: 0 6px;
            display: inline-block;
          }
          .last-time {
            display: flex;
            align-items: center;
            font-weight: 500;
            color: #7589a3;
            .category {
              .category-icon {
                color: #7589a3;
                font-size: 16px;
                &:hover {
                  cursor: pointer;
                  color: #005ae0;
                }
              }
              .category-dropdown {
                position: absolute;
                z-index: 99;
                top: 62px;
                background-color: #fff;
                border-radius: 4px;
                padding: 8px 0;
                box-shadow: var(--box-shadow-default);
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
            .online,
            .offline {
              > span {
                color: #7589a3;
              }
            }
          }
        }
      }
      .right {
        display: flex;
        gap: 4px;
        padding-left: 16px;
        .box-icon {
          width: 32px;
          height: 32px;
          border-radius: 6px;
          > i {
            width: 32px;
            height: 32px;
            font-size: 16px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            color: #7589a3;
            cursor: pointer;
            :hover {
              background-color: #f1f1f1;
            }
          }
        }
      }
    }
    &__content {
      position: relative;
      max-width: 100%;
      overflow-x: hidden;
      width: 100%;
      padding-top: 20px;
      background-image: url(${(props) => (props.isCloud ? cloudBg : messageBg)});
      background-blend-mode: multiply;
      background-color: rgba(
        ${(props) => (props.isCloud ? "0, 0, 0, 0.05" : "0, 0, 0, 0.15")}
      );
      background-size: cover;
      background-repeat: no-repeat;
      height: calc(100dvh - var(--header-height) - var(--footer-height));
      .message-view-blur-overlay {
      }
      max-height: calc(100dvh - var(--header-height) - var(--footer-height));
      .message-view-blur-overlay {
      }
      /* overflow: hidden; */
      overflow-y: overlay;
      &::-webkit-scrollbar {
        -webkit-appearance: none;
      }
      &::-webkit-scrollbar:vertical {
        width: 0px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
      }
      /* display: flex;
      flex-direction: column;
      justify-content: flex-end; */

      .suggest-add-friend {
        height: 51px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        background-color: #fff;
        overflow: hidden;
        padding: 8px 16px;
        border-top: 1px solid var(--boder-dividing-color);
        border-bottom: 1px solid var(--boder-dividing-color);
        margin-top: -20px;
        margin-bottom: 20px;
        .left {
          display: flex;
          align-items: center;
          gap: 8px;
          span {
            font-size: 13px;
          }
          i {
            font-size: 14px;
          }
        }
        .right {
          .btn-add-friend {
            background-color: #eaedf0;
            font-weight: 600;
            height: 24px;
            line-height: 24px;
            padding: 0 16px;
            border-radius: 3px;
            white-space: nowrap;
            cursor: pointer;
            &:hover {
              background-color: #dfe2e7;
            }
            @media only screen and (max-width: 992px) {
              ::after {
                content: "Kết bạn"
              }
            }
          }
        }
      }

      .user-info {
        text-align: center;
        user-select: none;
        &__avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 8px;
        }
        &__name {
          font-size: 20px;
          font-weight: 500;
          margin-bottom: 2px;
        }
        &__description {
          margin-bottom: 10px;
        }
      }

      .created-room {
        margin-bottom: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        .format-date {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 4px 10px 6px 10px;
          background-color: rgba(0, 0, 0, 0.2);
          color: #f1f1f1;
          border-radius: 16px;
          font-size: 12px;

          user-select: none;
        }
      }
      .message-item {
        width: 100%;
        .modal-emoji-overlay {
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
            position: fixed;
            inset: 0 0 0 0;
            .modal-content {
              animation-name: zoom;
              animation-duration: 0.5s;
              position: absolute;
              /* height: 97dvh; */
              /* min-height: 60px; */
              width: 450px;
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
                padding: 12px 0;
                height: 280px;
                overflow: hidden;
                overflow-y: scroll;
                &::-webkit-scrollbar {
                  -webkit-appearance: none;
                }
                &::-webkit-scrollbar:vertical {
                  width: 4px;
                }
                &::-webkit-scrollbar-thumb {
                  border-radius: 10px;
                }
                .reaction-item {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 0 16px;
                  gap: 10px;
                  &__left {
                    display: flex;
                    align-items: center;
                    width: 220px;
                    max-width: 100%;
                    overflow: hidden;
                    > span {
                      text-overflow: ellipsis;
                      overflow: hidden;
                      white-space: nowrap;
                    }
                    > img {
                      width: 36px;
                      height: 36px;
                      object-fit: cover;
                      border-radius: 50%;
                      margin-right: 12px;
                      flex-shrink: 0;
                    }
                  }
                  &__right {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    min-width: 160px;
                    > img {
                      width: 20px;
                      height: 20px;
                      margin-right: 8px;
                      object-fit: contain;
                    }
                  }
                }
                .reaction-item:not(:last-child) {
                  margin-bottom: 12px;
                }
                .filter-category-list {
                  display: flex;
                  justify-content: start;
                  align-items: center;
                  padding: 4px 16px 16px;
                  margin-bottom: 16px;
                  gap: 10px;
                  border-bottom: 1px solid var(--boder-dividing-color);
                  position: relative;
                  .filter-category-item {
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    color: #476285;
                    font-weight: 600;
                    font-size: 14px;
                    position: relative;
                    white-space: nowrap;
                    cursor: pointer;
                    > img {
                      width: 20px;
                      height: 20px;
                      object-fit: contain;
                      margin-right: 6px;
                    }
                    .dividing-bottom {
                      width: 0;
                      height: 2px;
                      background-color: #005ae0;
                      position: absolute;
                      top: 0;
                      margin-top: 33px;
                      transition: all 0.3s;
                    }
                    .dividing-bottom.clicked {
                      width: 100%;
                      transition: all 0.3s;
                    }
                  }
                  .filter-category-item.clicked {
                    color: #005ae0;
                  }
                }
              }
            }
          }
        }
        &__myself {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: flex-end;
          margin-bottom: 6px;
          margin-right: 8px;
          position: relative;
          .box-image {
            height: 100%;
            display: flex;
            align-items: flex-start;
            margin-right: 15px;
            > img.avatar {
              width: 40px;
              height: 40px;
              object-fit: cover;
              border-radius: 50%;
              margin-right: 4px;
              margin-left: 12px;
              border: 1px solid #fff;
              user-select: none;
              object-fit: cover;
            }
            > .text {
              font-size: 15px;
              line-height: 1.5rem;
              background-color: #e5efff;
              border-radius: 8px;
              padding: 14px;
              max-width: 300px;
              text-align: left;
              min-width: 115px;
              min-height: 83px;
              word-break: break-word;
              position: relative;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
              .dropdown-username-reaction {
                position: absolute;
                max-width: 200px;
                max-height: 100px;
                background-color: #081c35;
                left: 48px;
                top: 100%;
                margin-top: -8px;
                color: #fff;
                padding: 6px 20px;
                border-radius: 4px;
                user-select: none;
                z-index: 10;
                .reaction-userName {
                  font-size: 12px;
                  color: #fff;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }
              > img.image-item {
                cursor: pointer;
              }
              .reply-content {
                padding: 10px 9px 10px 12px;
                margin-bottom: 8px;
                border-radius: 6px;
                background-color: #c7e0ff;
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
                &__left {
                  width: 3px;
                  min-width: 3px;
                  height: 40px;
                  margin-right: 8px;
                  background-color: #3989ff;
                }
                .image-reply {
                  width: 40px;
                  height: 40px;
                  object-fit: cover;
                  margin-right: 8px;
                  border-radius: 2px;
                }
                &__right {
                  .subcription {
                    > * {
                      margin-right: 2px;
                    }
                    .name {
                      font-size: 13px;
                      font-weight: 600;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }
                  .content {
                    font-size: 14px;
                    margin-top: -2px;
                    color: #476285;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                }
              }
              .box-date {
                text-align: left;
              }
              .reaction-emoji {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                user-select: none;
                .emoji-newest {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 50%;
                  border: 0.5px solid var(--boder-dividing-color);
                  padding: 5px;
                  background-color: #fff;
                  cursor: pointer;
                  > img {
                    width: 16px;
                    object-fit: cover;
                  }
                  > span {
                    font-size: 14px;
                  }
                }
                .total-emoji {
                  display: flex;
                  position: relative;
                  margin: 0 5px;
                  padding: 1px 10px;
                  cursor: pointer;
                  border: 0.5px solid var(--boder-dividing-color);
                  border-radius: 15px;
                  white-space: nowrap;
                  align-items: center;
                  z-index: 4;
                  gap: 4px;
                  background-color: #fff;
                  > img {
                    width: 16px;
                    object-fit: cover;
                  }
                }
              }
              .box-emoji {
                position: absolute;
                bottom: 0;
                left: -140px;
                z-index: 4;
                user-select: none;
                width: auto;
                height: auto;
                .btn-emoji {
                  width: 26px;
                  height: 26px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 50%;
                  background-color: #fff;
                  border: 1px solid var(--boder-dividing-color);
                  cursor: pointer;
                  position: absolute;
                  bottom: -14px;
                  right: -174px;
                  > i {
                    font-size: 14px;
                    color: #7589a3;
                  }
                }
                .btn-emoji-hidden {
                  display: none;
                }
                .dropdown-emoji-list {
                  /* visibility: hidden; */
                  /* transition-delay: 1s;  */
                  position: absolute;
                  bottom: 15px;
                  left: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 12px;
                  padding: 6px 18px;
                  background-color: #fff;
                  border: 1px solid var(--boder-dividing-color);
                  border-radius: 30px;
                  .emoji-item {
                    width: 24px;
                    height: auto;
                    object-fit: cover;
                    cursor: pointer;
                    &:hover {
                      transform: scale(1.2);
                      transition: transform 0.1s ease;
                    }
                  }
                  .btn-close {
                    color: #7589a3;
                    cursor: pointer;
                  }
                  /* &:hover {
                    visibility: visible;
                  } */
                }

                /* .btn-emoji:hover + .dropdown-emoji-list {
                  visibility: visible;
                } */
              }

              .message-reply {
                background-color: #c7e0ff;
                border-radius: 6px;
                padding: 10px 9px 10px 12px;
                -webkit-line-clamp: 1;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-bottom: 10px;
              }
            }
          }

          .container-options {
            position: relative;
            .myself-options {
              margin: 0 12px 16px 0px;
              background-color: rgba(255, 255, 255, 0.3);
              border-radius: 6px;
              height: 22px;
              padding: 2px 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              visibility: hidden;
              > i {
                font-size: 16px;
                padding: 6px;
                color: rgb(117, 137, 163);
                cursor: pointer;
                &:hover {
                  color: rgb(3, 92, 224);
                }
              }
            }
            .recall {
              > i:hover {
                color: #d91b1b;
              }
            }
            .dropdown-menu {
              background-color: #fff;
              width: 220px;
              position: absolute;
              z-index: 99;
              left: -124px;
              bottom: 120%;
              border-radius: 4px;
              box-shadow: var(--box-shadow-default);
              padding: 8px 0px;
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
          }
          &:hover {
            .box-image {
              .text {
                .box-emoji {
                  .btn-emoji-hidden {
                    display: flex;
                  }
                }
              }
            }
            .myself-options {
              visibility: visible;
            }
          }
        }
        &__other {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: flex-end;
          margin-bottom: 6px;
          position: relative;
          .box-image {
            min-width: 83px;
            height: 100%;
            display: flex;
            align-items: flex-start;
            > img.avatar {
              width: 40px;
              height: 40px;
              object-fit: 50%;
              border-radius: 50%;
              margin-right: 8px;
              margin-left: 12px;
              border: 1px solid #fff;
              user-select: none;
              cursor: pointer;
              object-fit: cover;
              flex-shrink: 0;
            }
            > .text {
              font-size: 15px;
              background-color: #fff;
              border-radius: 8px;
              padding: 14px;
              line-height: 1.5rem;
              max-width: 300px;
              min-width: 115px;
              min-height: 83px;
              word-break: break-word;
              position: relative;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
              .dropdown-username-reaction {
                position: absolute;
                max-width: 200px;
                max-height: 100px;
                background-color: #081c35;
                right: 48px;
                top: 100%;
                margin-top: -8px;
                color: #fff;
                padding: 6px 20px;
                border-radius: 4px;
                user-select: none;
                z-index: 5;
                .reaction-userName {
                  font-size: 12px;
                  color: #fff;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
              }
              .reply-content {
                padding: 10px 9px 10px 12px;
                margin-bottom: 8px;
                border-radius: 6px;
                background-color: #eaedf0;
                display: flex;
                align-items: center;
                cursor: pointer;
                user-select: none;
                &__left {
                  width: 3px;
                  min-width: 3px;
                  height: 40px;
                  margin-right: 8px;
                  background-color: #3989ff;
                }
                .image-reply {
                  width: 40px;
                  height: 40px;
                  object-fit: cover;
                  margin-right: 8px;
                  border-radius: 2px;
                }
                &__right {
                  .subcription {
                    > * {
                      margin-right: 2px;
                    }
                    > i {
                      color: #7589a3;
                      font-size: 16px;
                    }
                    .name {
                      font-size: 13px;
                      font-weight: 600;
                    }
                  }
                  .content {
                    font-size: 14px;
                    margin-top: -2px;
                    color: #476285;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                }
              }
              .box-date {
                text-align: left;
              }
              .reaction-emoji {
                display: flex;
                flex-direction: row-reverse;
                justify-content: flex-start;
                align-items: center;
                user-select: none;
                .emoji-newest {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 50%;
                  border: 0.5px solid var(--boder-dividing-color);
                  padding: 5px;
                  background-color: #fff;
                  cursor: pointer;
                  > img {
                    width: 16px;
                    object-fit: cover;
                  }
                  > span {
                    font-size: 14px;
                  }
                }
                .total-emoji {
                  display: flex;
                  margin: 0 5px;
                  padding: 1px 10px;
                  cursor: pointer;
                  border: 0.5px solid var(--boder-dividing-color);
                  border-radius: 15px;
                  white-space: nowrap;
                  align-items: center;
                  gap: 4px;
                  background-color: #fff;
                  > img {
                    width: 16px;
                    object-fit: cover;
                  }
                }
              }
              .box-emoji {
                position: absolute;
                bottom: 0;
                z-index: 4;
                user-select: none;
                width: auto;
                height: auto;
                right: 0;
                .btn-emoji {
                  width: 26px;
                  height: 26px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 50%;
                  background-color: #fff;
                  border: 1px solid var(--boder-dividing-color);
                  cursor: pointer;
                  position: absolute;
                  bottom: -14px;
                  right: 10px;
                  > i {
                    font-size: 14px;
                    color: #7589a3;
                  }
                }
                .btn-emoji-hidden {
                  display: none;
                }
                .dropdown-emoji-list {
                  /* visibility: hidden; */
                  /* transition-delay: 0.5s;  */
                  position: absolute;
                  bottom: 15px;
                  left: -90px;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  gap: 12px;
                  padding: 6px 18px;
                  background-color: #fff;
                  border: 1px solid var(--boder-dividing-color);
                  border-radius: 30px;
                  .emoji-item {
                    width: 24px;
                    height: auto;
                    object-fit: cover;
                    cursor: pointer;
                    &:hover {
                      transform: scale(1.2);
                      transition: transform 0.1s ease;
                    }
                  }
                  .btn-close {
                    color: #7589a3;
                    cursor: pointer;
                  }
                  /* &:hover {
                    visibility: visible;
                  } */
                }

                /* .btn-emoji:hover + .dropdown-emoji-list {
                  visibility: visible;
                } */
              }
              .message-reply {
                background-color: #c7e0ff;
                border-radius: 6px;
                padding: 10px 9px 10px 12px;
                -webkit-line-clamp: 3;
                text-overflow: ellipsis;
                overflow: hidden;
                margin-bottom: 10px;
              }
            }
          }
          .container-options {
            position: relative;
            .other-options {
              margin: 0 0 16px 12px;
              background-color: rgba(255, 255, 255, 0.3);
              border-radius: 6px;
              height: 22px;
              padding: 2px 8px;
              visibility: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
              > i {
                font-size: 16px;
                padding: 6px;
                color: rgb(117, 137, 163);
                cursor: pointer;
                &:hover {
                  color: rgb(3, 92, 224);
                }
              }
            }
            .recall {
              > i:hover {
                color: #d91b1b;
              }
            }
            .dropdown-menu {
              background-color: #fff;
              width: 220px;
              position: absolute;
              z-index: 99;
              left: 80px;
              bottom: 120%;
              border-radius: 4px;
              box-shadow: var(--box-shadow-default);
              padding: 8px 0px;
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
          }

          &:hover {
            .box-image {
              .text {
                .box-emoji {
                  .btn-emoji-hidden {
                    display: flex;
                  }
                }
              }
            }
            .other-options {
              visibility: visible;
            }
          }
        }
        .format-date-message {
          /* display: none; */
          /* background-color: rgba(0, 0, 0, 0.2); */
          padding: 3px 0px 4px 0px;
          border-radius: 16px;
          font-size: 13px;
          color: rgba(0, 0, 0, 0.5);
          user-select: none;
          display: inline-block;
        }
      }
      .message-item:last-child {
        margin-bottom: 16px;
      }
      .up-to-top {
        position: sticky;
        top: calc(100% - 50px);
        z-index: 99;
        left: 100%;
        margin-right: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 34px;
        height: 34px;
        border-radius: 100%;
        border: 1px solid #ccc;
        background-color: #fff;
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.2);
        cursor: pointer;
        &:hover {
          > i {
            color: #005ae0;
          }
        }
        > i {
          color: #7589a3;
          font-size: 18px;
        }
      }
    }
    /* &__content::before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      background: hsla(0, 2%, 90%, 0.2);
      z-index: 1;
      contain: strict;
    } */
    &__footer {
      height: var(--footer-height);
      .toolbar-chat-input {
        height: 47px;
        border-bottom: 1px solid var(--boder-dividing-color);
        position: relative;
        display: flex;
        align-items: center;
        z-index: 4;
        .emoji-mart {
          position: absolute;
          z-index: 4;
          bottom: 50px;
          left: 8px;
          box-shadow: var(--box-shadow-default);
        }
        .box-icon {
          width: 38px;
          height: 38px;
          margin-left: 8px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          :hover {
            background-color: #f1f1f1;
          }
          label {
            width: 38px;
            height: 38px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          i {
            font-size: 22px;
            color: rgb(117, 137, 163);
          }
        }
        .box-icon--active {
          background-color: #e5efff;
          > i {
            color: #035ce0;
          }
        }
      }
      .box-chat-input {
        height: 58px;
        display: flex;
        align-items: center;
        &__left {
          flex: 1;
          .input-message-text {
            width: 100%;
            padding: 18px 10px 18px 16px;
            border: none;
            height: 58px;
            font-size: 15px;
            text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 0px;
            outline: none;
            resize: none;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
              "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
              "Helvetica Neue", sans-serif;
            &::-webkit-scrollbar {
              appearance: none;
              width: 0;
            }
            &::placeholder {
              max-width: 500px;
              overflow: hidden;
              white-space: nowrap;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
                "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans",
                "Droid Sans", "Helvetica Neue", sans-serif;
            }
          }
        }
        &__right {
          > .btn-sent-message {
            height: 40px;
            line-height: 40px;
            padding: 0 16px;
            margin-right: 16px;
            font-size: 16px;
            font-weight: 600;
            color: #005ae0;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
              background-color: #e5efff;
            }
          }
        }
      }
      .reply-content {
        height: 70px;
        padding: 12px;
        margin: 12px 15px 0px;
        border-radius: 6px;
        background-color: #eaedf0;
        display: flex;
        align-items: center;
        position: relative;
        user-select: none;
        &__left {
          width: 3px;
          height: 100%;
          margin-right: 8px;
          background-color: #3989ff;
        }
        .image-reply {
          width: 40px;
          height: 40px;
          object-fit: cover;
          margin-right: 8px;
          border-radius: 2px;
        }
        &__right {
          .subcription {
            margin-bottom: 4px;
            > * {
              margin: 2px;
            }
            > i {
              color: #7589a3;
              font-size: 16px;
            }
            .name {
              font-weight: 600;
            }
          }
          .content {
            color: #476285;
            font-weight: 500;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        .btn-close {
          position: absolute;
          right: 8px;
          top: 8px;
          color: #7589a3;
          font-size: 18px;
          cursor: pointer;
          &:hover {
            color: #3989ff;
          }
        }
      }
    }
    .message-error {
      animation-name: fadeIn, zoom;
      animation-duration: 0.4s;
    }
  }

  .images-container {
    position: fixed;
    z-index: 999;
    inset: 0 0 0 0;
    height: 100dvh;
    background-color: #3e4041;
    user-select: none;

    .image-show__title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 24px;
      background-color: #545454;
      > div {
        padding-left: 14px;
        color: #fff;
        font-size: 16px;
        white-space: nowrap;
      }
      > i {
        width: 32px;
        height: 24px;
        line-height: 24px;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
      }
    }

    .image-show__center {
      height: calc(100dvh - 24px - 55px);
      padding: 4px;
      display: flex;
      .main-image {
        flex: 1;
        width: auto;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        object-fit: contain;
        position: relative;
        overflow: hidden;
        > img {
          /* width: 100%; */
          max-width: 100%;
          max-height: 100%;
          transition: all 0.3s ease;
        }
      }
      .container-image-list {
        display: flex;
        padding: 15px 15px 0px 0px;
        .dividing {
          margin-right: 12px;
          cursor: pointer;
          .dividing-line {
            height: 100dvh;
            width: 2px;
            background-color: #fff;
          }
        }
        .images {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
          overflow-y: auto;
          &::-webkit-scrollbar {
            appearance: none;
            width: 0;
          }
          .image-list__title {
            height: 40px;
            line-height: 40px;
            width: 120px;
            text-align: center;
            color: #fff;
          }
          img.image-item {
            min-width: 80px;
            max-width: 80px;
            min-height: 80px;
            max-height: 80px;
            object-fit: cover;
            border-radius: 6px;
            overflow: hidden;
            margin: 4px;
            filter: brightness(70%);
            transition: all 0.05s ease;
            user-select: none;
            &:hover {
              cursor: pointer;
              filter: none;
            }
          }
        }
      }
    }

    .image-show__bottom {
      height: 55px;
      padding: 0 8px;
      background-color: #545454;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      .image-show__bottom__sender {
        display: flex;
        z-index: 3;
        overflow: hidden;
        .image-show__bottom__sender__avatar {
          width: 40px;
          height: 40px;
          border: 1px solid #fff;
          object-fit: cover;
          border-radius: 50%;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .image-show__bottom__sender__info {
          white-space: nowrap;
          .sender-name {
            color: #fff;
            margin-bottom: 3px;
          }
          .createAt {
            color: #fff;
            font-size: 12px;
          }
        }
      }
      .image-show__bottom__ctrl {
        margin: 0 auto;
        text-align: center;
        display: flex;
        justify-content: center;
        position: relative;
        z-index: 3;
        top: 0;
        background-clip: content-box;
        i {
          width: 40px;
          height: 30px;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          cursor: pointer;
          &:hover {
            color: #005ae0;
          }
        }
      }
      .image-show__bottom__slider-wrapper {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        z-index: 3;
        > div {
          background-color: #fff;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
          cursor: pointer;
          i {
            color: #333;
          }
        }
        > i {
          color: #fff;
          width: 40px;
          height: 40px;
          font-size: 24px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
        }
      }
    }
  }

  @keyframes selectIn {
    0% {
      width: 0;
    }
    100% {
      width: 100%;
    }
  }

  @keyframes zoom {
    0% {
      transform: translateY(-30px);
    }
    100% {
    }
  }

  @keyframes fadeIn {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 992px) {
    .box-chat {
      &__header {
        .left {
          .btn-come-back {
            display: flex;
            flex-shrink: 1;
          }
        }
      }
    }
  }
  @media only screen and (max-width: 500px) {
    .box-chat {
      &__header {
        .left {
          > .avatar {
            display: none;
          }
        }
      }
    }
  }

  @media only screen and (max-width: 420px) {
    .box-chat {
      &__content {
        .up-to-top {
          left: 84%;
        }
      }
    }
  }
`;

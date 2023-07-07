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
    --footer-height: 105px;
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
      width: 100%;
      padding-top: 20px;
      background-image: url(${(props) =>      props.isCloud ? cloudBg : messageBg});
      background-blend-mode: multiply;
      background-color: rgba(
        ${(props) => (props.isCloud ? "0, 0, 0, 0.05" : "0, 0, 0, 0.15")}
      );
      background-size: cover;
      background-repeat: no-repeat;
      height: calc(100vh - var(--header-height) - var(--footer-height));
      .message-view-blur-overlay {
      }
      max-height: calc(100vh - var(--header-height) - var(--footer-height));
      .message-view-blur-overlay {
      }
      /* overflow: hidden; */
      overflow-y: overlay;
      &::-webkit-scrollbar {
        -webkit-appearance: none;
      }
      &::-webkit-scrollbar:vertical {
        width: 4px;
      }
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
      }
      /* display: flex;
      flex-direction: column;
      justify-content: flex-end; */

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
        &__myself {
          width: 100%;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 6px;
          margin-right: 8px;
          .box-image {
            height: 100%;
            display: flex;
            align-items: flex-start;
            > img {
              width: 40px;
              height: 40px;
              object-fit: cover;
              border-radius: 50%;
              margin-right: 4px;
              margin-left: 12px;
              border: 1px solid #fff;
              user-select: none;
            }
            > .text {
              line-height: 1.5rem;
              background-color: #e5efff;
              border-radius: 8px;
              padding: 14px;
              max-width: 300px;
              text-align: left;
              min-width: 115px;
              min-height: 83px;
              > img.image-item {
                cursor: pointer;
              }
              .box-date {
                text-align: left;
              }
            }
          }
        }
        &__other {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          margin-bottom: 6px;
          .box-image {
            min-width: 83px;
            height: 100%;
            display: flex;
            align-items: flex-start;
            > img {
              width: 40px;
              height: 40px;
              object-fit: 50%;
              border-radius: 50%;
              margin-right: 8px;
              margin-left: 12px;
              border: 1px solid #fff;
              user-select: none;
            }
            > .text {
              background-color: #fff;
              border-radius: 8px;
              padding: 14px;
              line-height: 1.5rem;
              max-width: 300px;
              min-width: 115px;
              min-height: 83px;
              .box-date {
                text-align: left;
              }
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
        .emoji-mart {
          position: absolute;
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
            padding: 12px 10px 18px 16px;
            border: none;
            height: 58px;
            font-size: 15px;
            text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 0px;
            &::placeholder {
              max-width: 500px;
              overflow: hidden;
              white-space: nowrap;
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
    height: 100vh;
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
      height: calc(100vh - 24px - 55px);
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
        > img {
          /* width: 100%; */
          max-width: 100%;
          max-height: 100%;
        }
      }
      .container-image-list {
        display: flex;
        padding: 15px 15px 0px 0px;
        .dividing {
          margin-right: 12px;
          cursor: pointer;
          .dividing-line {
            height: 100vh;
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
        .image-show__bottom__sender__avatar {
          width: 40px;
          height: 40px;
          border: 1px solid #fff;
          object-fit: cover;
          border-radius: 50%;
          margin-right: 10px;
        }
        .image-show__bottom__sender__info {
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
        padding-top: 14px;
        text-align: center;
        display: flex;
        justify-content: center;
        position: absolute;
        z-index: 2;
        top: 0;
        width: 100%;
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
`;

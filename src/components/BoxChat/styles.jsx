import styled from "styled-components";
import messageBg from "assets/messageBg.jpg";

export const Wrapper = styled.div`
  min-width: calc(100% - var(--section-left-width) - var(--sidebar-width));
`;

export const Container = styled.div`
  user-select: none;
  .box-chat {
    --header-height: 68px;
    --footer-height: 105px;
    &__header {
      height: var(--header-height);
      padding: 0 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        > img {
          border-radius: 50%;
          width: 48px;
          height: 48px;
          margin-right: 12px;
        }
        .user-info {
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
            font-weight: 500;
            color: #7589a3;
            > i {
              color: #7589a3;
            }
          }
        }
      }
      .right {
        display: flex;
        gap: 4px;
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
      background-image: url(${messageBg});
      background-blend-mode: multiply;
      background-color: rgba(0, 0, 0, 0.1);
      background-size: cover;
      background-repeat: no-repeat;
      height: calc(100vh - var(--header-height) - var(--footer-height));
      .message-view-blur-overlay {
      }
      max-height: calc(100vh - var(--header-height) - var(--footer-height));
      .message-view-blur-overlay {
      }
      /* overflow: hidden; */
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
      /* display: flex;
      flex-direction: column;
      justify-content: end; */
      .message-item {
        &__myself {
          display: flex;
          justify-content: end;
          align-items: center;
          margin-bottom: 4px;
          margin-right: 4px;
          > .text {
            background-color: #e5efff;
            border-radius: 8px;
            padding: 14px;
            max-width: 300px;
            display: flex;
            justify-content: start;
            align-items: center;
          }
        }
        &__other {
          display: flex;
          justify-content: start;
          align-items: end;
          margin-bottom: 4px;
          > img {
            width: 24px;
            height: 24px;
            object-fit: 50%;
            border-radius: 50%;
            margin-right: 8px;
            margin-left: 8px;
          }
          > .text {
            background-color: #f1f1f1;
            border-radius: 8px;
            padding: 14px;
            max-width: 300px;
            display: flex;
            justify-content: start;
            align-items: center;
          }
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
      }
      .box-chat-input {
        height: 58px;
        display: flex;
        &__left {
          flex: 1;
          .input-message-text {
            width: 100%;
            padding: 12px 10px 18px 16px;
            border: none;
            height: 58px;
            font-size: 15px;
            text-shadow: rgba(0, 0, 0, 0.5) 0px 0px 0px;
          }
        }
        &__right {
        }
      }
    }
  }
`;

import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .modal-overlay {
    z-index: 99;
    background-color: rgba(0, 0, 0, 0.4);
    position: fixed;
    inset: 0 0 0 0;
    animation-name: fadeIn;
    animation-duration: 0.2s;
    user-select: none;
    .modal-container {
      padding: 0px 12px;
      .modal-content {
        animation-name: zoom;
        animation-duration: 0.5s;
        position: absolute;
        height: 97vh;
        width: 520px;
        max-width: 100%;
        top: 10px;
        left: 0;
        right: 0;
        margin: 0 auto;
        z-index: 2;
        border-radius: 6px;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        .header {
          height: 48px;
          padding: 0 8px 0 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 500;
          font-size: 16px;
          border-bottom: 1px solid var(--boder-dividing-color);
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
        .content {
          flex: 1;
          width: 100%;
          .create-group-header {
            display: flex;
            align-items: center;
            padding: 16px 16px 0px;
            .custom-file-label {
              width: 48px;
              height: 48px;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
              border-radius: 50%;
              border: 1px solid #d6dbe1;
              > i {
                font-size: 20px;
                color: #7589a3;
              }
              > img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              &:hover {
                cursor: pointer;
              }
            }
            .custom-file-input {
              display: none;
            }
            .search-keyword {
              flex: 1;
              height: 37px;
              border: none;
              border-bottom: 1px solid var(--boder-dividing-color);
              margin-left: 12px;
              &::placeholder {
                color: #7589a3;
              }
            }
          }
          .create-group-search {
            margin: 20px 16px 0;
            .label {
              font-weight: 500;
              margin-bottom: 6px;
              color: #081c36;
            }
            .input-search-users {
              display: flex;
              align-items: center;
              border: 1px solid var(--boder-dividing-color);
              border-radius: 20px;
              height: 36px;
              overflow: hidden;
              > i {
                padding: 0 8px 0 12px;
                color: #7589a3;
              }
              > input {
                width: 100%;
                line-height: 36px;
                border: none;
                &::placeholder {
                  color: #7589a3;
                }
              }
            }
          }
          .category-carousel {
            margin: 16px 0 0px;
            position: relative;
            max-width: 100%;
            height: 44px;
            overflow: hidden;
            .category-list {
              position: absolute;
              display: flex;
              gap: 10px;
              transition: left 0.2s ease;
              > .category-tag {
                height: 24px;
                padding: 0 12px;
                font-size: 13px;
                white-space: nowrap;
                background-color: #eaedf0;
                border-radius: 20px;
                line-height: 24px;
                color: #081c36;
                cursor: pointer;
                &:hover {
                  background-color: #dfe2e7;
                }
                &:first-child {
                  margin-left: 16px;
                }
                &:last-child {
                  margin-right: 16px;
                }
              }
            }

            .arrow-left {
              position: absolute;
              z-index: 2;
              top: -8px;
              height: 40px;
              width: 20px;
              border-radius: 0 20px 20px 0;
              background-color: #fff;
              box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.2);
              line-height: 40px;
              padding-left: 3px;
              &:hover {
                cursor: pointer;
              }
            }
            .arrow-right {
              position: absolute;
              z-index: 2;
              right: 0px;
              top: -8px;
              height: 40px;
              width: 20px;
              border-radius: 20px 0 0 20px;
              background-color: #fff;
              box-shadow: -1px 0 2px 0 rgba(0, 0, 0, 0.2);
              line-height: 40px;
              text-align: right;
              &:hover {
                cursor: pointer;
              }
            }
          }
          .friends-container {
            margin: 0px 16px 0;
            padding-top: 2px;
            border-top: 1px solid var(--boder-dividing-color);
            display: flex;
            overflow: hidden;
            white-space: nowrap;
            .friend-list {
              padding-top: 12px;
              flex: 1;
              max-height: 308px;
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
              .friend-item {
                display: flex;
                align-items: center;
                height: 52px;
                padding: 6px 5px 6px 10px;
                border-radius: 4px;
                cursor: pointer;
                &__checkbox {
                  width: 16px;
                  height: 16px;
                  font-size: 16px;
                  border-radius: 50%;
                  color: transparent;
                  border: 1px solid var(--boder-dividing-color);
                }
                &__avatar {
                  width: 40px;
                  height: 40px;
                  object-fit: cover;
                  border-radius: 50%;
                  margin-left: 12px;
                  margin-right: 10px;
                }
                &__name {
                  flex: 1;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                &:hover {
                  &:hover {
                    background-color: #f1f1f1;
                  }
                }
              }
            }
            .friend-selected-container {
              width: 0px;
              height: 276px;
              max-height: 276px;
              padding-top: 12px;
              margin: 12px 0 0 14px;
              border-radius: 4px;
              transition: width 0.4s ease;
              .total-selected {
                margin: 0 12px;
                margin-bottom: 12px;
                &__title {
                  font-weight: 600;
                  margin-right: 6px;
                }
                &__count {
                  height: 20px;
                  padding: 2px 8px;
                  color: #005ae0;
                  background-color: #e5efff;
                  border-radius: 4px;
                  font-size: 11px;
                  font-weight: 700;
                }
              }
              .friend-selected-list {
                max-height: 231px;
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
                .friend-selected-item {
                  margin: 0px 12px;
                  margin-bottom: 4px;
                  background-color: #e5efff;
                  border-radius: 16px;
                  height: 32px;
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  &__avatar {
                    width: 24px;
                    height: 24px;
                    object-fit: cover;
                    border-radius: 50%;
                    margin: 0 6px;
                  }
                  &__name {
                    color: #005ae0;
                    flex: 1;
                    /* font-weight: 500; */
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                  }
                  &__btn-delete {
                    margin: 0 6px;
                    font-size: 16px;
                    color: #005ae0;
                    cursor: pointer;
                  }
                }
              }
            }
            .friend-selected-container--active {
              width: 184px;
              border: 1px solid var(--boder-dividing-color);
            }
          }
          .container-empty {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding-top: 70px;
            > img {
              margin-bottom: 12px;
            }
            > div {
              font-weight: 500;
              color: rgb(151, 164, 181);
            }
          }
        }
        .footer {
          height: 68px;
          padding: 14px 16px;
          border-top: 1px solid var(--boder-dividing-color);
          display: flex;
          justify-content: flex-end;
          align-items: center;
          > * {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
            font-weight: 500;
            border-radius: 3px;
            padding: 0 16px;
          }
          .btn-cancel {
            background-color: #eaedf0;
            color: #081c36;
            margin-right: 16px;
            cursor: pointer;
            &:hover {
              background-color: #dfe2e7;
            }
          }
          .btn-create-group {
            pointer-events: none;
            background-color: #abcdff;
            color: #e5efff;
          }
          .btn-create-group--active {
            color: #fff;
            background-color: #0091ff;
            pointer-events: auto;
            cursor: pointer;
            &:hover {
              opacity: 0.9;
            }
          }
        }
      }
    }

    @keyframes moveToLeft {
      0% {
        transform: translateX(0);
      }
      100% {
        transform: translateX(0);
      }
    }

    @keyframes zoom {
      0% {
        transform: scale3d(0.3, 0.3, 0.3);
      }
      100% {
      }
    }

    @keyframes fadeIn {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
`;

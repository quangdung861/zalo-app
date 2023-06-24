import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .invitations {
    user-select: none;
    .header {
      height: 65px;
      display: flex;
      align-items: center;
      padding: 0 19px;
      font-weight: 500;
      font-size: 16px;
      gap: 10px;
      border-bottom: 1px solid var(--boder-dividing-color);
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
    .content {
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
      .total-count {
        height: 64px;
        display: flex;
        align-items: center;
        font-weight: 500;
      }
      .invitation__receive {
        .receive-list {
          display: flex;
          flex-wrap: wrap;
          margin-left: -6px;
          .receive-item {
            width: 33.33%;
            padding: 6px;
            .receive-item__content {
              background-color: #fff;
              padding: 14px;
              border-radius: 6px;
              .content__top {
                margin-bottom: 12px;
                .info {
                  display: flex;
                  &__left {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    > img {
                      width: 48px;
                      height: 48px;
                      object-fit: cover;
                      border-radius: 50%;
                      margin-right: 10px;
                      cursor: pointer;
                    }
                    .detail {
                      .display-name {
                        display: inline-block;
                        font-weight: 500;
                        margin-bottom: 4px;
                        cursor: pointer;
                      }
                      .origin {
                        font-size: 13px;
                        color: #7589a3;
                      }
                    }
                  }
                  &__right {
                    padding: 8px;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    margin-left: 8px;
                    :hover {
                      background-color: #f1f1f1;
                    }
                  }
                }
              }
              .content__center {
                border: 1px solid var(--boder-dividing-color);
                padding: 8px;
                margin-bottom: 16px;
                max-height: 63px;
                height: 100%;
                line-height: 1.25rem;
                background-color: #f1f1f1;
                border-radius: 4px;
                overflow: hidden;
                overflow-y: auto;
                &::-webkit-scrollbar {
                  -webkit-appearance: none;
                }
                &::-webkit-scrollbar:vertical {
                  width: 4px;
                }
                &::-webkit-scrollbar-thumb {
                  background-color: #ccc;
                  border-radius: 10px;
                }
              }
              .content__bottom {
                display: flex;
                gap: 8px;
                .btn {
                  height: 40px;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 4px;
                  font-weight: 500;
                  font-size: 16px;
                  line-height: 40px;
                  transition: all 0.2s ease;
                  cursor: pointer;
                }
                .btn-reject {
                  background-color: #f1f1f1;
                  :hover {
                    filter: brightness(95%);
                  }
                }
                .btn-approve {
                  color: #005ae0;
                  background-color: #e5efff;
                  :hover {
                    background-color: #c7e0ff;
                  }
                }
              }
            }
          }
          .container-empty {
            margin: 0 auto;
            padding: 62px 0;
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
      .invitation__sent {
        .sent-list {
          display: flex;
          flex-wrap: wrap;
          margin-left: -6px;
          .sent-item {
            width: 33.33%;
            padding: 6px;
            .sent-item__content {
              background-color: #fff;
              padding: 14px;
              border-radius: 6px;
              .content__top {
                margin-bottom: 12px;
                .info {
                  display: flex;
                  &__left {
                    display: flex;
                    align-items: center;
                    flex: 1;
                    > img {
                      width: 48px;
                      height: 48px;
                      object-fit: cover;
                      border-radius: 50%;
                      margin-right: 10px;
                      cursor: pointer;
                    }
                    .detail {
                      .display-name {
                        display: inline-block;
                        font-weight: 500;
                        margin-bottom: 4px;
                        cursor: pointer;
                      }
                      .origin {
                        font-size: 13px;
                        color: #7589a3;
                      }
                    }
                  }
                  &__right {
                    padding: 8px;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    margin-left: 8px;
                    :hover {
                      background-color: #f1f1f1;
                    }
                  }
                }
              }

              .content__bottom {
                display: flex;
                gap: 8px;
                .btn {
                  height: 40px;
                  width: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 4px;
                  font-weight: 500;
                  font-size: 16px;
                  line-height: 40px;
                  transition: all 0.2s ease;
                  cursor: pointer;
                }
                .btn-recall {
                  background-color: #f1f1f1;
                  :hover {
                    filter: brightness(95%);
                  }
                }
              }
            }
          }
          .container-empty {
            margin: 0 auto;
            padding: 62px 0;
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
  }

  @media only screen and (max-width: 1200px) {
    .invitations {
      .content {
        .invitation__receive {
          .receive-list {
            .receive-item {
              width: 50%;
            }
          }
        }
        .invitation__sent {
          .sent-list {
            .sent-item {
              width: 50%;
            }
          }
        }
      }
    }
  }
  @media only screen and (max-width: 992px) {
    .invitations {
      .header {
        .btn-come-back {
          display: flex;
          flex-shrink: 1;
        }
      }
      .content {
        .invitation__receive {
          .receive-list {
            .receive-item {
              width: 100%;
            }
          }
        }
        .invitation__sent {
          .sent-list {
            .sent-item {
              width: 100%;
            }
          }
        }
      }
    }
  }
  @media only screen and (max-width: 768px) {
    .invitations {
      .content {
        .invitation__receive {
          .receive-list {
            .receive-item {
              width: 50%;
            }
          }
        }
        .invitation__sent {
          .sent-list {
            .sent-item {
              width: 50%;
            }
          }
        }
      }
    }
  }
  @media only screen and (max-width: 576px) {
    .invitations {
      .content {
        .invitation__receive {
          .receive-list {
            .receive-item {
              width: 100%;
            }
          }
        }
        .invitation__sent {
          .sent-list {
            .sent-item {
              width: 100%;
            }
          }
        }
      }
    }
  }
`;

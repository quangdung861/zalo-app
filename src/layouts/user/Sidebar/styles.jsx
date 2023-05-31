import styled from "styled-components";

export const Wrapper = styled.div`
  --header-height: 100px;
  min-width: 64px;
  background-color: rgb(0, 145, 255);
  .header {
    padding-top: 36px;
    height: var(--header-height);
    user-select: none;
    .avatar {
      text-align: center;
      > img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
        border: 1px solid white;
        cursor: pointer;
      }
    }
  }
  .action-list {
    height: calc(100vh - var(--header-height));
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    color: white;
    width: 100%;
    .action-top {
      width: 100%;
      .action-item {
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;

        > i {
          font-size: 24px;
          color: white;
        }
        cursor: pointer;
        :hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      .action-item--active {
        background-color: #006edc;
      }
    }
    .action-bottom {
      width: 100%;
      .action-item {
        height: 64px;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease;
        > i {
          font-size: 24px;
          color: white;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        cursor: pointer;
        :hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
      }
      .action-item--active {
        background-color: #006edc;
      }
      .action-setting {
        position: relative;
        .dropdown-setting {
          position: absolute;
          bottom: 65px;
          left: 8px;
          background-color: #fff;
          width: 200px;
          padding: 8px 0;
          box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          user-select: none;
          animation-name: moveToBottom, fadeIn;
          animation-duration: 0.2s; 
          .dividing-line {
            border-bottom: 1px solid #d4d4d4;
            margin: 4px 16px;
          }
          &__item {
            padding: 0 12px;
            height: 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
            .content-left {
              display: flex;
              align-items: center;
              gap: 8px;
              white-space: nowrap;
            }
            .dropdown-second {
              display: none;
              position: absolute;
              width: 150px;
              left: 100%;
              top: 0;
              padding: 8px 0;
              border-radius: 4px;
              background-color: #fff;
              box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.2);
              &__item {
                padding: 0 12px;
                height: 32px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                overflow: hidden;
                :hover {
                  background-color: #f1f1f1;
                }
              }
            }
            :hover {
              background-color: #f1f1f1;
              .dropdown-second {
                display: block;
              }
            }
          }
          .logout {
            padding-left: 40px;
            color: #d30e0e;
          }
        }
      }
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

  @keyframes moveToBottom {
    0% {
      transform: translateY(-16px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;

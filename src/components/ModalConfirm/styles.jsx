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
      display: flex;
      justify-content: center;
      align-items: center;
      .modal-content {
        animation-name: zoom;
        animation-duration: 0.5s;
        position: absolute;
        /* height: 97dvh; */
        /* min-height: 60px; */
        width: 374px;
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
        &__text {
          padding: 14px 16px 0;
        }
        &__action {
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .btn-cancel {
            height: 40px;
            line-height: 40px;
            padding: 0 16px;
            margin-right: 15px;
            background-color: #eaedf0;
            font-weight: 500;
            font-size: 16px;
            border-radius: 3px;
            cursor: pointer;
            &:hover {
              background-color: #dfe2e7;
            }
          }
          .btn-accept {
            height: 40px;
            line-height: 40px;
            padding: 0 16px;
            background-color: #0068ff;
            color: white;
            font-weight: 500;
            font-size: 16px;
            border-radius: 3px;
            cursor: pointer;
            &:hover {
              background-color: #004bb9;
            }
          }
        }
      }
    }
  }

  @keyframes zoom {
    0% {
      transform: scale3d(0.3, 0.3, 0.3);
    }
    100% {
    }
  }
`;

import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .direction-board {
    width: 100%;
    max-width: 400px;
    padding-right: 20px;
    background-color: #fff;
    position: absolute;
    top: 30px;
    left: 20px;
    border-radius: 8px;
    box-shadow: var(--box-shadow-default);
    z-index: 99;
    padding: 16px 16px 30px 16px;
    /* transition: all 0.2s ease; */
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
    > h2 {
      text-align: center;
      color: rgb(240, 81, 35);
      margin-bottom: 16px;
    }

    .content {
      position: relative;
      &__item {
        margin-bottom: 8px;
      }
      .btn-close {
        position: absolute;
        right: 20px;
        bottom: -20px;
        font-weight: 500;
        color: #706e6e;
        :hover {
          opacity: 0.6;
          cursor: pointer;
        }
      }
    }
  }
  .btn-open {
    position: fixed;
    top: 30px;
    left: 30px;
    color: white;
    /* font-weight: 500; */
    cursor: pointer;
    :hover {
      opacity: 0.8;
    }
  }
`;

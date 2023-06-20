import styled from "styled-components";

export const Wrapper = styled.div``;

export const Container = styled.div`
  .--avatar-group {
    .box-avatars {
      display: flex;
      width: ${(props) => (props.styleBox ? props.styleBox.width : "48px")};
      height: ${(props) => (props.styleBox ? props.styleBox.height : "48px")};
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      position: relative;
      .avatar-0 {
        top: 0;
        left: 0;
        position: absolute;
        width: ${(props) => (props.styleIcon ? props.styleIcon.width : "26px")};
        height: ${(props) => (props.styleIcon ? props.styleIcon.height : "26px")};
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #fff;
        z-index: 4;
      }
      .avatar-1 {
        top: 0;
        right: 0;
        position: absolute;
        width: ${(props) => (props.styleIcon ? props.styleIcon.width : "26px")};
        height: ${(props) => (props.styleIcon ? props.styleIcon.height : "26px")};
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #fff;
        z-index: 3;
      }
      .avatar-2 {
        bottom: 0;
        left: 0;
        position: absolute;
        width: ${(props) => (props.styleIcon ? props.styleIcon.width : "26px")};
        height: ${(props) => (props.styleIcon ? props.styleIcon.height : "26px")};
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #fff;
        z-index: 1;
      }
      .avatar-3 {
        bottom: 0;
        right: 0;
        position: absolute;
        width: ${(props) => (props.styleIcon ? props.styleIcon.width : "26px")};
        height: ${(props) => (props.styleIcon ? props.styleIcon.height : "26px")};
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #fff;
        z-index: 2;
      }

      .avatar-more {
        position: absolute;
        bottom: 0;
        right: 0;
        width: ${(props) => (props.styleIcon ? props.styleIcon.width : "26px")};
        height: ${(props) =>
          props.styleIcon ? props.styleIcon.height : "26px"};
        line-height: 26px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #eaedf0;
        color: #757373;
        overflow: hidden;
        border: 1px solid #fff;
        z-index: 2;
        .normal {
          font-size: ${(props) =>
            props.styleIcon ? props.styleIcon.fontSize : "14px"};
        }
        .mutation {
          font-size: ${(props) =>
            props.styleIcon ? props.styleIcon.fontSize : "12px"};
        }
      }
    }
    .box-avatars--1 {
      .avatar-0 {
        width: 100%;
      }
    }
    .box-avatars--2 {
      .avatar-0 {
        left: 50%;
        top: 50%;
        transform: translate(-90%, -50%);
      }
      .avatar-1 {
        left: 50%;
        top: 50%;
        transform: translate(-10%, -50%);
      }
    }
    .box-avatars--3 {
      .avatar-2 {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -20%);
      }
    }
  }
`;

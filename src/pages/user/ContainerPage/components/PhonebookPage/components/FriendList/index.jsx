import React from "react";
import * as S from "./styles";

const FriendList = () => {
  return (
    <S.Wrapper>
      <S.Container>
        <div className="friendlist">
          <div className="friendlist-header">
            <i className="fa-solid fa-user-group"></i>
            Danh sách bạn bè
          </div>
          <div className="friendlist-content">
            <div className="total-friends">Bạn bè 282</div>
            <div className="filter-friends">Filter</div>
            <div className="list-friends">
              <div className="item-friend">
                <div className="item-friend__left">
                  <img
                    src="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"
                    alt=""
                  />
                  DisplayName
                </div>
                <div className="item-friend__right">
                  <i className="fa-solid fa-ellipsis"></i>
                </div>
              </div>
              <div className="item-friend">
                <div className="item-friend__left">
                  <img
                    src="https://dvdn247.net/wp-content/uploads/2020/07/avatar-mac-dinh-1.png"
                    alt=""
                  />
                  DisplayName
                </div>
                <div className="item-friend__right">
                  <i className="fa-solid fa-ellipsis"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </S.Container>
    </S.Wrapper>
  );
};

export default FriendList;

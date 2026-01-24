import React from "react";
import * as S from "./styles";
import avatarDefault from "assets/avatar-mac-dinh-1.png";
const AvatarGroup = ({ props, styleBox, styleIcon }) => {
  const { avatars, room } = props;

  return (
    avatars &&
    room && (
      <S.Wrapper>
        <S.Container styleBox={styleBox} styleIcon={styleIcon}>
          <div className="--avatar-group">
            {!room?.avatar?.url && avatars?.length === 1 && (
              <div className="box-avatars box-avatars--1">
                {avatars.map((item, index) => (
                  <img
                    key={index}
                    src={item.thumbnail}
                    alt=""
                    className={`avatar-${index}`}
                    onError={(e) => {
                      e.target.src = avatarDefault;
                    }}
                  />
                ))}
              </div>
            )}

            {!room?.avatar?.url && avatars?.length === 2 && (
              <div className="box-avatars box-avatars--2">
                {avatars.map((item, index) => (
                  <img
                    key={index}
                    src={item.thumbnail}
                    alt=""
                    className={`avatar-${index}`}
                    onError={(e) => {
                      e.target.src = avatarDefault;
                    }}
                  />
                ))}
              </div>
            )}

            {!room?.avatar?.url && avatars.length === 3 && (
              <div className="box-avatars box-avatars--3">
                {avatars.map((item, index) => (
                  <img
                    key={index}
                    src={item.thumbnail}
                    alt=""
                    className={`avatar-${index}`}
                    onError={(e) => {
                      e.target.src = avatarDefault;
                    }}
                  />
                ))}
              </div>
            )}

            {!room?.avatar?.url && avatars.length === 4 && (
              <div className="box-avatars box-avatars--4">
                {avatars.map((item, index) => (
                  <img
                    key={index}
                    src={item.thumbnail}
                    alt=""
                    className={`avatar-${index}`}
                    onError={(e) => {
                      e.target.src = avatarDefault;
                    }}
                  />
                ))}
              </div>
            )}

            {!room?.avatar?.url && avatars.length >= 5 && (
              <div className="box-avatars box-avatars--more">
                {avatars.map((item, index) =>
                  index < 3 ? (
                    <img
                      key={index}
                      src={item.thumbnail}
                      alt=""
                      className={`avatar-${index}`}
                      onError={(e) => {
                        e.target.src = avatarDefault;
                      }}
                    />
                  ) : (
                    index === 3 && (
                      <div key={index} className="avatar-more">
                        {avatars.length < 100 ? (
                          <span className="normal">{avatars.length - 3}</span>
                        ) : (
                          <span className="mutation">99+</span>
                        )}
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </div>
        </S.Container>
      </S.Wrapper>
    )
  );
};

export default AvatarGroup;

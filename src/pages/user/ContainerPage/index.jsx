import React, { useContext } from "react";
import * as S from "./styles";
import { UserLayoutContext } from "layouts/user/UserLayout";
import MessagePage from "./components/MessagePage";
import PhonebookPage from "./components/PhonebookPage";

const ContainerPage = () => {
  const { sidebarSelected, setSidebarSelected } = useContext(UserLayoutContext);

  const renderContent = () => {
    switch (sidebarSelected) {
      case "message":
        return <MessagePage />;
      case "phonebook":
        return <PhonebookPage />;
      default:
        <MessagePage />;
        break;
    }
  };

  return (
    <S.Wrapper>
      <S.Container>{renderContent()}</S.Container>
    </S.Wrapper>
  );
};

export default ContainerPage;

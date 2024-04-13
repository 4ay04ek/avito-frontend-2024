import { Button, Flex, Input, Modal, message } from "antd";
import Title from "antd/es/typography/Title";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import "./styles";

const RndNAuth = () => {
  const cookies = useRef(new Cookies());
  const [messageApi, contextHolder] = message.useMessage();
  const [auth, setAuth] = useState(cookies.current.get("auth"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const input = useRef(null);
  const clearHistory = () => {
    cookies.current.remove("qH");
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setAuth(false);
    cookies.current.remove("auth");
    setIsModalOpen(false);
  };
  const handleAuth = (v: string) => {
    if (v == "please") {
      setAuth(true);
      cookies.current.set("auth", "1");
      setIsModalOpen(false);
      messageApi.open({
        type: "success",
        content: "Вы вошли",
      });
    } else {
      messageApi.open({
        type: "error",
        content: "Неверный пароль",
      });
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Flex className="rndbox">
      {contextHolder}
      <Title className="rndText" level={4} onClick={() => showModal()}>
        Авторизация
      </Title>
      {auth && (
        <Link to="/random">
          <Title className="rndText" level={4}>
            Мне повезет!
          </Title>
        </Link>
      )}
      <Modal
        title="Авторизация"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Выйти"
        okButtonProps={{ className: "logout" }}
        width={300}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <Button onClick={() => clearHistory()}>Clean</Button>
            <CancelBtn />
            {auth && <OkBtn />}
          </>
        )}
      >
        <Input.Search
          style={{ width: 252 }}
          ref={input}
          placeholder="Пароль"
          variant="filled"
          enterButton="Войти"
          onSearch={handleAuth}
        />
      </Modal>
    </Flex>
  );
};

export default RndNAuth;

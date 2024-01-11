import { Form, Input, Button } from 'antd';
import React from 'react';

const LoginForm = ({ handleLogin, handleChangeLogin, handleShowRegister }) => {
  return (
    <Form
      onFinish={handleLogin}
      style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "50%",
        margin: "0 auto",
        gap: "20px",
      }}
    >
      <Form.Item
        name="email"
        rules={[{ required: true, message: 'Por favor, insira seu usuário!' }]}
      >
        <Input 
          placeholder="Usuário" 
          onChange={(e) => handleChangeLogin(e)} 
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
      >
        <Input.Password 
          placeholder="Senha" 
          onChange={(e) => handleChangeLogin(e)} 
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Entrar
        </Button>
        <Button 
          style={{ marginLeft: '8px' }}
          onClick={handleShowRegister}>
          Cadastrar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;

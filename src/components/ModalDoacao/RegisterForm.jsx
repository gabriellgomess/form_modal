import React, { useState } from 'react';
import { Form, Input, Button, Card, Select, Typography } from 'antd';
import axios from 'axios';
import swal from 'sweetalert';

const { Option } = Select;

function RegisterForm({ handleShowLogin }) {
  const initialState = {
    userInfo: {
        name: "",
        email: "",
        password: "",
        cpfCnpj: "",
        address: "",
        addressNumber: "",
        complement: "",
        province: "",
        city: "",
        state: "",
        postalCode: "",
        phone: "",
        mobilePhone: "",
    },
    errorMsg: '',
    successMsg: '',
  };

  const [state, setState] = useState(initialState);

  const submitForm = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(
        "https://amigosdacasa.org.br/gerenciador-doacoes-amigosdacasa/login_site/register.php",
        state.userInfo
      );
      if (response.data.success) {
        setState({
          ...initialState,
          successMsg: response.data.message,
        });
        swal({
          title: "Cadastro realizado com sucesso!",
          text: "Você será redirecionado para a página de login",
          icon: "success",
          button: "Ok",
        }).then(() => {
          handleShowLogin();
        });
      } else {
        setState({
          ...state,
          successMsg: "",
          errorMsg: response.data.message,
        });
        swal({
          title: "Erro ao cadastrar!",
          text: response.data.message,
          icon: "error",
          button: "Ok",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const fetchAddressByCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const {logradouro, bairro, localidade, uf} = response.data;
  
      setState((prevState) => ({
        ...prevState,
        userInfo: {
          ...prevState.userInfo,
          address: logradouro,
          province: bairro,
          city: localidade,
          state: uf,
        },
      }));
    } catch (error) {
      console.error("Could not fetch CEP:", error);
    }
  };

  return (
    <Card style={{ maxWidth: 800, margin: '0 auto' }}>
      <Typography.Title level={4}>Cadastro de Doador</Typography.Title>
      <Form
  layout="vertical"
  onFinish={submitForm}
  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
>
  <Form.Item label="Nome" name="name" rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}>
    <Input placeholder="Digite seu nome completo" />
  </Form.Item>

  <Form.Item label="CPF" name="cpfCnpj" rules={[{ required: true, message: 'Por favor, insira seu CPF!' }]}>
    <Input placeholder="Digite seu CPF" />
  </Form.Item>

  <Form.Item label="Usuário" name="email" rules={[{ required: true, message: 'Por favor, insira seu usuário!' }]}>
    <Input placeholder="Digite seu usuário" />
  </Form.Item>

  <Form.Item label="Senha (8 dígitos)" name="password" rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}>
    <Input.Password placeholder="Digite sua senha" />
  </Form.Item>

  <Form.Item label="CEP" name="postalCode" rules={[{ required: true, message: 'Por favor, insira o CEP!' }]}>
    <Input placeholder="Digite o CEP" />
  </Form.Item>

  <Form.Item label="Rua" name="address" rules={[{ required: true, message: 'Por favor, insira o endereço!' }]}>
    <Input placeholder="Digite sua rua" />
  </Form.Item>

  <Form.Item label="Número" name="addressNumber" rules={[{ required: true, message: 'Por favor, insira o número!' }]}>
    <Input placeholder="Digite o número" />
  </Form.Item>

  <Form.Item label="Complemento" name="complement">
    <Input placeholder="Digite o complemento (opcional)" />
  </Form.Item>

  <Form.Item label="Cidade" name="city" rules={[{ required: true, message: 'Por favor, insira a cidade!' }]}>
    <Input placeholder="Digite a cidade" />
  </Form.Item>

  <Form.Item label="Bairro" name="province" rules={[{ required: true, message: 'Por favor, insira o bairro!' }]}>
    <Input placeholder="Digite o bairro" />
  </Form.Item>

  <Form.Item label="Estado" name="state" rules={[{ required: true, message: 'Por favor, selecione o estado!' }]}>
    <Select placeholder="Selecione o estado">
      {/* Opções de estados */}
      <Option value="AC">AC</Option>
        <Option value="AL">AL</Option>
        <Option value="AP">AP</Option>
        <Option value="AM">AM</Option>
        <Option value="BA">BA</Option>
        <Option value="CE">CE</Option>
        <Option value="DF">DF</Option>
        <Option value="ES">ES</Option>
        <Option value="GO">GO</Option>
        <Option value="MA">MA</Option>
        <Option value="MT">MT</Option>
        <Option value="MS">MS</Option>
        <Option value="MG">MG</Option>
        <Option value="PA">PA</Option>
        <Option value="PB">PB</Option>
        <Option value="PR">PR</Option>
        <Option value="PE">PE</Option>
        <Option value="PI">PI</Option>
        <Option value="RJ">RJ</Option>
        <Option value="RN">RN</Option>
        <Option value="RS">RS</Option>
        <Option value="RO">RO</Option>
        <Option value="RR">RR</Option>
        <Option value="SC">SC</Option>
        <Option value="SP">SP</Option>
        <Option value="SE">SE</Option>
        <Option value="TO">TO</Option>        
    </Select>
  </Form.Item>

  <Form.Item label="Telefone" name="phone">
    <Input placeholder="Digite o telefone" />
  </Form.Item>

  <Form.Item label="Celular" name="mobilePhone" rules={[{ required: true, message: 'Por favor, insira o celular!' }]}>
    <Input placeholder="Digite o celular" />
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" block>
      Cadastrar
    </Button>
  </Form.Item>
</Form>

      <Button block onClick={handleShowLogin}>
        Entrar
      </Button>
    </Card>
  );
}

export default RegisterForm;

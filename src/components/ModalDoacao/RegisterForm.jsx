import React, { useState } from "react";
import axios from "axios";
import { Card, Typography, Form, Input, Button, Select, message } from "antd";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const { Option } = Select;

function RegisterForm({ handleShowLogin, isMobile }) {

  const MySwal = withReactContent(Swal);

  const [form] = Form.useForm();

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
    errorMsg: "",
    successMsg: "",
  };

  const [state, setState] = useState(initialState);

  const submitForm = async () => {
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
        MySwal.fire({
          title: 'Sucesso!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Ok'
        }).then((result) => {
          if (result.isConfirmed) {
            handleShowLogin();
            form.resetFields();
          }
        })


      } else {
        setState({
          ...state,
          successMsg: "",
          errorMsg: response.data.message,
        });
        MySwal.fire({
          title: 'Erro!',
          text: response.data.message,
          icon: 'error',
          confirmButtonText: 'Ok'
        })


      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const fetchAddressByCEP = async (cep) => {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
      const { logradouro, bairro, localidade, uf } = response.data;

      // Set form field values using form.setFieldsValue
      form.setFieldsValue({
        address: logradouro,
        province: bairro,
        city: localidade,
        state: uf,
      });

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


  const handleCEPChange = (cep) => {
    setState((prevState) => ({
      ...prevState,
      userInfo: {
        ...prevState.userInfo,
        postalCode: cep,
      },
    }));

    // Trigger address fetch when CEP is complete
    if (cep.length === 8) {
      fetchAddressByCEP(cep);
    }
  };

  const onFinish = (values) => {
    setState((prevState) => ({
      ...prevState,
      userInfo: {
        ...prevState.userInfo,
        ...values,
      },
    }));
  };

  return (

    <Card
      title="Cadastro de Doador"
      style={{ width: "100%", padding: "16px" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={state.userInfo}
      >
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: "Por favor, insira seu nome" }]}
            style={isMobile ? { width: '100%' } : { flexGrow: 3 }}
          >
            <Input
              placeholder="Digite seu nome completo"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    name: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
          <Form.Item
            label="CPF"
            name="cpfCnpj"
            rules={[
              { required: true, message: "Por favor, insira seu CPF" },
              {
                pattern: /^\d{11}$/,
                message: "O CPF deve conter 11 dígitos numéricos",
              },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 1 }}
          >
            <Input placeholder="Digite seu CPF"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    cpfCnpj: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Form.Item
            label="E-mail"
            name="email"
            rules={[
              { required: true, message: "Por favor, insira seu e-mail" },
              {
                type: "email",
                message: "Por favor, insira um email válido",
              },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 3 }}
          >
            <Input placeholder="Digite seu e-mail"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    email: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
          <Form.Item
            label="Senha (8 dígitos)"
            name="password"
            rules={[
              { required: true, message: "Por favor, insira sua senha" },
              {
                min: 8,
                message: "A senha deve conter no mínimo 8 caracteres",
              },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 1 }}
          >
            <Input.Password placeholder="Digite sua senha"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    password: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Form.Item
            label="CEP"
            name="postalCode"
            rules={[
              { required: true, message: "Por favor, insira seu CEP" },
              {
                pattern: /^\d{8}$/,
                message: "O CEP deve conter 8 dígitos numéricos",
              },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 1 }}
          >
            <Input
              placeholder="Digite o CEP"
              onChange={(e) => handleCEPChange(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            label="Rua"
            name="address"
            rules={[{ required: true, message: "Por favor, insira sua rua" }]}
            style={isMobile ? { width: '100%' } : { flexGrow: 4 }}
          >
            <Input placeholder="Digite sua rua" />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Form.Item
            label="Número"
            name="addressNumber"
            rules={[
              { required: true, message: "Por favor, insira o número" },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 1 }}
          >
            <Input placeholder="Digite o número"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    addressNumber: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
          <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Complemento" name="complement">
            <Input placeholder="Digite o complemento"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    complement: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Form.Item
            label="Cidade"
            name="city"
            rules={[{ required: true, message: "Por favor, insira a cidade" }]}
            style={isMobile ? { width: '100%' } : { flexGrow: 4 }}
          >
            <Input placeholder="Digite a cidade" />
          </Form.Item>
          <Form.Item
            label="Bairro"
            name="province"
            rules={[
              { required: true, message: "Por favor, insira o bairro" },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 4 }}
          >
            <Input placeholder="Digite o bairro" />
          </Form.Item>
          <Form.Item
            label="Estado"
            name="state"
            rules={[{ required: true, message: "Por favor, selecione o estado" }]}
            style={isMobile ? { width: '100%' } : { flexGrow: 1 }}
          >
            <Select placeholder="Selecione o estado">
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
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <Form.Item
            label="Telefone"
            name="phone"
            rules={[
              { required: false, message: "Por favor, insira o telefone" },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 1 }}
          >
            <Input placeholder="Digite o telefone"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    phone: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
          <Form.Item
            label="Celular"
            name="mobilePhone"
            rules={[
              { required: true, message: "Por favor, insira o celular" },
            ]}
            style={isMobile ? { width: '100%' } : { flexGrow: 1 }}
          >
            <Input placeholder="Digite o celular"
              onChange={(e) =>
                setState((prevState) => ({
                  ...prevState,
                  userInfo: {
                    ...prevState.userInfo,
                    mobilePhone: e.target.value,
                  },
                }))
              }
            />
          </Form.Item>
        </div>

        {state.errorMsg && (
          <Typography.Text type="error">{state.errorMsg}</Typography.Text>
        )}
        {state.successMsg && (
          <Typography.Text type="success">{state.successMsg}</Typography.Text>
        )}
        <Form.Item>
          <Button type="primary" onClick={submitForm}>
            Cadastrar
          </Button>
        </Form.Item>
      </Form>
      <Button onClick={handleShowLogin}>Entrar</Button>
    </Card>

  );
}

export default RegisterForm;

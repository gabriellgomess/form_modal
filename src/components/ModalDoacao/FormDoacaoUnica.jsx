import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Form, Input, Button, DatePicker, Select, Card } from 'antd';
import axios from 'axios';

const { Option } = Select;

const FormDoacaoUnica = () => {
    const { handleSubmit } = useForm();
    const [dadosForm, setDadosForm] = useState({});

    const onSubmit = () => {
        console.log(dadosForm);
        axios.post(`${import.meta.env.VITE_URL_AXIOS}/createClientAndDonation.php`, dadosForm)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <Card style={{ width: '50%' }}>
            <h1>Formulário</h1>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Form.Item style={{ flexGrow: '3' }} label="Nome" name="nome" onChange={(e) => setDadosForm({ ...dadosForm, nome: e.target.value })} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ flexGrow: '1' }} label="CPF/CNPJ" name="cpfCnpj" onChange={(e) => setDadosForm({ ...dadosForm, cpfCnpj: e.target.value })} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Form.Item style={{ flexGrow: '1' }} label="Email" name="email" onChange={(e) => setDadosForm({ ...dadosForm, email: e.target.value })} rules={[{ required: true, type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item style={{ flexGrow: '1' }} label="Celular" name="celular" onChange={(e) => setDadosForm({ ...dadosForm, celular: e.target.value })} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Form.Item style={{ flexGrow: '1' }} label="Valor" name="value" onChange={(e) => setDadosForm({ ...dadosForm, value: e.target.value })} rules={[{ required: true }]}>
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item name="billingType" label="Método de Pagamento" rules={[{ required: true }]}>
                        <Select placeholder="Selecione o método de pagamento" onChange={(value) => setDadosForm({ ...dadosForm, billingType: value })}>
                            <Option value="BOLETO">Boleto</Option>
                            <Option value="CREDIT_CARD">Cartão de Crédito</Option>
                            <Option value="PIX">Pix</Option>
                            <Option value="UNDEFINED">Definir no pagamento</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ flexGrow: '1' }} label="Data de Vencimento" name="dueDate" onChange={(e) => setDadosForm({ ...dadosForm, dueDate: e.target.value })} rules={[{ required: true }]}>
                        <Input type="date" />
                    </Form.Item>
                </div>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Enviar
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}

export default FormDoacaoUnica;

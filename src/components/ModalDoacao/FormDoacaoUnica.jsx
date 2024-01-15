import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Form, Input, Button, Select, Card } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const { Option } = Select;
const MySwal = withReactContent(Swal);

const FormDoacaoUnica = ({isMobile}) => {
    const { handleSubmit, control, reset } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        axios.post(`${import.meta.env.VITE_URL_AXIOS}/createClientAndDonation.php`, data)
            .then((response) => {
                if (response.data.success) {
                    MySwal.fire({
                        title: 'Sucesso!',
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.open(response.data.link, '_blank');
                            reset();
                        }
                    })
                } else {
                    MySwal.fire({
                        title: 'Erro!',
                        text: response.data.message,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                }
            })
            .catch((error) => {
                console.log(error.response);
            });
    };

    return (
        <Card style={{minHeight: '600px'}}>
            <h1>Formulário</h1>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 3 }} label="Nome">
                        <Controller
                            name="nome"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="CPF/CNPJ">
                        <Controller
                            name="cpfCnpj"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Email">
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: true, type: 'email' }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Celular">
                        <Controller
                            name="celular"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input {...field} />}
                        />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Valor">
                        <Controller
                            name="value"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="text" {...field} />}
                        />
                    </Form.Item>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} name="billingType" label="Método de Pagamento">
                        <Controller
                            name="billingType"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <Select {...field} placeholder="Selecione o método de pagamento">
                                    <Option value="BOLETO">Boleto</Option>
                                    <Option value="CREDIT_CARD">Cartão de Crédito</Option>
                                    <Option value="PIX">Pix</Option>
                                    <Option value="UNDEFINED">Definir no pagamento</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Data de Vencimento">
                        <Controller
                            name="dueDate"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => <Input type="date" {...field} />}
                        />
                    </Form.Item>
                </div>
                <Form.Item>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Button type="primary" htmlType="submit">
                            Enviar
                        </Button>
                        <Button onClick={() => reset()}>Limpar</Button>
                    </div>
                </Form.Item>

            </Form>
        </Card>
    );
}

export default FormDoacaoUnica;

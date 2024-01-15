import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Select, Typography, Tabs, Collapse, Empty } from "antd";
import { useForm, Controller, get } from 'react-hook-form';
import axios from "axios";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const SubscriptionEditForm = ({ subscription, MySwal, isMobile }) => {
    const [update, setUpdate] = useState(false);
    // form edit subscription
    const { handleSubmit, control, reset } = useForm();
    const { Option } = Select;

    const onSubmit = (formData) => {
        formData.subscription_id = subscription.subscription;
        axios.post(`${import.meta.env.VITE_URL_AXIOS}/updateSubscription.php`, formData)
            .then((response) => {
                if (response.data.success) {
                    MySwal.fire({
                        title: 'Sucesso!',
                        text: response.data.message,
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            setUpdate(!update);
                        }
                    })
                } else {
                    MySwal.fire({
                        title: 'Erro!',
                        text: response.data.error,
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    })
                }
            })
            .catch((error) => {
                console.log(error.response);
            });
        
    }
    useEffect(() => {
        const data = {
            subscription_id: subscription.subscription
        };
    
        axios.post(`${import.meta.env.VITE_URL_AXIOS}/getSubscriptionById.php`, data)
            .then((response) => {
                if (response.data.success) {
                    const initialValues = {
                        vencimento: response.data.data.nextDueDate,
                        valor: response.data.data.value,
                        ciclo_cobranca: response.data.data.cycle,
                        forma_pagamento: response.data.data.billingType,
                    };
    
                    reset(initialValues);
                }
            })
            .catch((error) => {
                console.log(error.response);                
                reset();
            });
    }, [subscription, reset, update]);
    


        return (
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Data de Vencimento">
                        <Controller
                            name="vencimento"
                            control={control}
                            render={({ field }) => <Input type="date" {...field} placeholder="Data de Vencimento" />}
                        />
                    </Form.Item>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Valor">
                        <Controller
                            name="valor"
                            control={control}
                            render={({ field }) => <Input {...field} placeholder="Valor" />}
                        />
                    </Form.Item>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Ciclo de Cobrança">
                        <Controller
                            name="ciclo_cobranca"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} placeholder="Ciclo Cobrança">
                                    <Option value="MONTHLY">Mensal</Option>
                                    <Option value="WEEKLY">Semanal</Option>
                                    <Option value="BIWEEKLY">Quinzenal</Option>
                                    <Option value="QUARTERLY">Trimestral</Option>
                                    <Option value="SEMIANNUALLY">Semestral</Option>
                                    <Option value="YEARLY">Anual</Option>
                                </Select>
                            )}
                        />
                    </Form.Item>
                    <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Forma de Pagamento">
                        <Controller
                            name="forma_pagamento"
                            control={control}
                            render={({ field }) => (
                                <Select {...field} placeholder="Forma de Pagamento">
                                    <Option value="BOLETO">Boleto</Option>
                                    <Option value="CREDIT_CARD">Cartão de Crédito</Option>
                                    <Option value="PIX">PIX</Option>
                                    <Option value="UNDEFINED">Definir no pagamento</Option>
                                </Select>
                            )}
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
        );
    };

    const FormDoacaoRecorrente = ({isMobile}) => {

        const [theUser, setTheUser] = useState({});
        const [subscriptions, setSubscriptions] = useState([]);

        const { Option } = Select;
        const { Title } = Typography;

        const MySwal = withReactContent(Swal);

        const { handleSubmit, control, reset } = useForm();

        const onSubmit = (formData) => {
            axios.post(`${import.meta.env.VITE_URL_AXIOS}/createSubscription.php`, formData)
                .then((response) => {
                    console.log(response)
                })
                .catch((error) => {
                    console.log(error.response);
                });
        };

        const fetchUserData = async () => {
            const loginToken = localStorage.getItem("loginToken");
            if (loginToken) {
                axios.defaults.headers.common["Authorization"] = `bearer ${loginToken}`;
                try {
                    const { data } = await axios.get(
                        `https://amigosdacasa.org.br/gerenciador-doacoes-amigosdacasa/login_site/user-info.php`
                    );
                    setTheUser(data.user);
                    if (data.success && data.user) {
                        reset(data.user); // Inicializa o formulário com os dados do usuário
                    }
                } catch (error) {
                    console.error("Erro ao buscar informações do usuário:", error);
                }
            }
        };



        const getSubscriptions = async () => {
            const data = {
                customer_id: theUser.customer_id
            }
            axios.post(`${import.meta.env.VITE_URL_AXIOS}/getSubscriptions.php`, data)
                .then((response) => {
                    if (response.data.success) {
                        setSubscriptions(response.data.data);
                    }
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }

        useEffect(() => {

            fetchUserData();

        }, [reset]);

        useEffect(() => {
            getSubscriptions();
        }, [theUser]);

        const logoutUser = () => {
            localStorage.removeItem("loginToken");
        }
        // ##################### collapse #####################

        const items = subscriptions.map((sub) => ({
            key: sub.id.toString(),
            label: `Doação criada em ${sub.dateCreated.split('-').reverse().join('/')} com vencimento em ${sub.dueDate.split('-').reverse().join('/')}`,
            children: (
                <SubscriptionEditForm
                    subscription={sub}
                    MySwal={MySwal}
                />
            ),
        }));




        return (
            <Card style={{minHeight: '600px'}}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Title level={3}>Doação Recorrente</Title>
                    <Button onClick={logoutUser}>Logout</Button>
                </div>

                <Tabs
                    style={{ marginTop: '10px' }}
                    defaultActiveKey="1"
                    type="card"
                    items={[
                        {
                            label: `Criar doação recorrente`,
                            key: '1',
                            children: <>
                                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                        <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="ID do Doador">
                                            <Controller
                                                name="customer_id"
                                                control={control}
                                                render={({ field }) => <Input readOnly {...field} placeholder="ID do Doador" />}
                                            />
                                        </Form.Item>
                                        <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="CPF">
                                            <Controller
                                                name="cpf"
                                                control={control}
                                                render={({ field }) => <Input readOnly {...field} placeholder="CPF" />}
                                            />
                                        </Form.Item>
                                    </div>
                                    <Form.Item label="Nome">
                                        <Controller
                                            name="name"
                                            control={control}
                                            render={({ field }) => <Input readOnly {...field} placeholder="Nome" />}
                                        />
                                    </Form.Item>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                        <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Data de Vencimento">
                                            <Controller
                                                name="vencimento"
                                                control={control}
                                                render={({ field }) => <Input type="date" {...field} placeholder="Data de Vencimento" />}
                                            />
                                        </Form.Item>
                                        <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Valor">
                                            <Controller
                                                name="valor"
                                                control={control}
                                                render={({ field }) => <Input {...field} placeholder="Valor" />}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                        <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Ciclo de Cobrança">
                                            <Controller
                                                name="ciclo_cobranca"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select {...field} placeholder="Ciclo Cobrança">
                                                        <Option value="MONTHLY">Mensal</Option>
                                                        <Option value="WEEKLY">Semanal</Option>
                                                        <Option value="BIWEEKLY">Quinzenal</Option>
                                                        <Option value="QUARTERLY">Trimestral</Option>
                                                        <Option value="SEMIANNUALLY">Semestral</Option>
                                                        <Option value="YEARLY">Anual</Option>
                                                    </Select>
                                                )}
                                            />
                                        </Form.Item>
                                        <Form.Item style={isMobile ? { width: '100%' } : { flexGrow: 1 }} label="Forma de Pagamento">
                                            <Controller
                                                name="forma_pagamento"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select {...field} placeholder="Forma de Pagamento">
                                                        <Option value="BOLETO">Boleto</Option>
                                                        <Option value="CREDIT_CARD">Cartão de Crédito</Option>
                                                        <Option value="PIX">PIX</Option>
                                                        <Option value="UNDEFINED">Definir no pagamento</Option>
                                                    </Select>
                                                )}
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
                            </>,
                        },
                        {
                            label: `Minhas doações`,
                            key: '2',
                            children: {items}.length > 0 ? <Collapse accordion items={items} /> : <Empty description='Nenhuma doação foi criada' />,
                        },
                        {
                            label: `Como funciona?`,
                            key: '3',
                            children: <>
                                <h2>Como funciona?</h2>
                                <p>Instruções aqui...</p>
                            </>,
                        }
                    ]}
                />
            </Card>
        )
    }

    export default FormDoacaoRecorrente;


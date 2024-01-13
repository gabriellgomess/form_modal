import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Select, Typography, Tabs, Collapse  } from "antd";
import { useForm, Controller, get } from 'react-hook-form';
import axios from "axios";

const FormDoacaoRecorrente = () => {

    const [theUser, setTheUser] = useState({});
    const [subscriptions, setSubscriptions] = useState([]);

    const { Option } = Select;
    const { Title } = Typography;

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
            if(response.data.success) {
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
        label: `
        Doação criada em ${sub.dateCreated.split('-').reverse().join('/')}
        com vencimento em ${sub.dueDate.split('-').reverse().join('/')}`,
        children: <p>{sub.value}</p>,
      }));
    
    return (
        <Card>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Title level={3}>Doação Recorrente</Title>                
                <Button onClick={logoutUser}>Logout</Button>
            </div>

            <Tabs
            style={{marginTop: '10px'}}
                defaultActiveKey="1"
                type="card"
                items={[
                    {
                        label: `Criar doação recorrente`,
                        key: '1',
                        children: <>
                        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <Form.Item style={{flexGrow: '1'}} label="ID do Doador">
                                <Controller
                                    name="customer_id"
                                    control={control}
                                    render={({ field }) => <Input readOnly {...field} placeholder="ID do Doador" />}
                                />
                                </Form.Item>
                                <Form.Item style={{flexGrow: '1'}} label="CPF">
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
                            <div style={{display: 'flex', gap: '10px'}}>
                                <Form.Item style={{flexGrow: '1'}} label="Data de Vencimento">
                                    <Controller
                                        name="vencimento"                        
                                        control={control}
                                        render={({ field }) => <Input type="date" {...field} placeholder="Data de Vencimento" />}
                                    />
                                </Form.Item>
                                <Form.Item style={{flexGrow: '1'}} label="Valor">
                                    <Controller
                                        name="valor"                        
                                        control={control}
                                        render={({ field }) => <Input {...field} placeholder="Valor" />}
                                    />
                                </Form.Item>
                            </div>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <Form.Item style={{flexGrow: '1'}} label="Ciclo de Cobrança">
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
                                <Form.Item style={{flexGrow: '1'}} label="Forma de Pagamento">
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
                        children: <Collapse accordion items={items} />,
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




// {
//     "success": 1,
//     "status": 200,
//     "user": {
//         "id": "24",
//         "customer_id": "cus_000076270191",
//         "name": "Gabriel Gomes",
//         "email": "gabriel.gomes@outlook.com",
//         "bairro": "Lomba da Palmeira",
//         "celular": "51997073430",
//         "cep": "93225070",
//         "cidade": "Sapucaia do Sul",
//         "complemento": null,
//         "cpf": "83029052087",
//         "estado": "RS",
//         "numero": "340",
//         "rua": "Rua Gilberto Ferraz",
//         "telefone": null
//     }
// }

// {
//     "success": true,
//     "message": "Assinaturas do cliente encontradas!",
//     "data": [
//       {
//         "object": "payment",
//         "id": "pay_duaf3hb3hrengf1n",
//         "dateCreated": "2024-01-12",
//         "customer": "cus_000076473310",
//         "subscription": "sub_4witrrhe78ch1xvp",
//         "paymentLink": null,
//         "value": 12,
//         "netValue": 11.160000000000000142108547152020037174224853515625,
//         "originalValue": null,
//         "interestValue": null,
//         "description": null,
//         "billingType": "CREDIT_CARD",
//         "confirmedDate": null,
//         "creditCard": null,
//         "pixTransaction": null,
//         "status": "PENDING",
//         "dueDate": "2024-01-30",
//         "originalDueDate": "2024-01-30",
//         "paymentDate": null,
//         "clientPaymentDate": null,
//         "installmentNumber": null,
//         "invoiceUrl": "https:\/\/www.asaas.com\/i\/duaf3hb3hrengf1n",
//         "invoiceNumber": "354084521",
//         "externalReference": null,
//         "deleted": false,
//         "anticipated": false,
//         "anticipable": false,
//         "creditDate": null,
//         "estimatedCreditDate": null,
//         "transactionReceiptUrl": null,
//         "nossoNumero": null,
//         "bankSlipUrl": null,
//         "lastInvoiceViewedDate": "2024-01-12T23:32:18Z",
//         "lastBankSlipViewedDate": null,
//         "discount": {
//           "value": 0,
//           "limitDate": null,
//           "dueDateLimitDays": 0,
//           "type": "FIXED"
//         },
//         "fine": {
//           "value": 0,
//           "type": "FIXED"
//         },
//         "interest": {
//           "value": 0,
//           "type": "PERCENTAGE"
//         },
//         "postalService": false,
//         "custody": null,
//         "refunds": null
//       },
//       {
//         "object": "payment",
//         "id": "pay_dgdnysyjwb0mm91z",
//         "dateCreated": "2024-01-12",
//         "customer": "cus_000076473310",
//         "subscription": "sub_wvxmt0br0w8z4pt6",
//         "paymentLink": null,
//         "value": 5,
//         "netValue": 3.0099999999999997868371792719699442386627197265625,
//         "originalValue": null,
//         "interestValue": null,
//         "description": null,
//         "billingType": "BOLETO",
//         "canBePaidAfterDueDate": true,
//         "pixTransaction": null,
//         "status": "PENDING",
//         "dueDate": "2024-02-01",
//         "originalDueDate": "2024-02-01",
//         "paymentDate": null,
//         "clientPaymentDate": null,
//         "installmentNumber": null,
//         "invoiceUrl": "https:\/\/www.asaas.com\/i\/dgdnysyjwb0mm91z",
//         "invoiceNumber": "354074402",
//         "externalReference": null,
//         "deleted": false,
//         "anticipated": false,
//         "anticipable": false,
//         "creditDate": null,
//         "estimatedCreditDate": null,
//         "transactionReceiptUrl": null,
//         "nossoNumero": "187547623",
//         "bankSlipUrl": "https:\/\/www.asaas.com\/b\/pdf\/dgdnysyjwb0mm91z",
//         "lastInvoiceViewedDate": "2024-01-12T23:14:08Z",
//         "lastBankSlipViewedDate": null,
//         "discount": {
//           "value": 0,
//           "limitDate": null,
//           "dueDateLimitDays": 0,
//           "type": "FIXED"
//         },
//         "fine": {
//           "value": 0,
//           "type": "FIXED"
//         },
//         "interest": {
//           "value": 0,
//           "type": "PERCENTAGE"
//         },
//         "postalService": false,
//         "custody": null,
//         "refunds": null
//       }
//     ]
//   }
  
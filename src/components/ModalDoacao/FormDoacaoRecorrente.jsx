import { useEffect, useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { useForm, Controller, set } from 'react-hook-form';
import axios from "axios";

const FormDoacaoRecorrente = ({ }) => {
    const [isAuth, setIsAuth] = useState(false);
    const [theUser, setTheUser] = useState({});
    const [update, setUpdate] = useState(false);
    const [doador, setDoador] = useState({});

    const { handleSubmit, control, reset } = useForm();

    const onSubmit = (doador) => {
        console.log(doador);

    };
    useEffect(() => {
        const fetchUserData = async () => {
            const loginToken = localStorage.getItem("loginToken");
            if (loginToken) {
                axios.defaults.headers.common["Authorization"] = "bearer " + loginToken;
                try {
                    const { data } = await axios.get(
                        `https://amigosdacasa.org.br/gerenciador-doacoes-amigosdacasa/login_site/user-info.php`
                    );
                    if (data.success && data.user) {
                        setIsAuth(true);
                        setTheUser(data.user);
                        setUpdate(!update);
                        setDoador(theUser);
                    } else {
                        setIsAuth(false);
                        setUpdate(!update);
                    }
                } catch (error) {
                    console.error("Erro ao buscar informações do usuário:", error);
                    setIsAuth(false);
                    setUpdate(!update);
                }
            }
        };

        fetchUserData();
    }, []);

    const logoutUser = () => {
        localStorage.removeItem("loginToken");
        setIsAuth(false);
        setTheUser({});
    }

    console.log(theUser.name);
    return (
        <Card>
            <Button onClick={logoutUser}>Logout</Button>
            <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                <Form.Item label="Nome" labelCol={{ style: { fontWeight: 'bold' } }}>
                    <Input placeholder="Nome" value={doador.name} onChange={(e) => setDoador({ ...doador, name: e.target.value })} /> 
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Enviar
                    </Button>
                </Form.Item>
            </Form>

        </Card>
    )
}

export default FormDoacaoRecorrente

// ESTÁ CARREGANDO O NOME NO INCIO, É POSSÍVEL ALTERAR O INPUT, MAS NO ENVIO DO FORM VAI UM ARRAY VAZIO

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
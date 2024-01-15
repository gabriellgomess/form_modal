import React, { useState } from 'react';
import { ConfigProvider, Segmented } from 'antd';
import { useMediaQuery } from 'react-responsive';

// Import components
import FormDoacaoUnica from './FormDoacaoUnica';
import DoacaoRecorrente from './DoacaoRecorrente';
import DoacaoIR from './DoacaoIR';

// Definindo tokens de design personalizados
const theme = {
  components: {
    Segmented: {
      itemSelectedBg: '#73c4bb',
      itemSelectedColor: '#fff',
    },
    Button: {
      colorPrimary: '#73c4bb',
      colorPrimaryHover: '#97e1d9',
      colorPrimaryActive: '#41958c',
      colorPrimaryFocus: '#41958c',

    },
    Input: {
      colorPrimary: '#73c4bb',
      colorPrimaryActive: '#41958c',
      colorPrimaryFocus: '#41958c',
      colorPrimaryHover: '#97e1d9',
    },
    Select: {
      colorPrimary: '#73c4bb',
      colorPrimaryActive: '#41958c',
      colorPrimaryFocus: '#41958c',
      colorPrimaryHover: '#97e1d9',
    },  
    Tabs: {
      colorPrimary: '#73c4bb',
      colorPrimaryActive: '#41958c',
      colorPrimaryFocus: '#41958c',
      colorPrimaryHover: '#97e1d9',
    }  
  },
};

const Modal = () => {
  const [selectedOption, setSelectedOption] = useState('Doação Única');

  const isMobile = useMediaQuery({ maxWidth: 767 });

  const renderContent = () => {
    switch (selectedOption) {
      case 'Doação Única':
        return <FormDoacaoUnica isMobile={isMobile} />;
      case 'Doação Recorrente':
        return <DoacaoRecorrente isMobile={isMobile} />;
      case 'Doação IR':
        return <DoacaoIR isMobile={isMobile} />;
      default:
        return <div>Selecione uma opção</div>;
    }
  };

  return (
    <ConfigProvider theme={theme}>
      <>
        <Segmented
          options={['Doação Única', 'Doação Recorrente', 'Doação IR']}
          onChange={(value) => setSelectedOption(value)}
          style={{ marginBottom: '20px' }}
        />
        {renderContent()}
      </>
    </ConfigProvider>
  );
};

export default Modal;

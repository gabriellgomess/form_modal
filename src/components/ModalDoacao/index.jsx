import React, { useState } from 'react';
import { Segmented } from 'antd';

// Import components
import FormDoacaoUnica from './FormDoacaoUnica';
import FormDoacaoRecorrente from './FormDoacaoRecorrente';
import DoacaoIR from './DoacaoIR';

const Modal = () => {
  const [selectedOption, setSelectedOption] = useState('Doação Única');

  const renderContent = () => {
    switch (selectedOption) {
      case 'Doação Única':
        return <FormDoacaoUnica />;
      case 'Doação Recorrente':
        return <FormDoacaoRecorrente />;
      case 'Doação IR':
        return <DoacaoIR />;
      default:
        return <div>Selecione uma opção</div>;
    }
  };

  return (
    <>
      <Segmented 
        options={['Doação Única', 'Doação Recorrente', 'Doação IR']}
        onChange={(value) => setSelectedOption(value)}
      />
      {renderContent()}
    </>
  );
};

export default Modal;

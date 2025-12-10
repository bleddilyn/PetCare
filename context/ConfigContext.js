import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConfigContext = createContext();

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState({
    mostrarTensao: true,
    mostrarCorrente: true,
    mostrarConsumo: true,
    mostrarConta: true,
  });

  const [dispositivos, setDispositivos] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem('@config');
        if (json) {
          const configSalvo = JSON.parse(json);
          setConfig({
            mostrarTensao: configSalvo.mostrarTensao !== undefined ? configSalvo.mostrarTensao : true,
            mostrarCorrente: configSalvo.mostrarCorrente !== undefined ? configSalvo.mostrarCorrente : true,
            mostrarConsumo: configSalvo.mostrarConsumo !== undefined ? configSalvo.mostrarConsumo : true,
            mostrarConta: configSalvo.mostrarConta !== undefined ? configSalvo.mostrarConta : true,
          });
        }
        const dispositivosSalvos = await AsyncStorage.getItem('@dispositivos');
        if (dispositivosSalvos) {
          try {
            const parsed = JSON.parse(dispositivosSalvos);
            if (Array.isArray(parsed)) {
              setDispositivos(parsed);
            } else {
              setDispositivos([]);
            }
          } catch (e) {
            console.log('Erro ao parsear dispositivos:', e);
            setDispositivos([]);
          }
        } else {
          const dispositivoAntigo = await AsyncStorage.getItem('@dispositivoCadastrado');
          if (dispositivoAntigo) {
            const dispositivoMigrado = [{
              id: Date.now().toString(),
              nome: dispositivoAntigo,
              tensao: null,
              potencia: null
            }];
            setDispositivos(dispositivoMigrado);
            await AsyncStorage.setItem('@dispositivos', JSON.stringify(dispositivoMigrado));
            await AsyncStorage.removeItem('@dispositivoCadastrado');
          }
        }
      } catch (e) {
        console.log('Erro ao carregar config:', e);
      }
    })();
  }, []);

  const atualizarConfig = async (novasConfigs) => {
    try {
      const novaConfig = { ...config, ...novasConfigs };
      setConfig(novaConfig);
      await AsyncStorage.setItem('@config', JSON.stringify(novaConfig));
    } catch (e) {
      console.log('Erro ao atualizar config:', e);
    }
  };

  const adicionarDispositivo = async (dispositivo) => {
    try {
      const novoDispositivo = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        nome: dispositivo.nome,
        tensao: dispositivo.tensao || null,
        potencia: dispositivo.potencia || null,
      };
      const novaLista = [...dispositivos, novoDispositivo];
      setDispositivos(novaLista);
      await AsyncStorage.setItem('@dispositivos', JSON.stringify(novaLista));
      return novoDispositivo;
    } catch (e) {
      console.log('Erro ao adicionar dispositivo:', e);
      throw e;
    }
  };

  const atualizarDispositivo = async (id, novoNome) => {
    try {
      const novaLista = dispositivos.map(disp => 
        disp.id === id ? { ...disp, nome: novoNome } : disp
      );
      setDispositivos(novaLista);
      await AsyncStorage.setItem('@dispositivos', JSON.stringify(novaLista));
    } catch (e) {
      console.log('Erro ao atualizar dispositivo:', e);
    }
  };

  const removerDispositivo = async (id) => {
    try {
      const novaLista = dispositivos.filter(disp => disp.id !== id);
      setDispositivos(novaLista);
      await AsyncStorage.setItem('@dispositivos', JSON.stringify(novaLista));
    } catch (e) {
      console.log('Erro ao remover dispositivo:', e);
    }
  };

  const dispositivoCadastrado = dispositivos.length > 0 ? dispositivos[0].nome : null;
  const setDispositivoCadastrado = async (novoNome) => {
    if (dispositivos.length === 0 && novoNome) {
      await adicionarDispositivo({ nome: novoNome, tensao: null, potencia: null });
    } else if (dispositivos.length > 0 && novoNome) {
      await atualizarDispositivo(dispositivos[0].id, novoNome);
    } else if (dispositivos.length > 0 && !novoNome) {
      await removerDispositivo(dispositivos[0].id);
    }
  };

  const contextValue = {
    config,
    setConfig,
    atualizarConfig,
    dispositivos,
    adicionarDispositivo,
    atualizarDispositivo,
    removerDispositivo,
    dispositivoCadastrado,
    setDispositivoCadastrado,
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  return useContext(ConfigContext);
}

import router from '@/router';
import { Err } from '@/types';
import { error_GD00400 } from '@/utils/errors';
import React, { Dispatch, SetStateAction, createContext, useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import i18n from './i18n';

const MainContext = createContext({
  i18n: i18n,
  isExpired: false,
  setExpired: {} as Dispatch<SetStateAction<boolean>>,
  errorHandler: (_: Err) => {},
});

interface Props {
  children: React.ReactNode;
}

export const MainProvider: React.FC<Props> = ({ children }) => {
  const [isExpired, setExpired] = useState(false);
  const { t } = useTranslation();

  /** * To be called on catch to show toast or session expired Modal @Prama Err @type(Err) @return Toast*/
  const errorHandler = useCallback(
    (e: Err) => {
      if (e.codiceErrore === error_GD00400) {
        toast.error(t(`errors.${e.codiceErrore}`, e.messaggioErrore || e.codiceErrore));
        router.navigate('/');
      } else {
        toast.error(t(`errors.${e.codiceErrore}`, e.messaggioErrore || e.codiceErrore));
      }
    },
    [t]
  );
  return <MainContext.Provider value={{ i18n, isExpired, setExpired, errorHandler }}>{children}</MainContext.Provider>;
};

export function useMainContext() {
  const context = useContext(MainContext);

  if (!context) {
    throw new Error('useMainContext must be used within MainProvider');
  }

  return context;
}

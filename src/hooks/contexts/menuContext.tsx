import React, { useContext, useState } from 'react';

interface IMenuContextProps {
  selectedMenu: string;
  setSelectedMenu: (menu: string) => void;
}

export const MenuContext = React.createContext<IMenuContextProps>({
  selectedMenu: 'inicio',
  setSelectedMenu: () => {},
});

export const MenuProvider = (props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
  const [selectedMenu, setSelectedMenu] = useState('inicio');
  
  return (
    <MenuContext.Provider
      value={{
        selectedMenu,
        setSelectedMenu
      }}
    >
      {props.children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => useContext(MenuContext);
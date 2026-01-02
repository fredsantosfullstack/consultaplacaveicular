import React, { useEffect, useState } from 'react';
import { FaWindows, FaApple, FaLinux, FaChrome, FaFirefox, FaEdge, FaSafari, FaQuestionCircle } from 'react-icons/fa';

const DeviceInfo: React.FC = () => {
  const [deviceInfo, setDeviceInfo] = useState({ os: 'Desconhecido', browser: 'Desconhecido' });

  useEffect(() => {
    const getOS = () => {
      const userAgent = window.navigator.userAgent;
      if (userAgent.indexOf('Win') !== -1) return 'Windows';
      if (userAgent.indexOf('Mac') !== -1) return 'macOS';
      if (userAgent.indexOf('Linux') !== -1) return 'Linux';
      return 'Desconhecido';
    };

    const getBrowser = () => {
      const userAgent = window.navigator.userAgent;
      if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg') === -1) return 'Chrome';
      if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
      if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) return 'Safari';
      if (userAgent.indexOf('Edg') > -1) return 'Edge';
      return 'Desconhecido';
    };

    setDeviceInfo({ os: getOS(), browser: getBrowser() });
  }, []);

    const getIcon = (icon: React.ElementType, props?: object) => React.createElement(icon, { className: 'inline ml-1', ...props });

  const osIcons: { [key: string]: React.ReactNode } = {
    Windows: getIcon(FaWindows),
    macOS: getIcon(FaApple),
    Linux: getIcon(FaLinux),
    Desconhecido: getIcon(FaQuestionCircle),
  };

  const browserIcons: { [key: string]: React.ReactNode } = {
    Chrome: getIcon(FaChrome),
    Firefox: getIcon(FaFirefox),
    Safari: getIcon(FaSafari),
    Edge: getIcon(FaEdge),
    Desconhecido: getIcon(FaQuestionCircle),
  };

  return (
    <div className="text-center text-xs text-gray-500 space-y-2">
        <p>
            Sistema: {deviceInfo.os} {osIcons[deviceInfo.os]} | Navegador: {deviceInfo.browser} {browserIcons[deviceInfo.browser]}
        </p>
    </div>
  );
};

export default DeviceInfo;

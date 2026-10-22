import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'hero' | 'minimal';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showGenericModal, setShowGenericModal] = useState(false);

  // If already installed in standalone mode
  if (isInstalled) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-lg border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">App Instalada</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      setShowGenericModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        type="button"
        title="Instalar Graduaciones en este dispositivo"
        className={`inline-flex items-center gap-1.5 font-semibold transition-all shadow-sm active:scale-95 ${
          variant === 'header'
            ? 'px-3 py-1.5 text-xs text-amber-900 bg-amber-400 hover:bg-amber-300 rounded-lg border border-amber-500/30'
            : variant === 'minimal'
            ? 'p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg'
            : 'px-4 py-2.5 text-sm text-white bg-slate-900 hover:bg-slate-800 rounded-xl'
        } ${className}`}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="whitespace-nowrap">Instalar</span>
      </button>

      {/* iOS Safari instructions modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Instalar en iPhone o iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <ol className="mt-4 space-y-3 text-xs text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold shrink-0 text-[11px]">
                  1
                </span>
                <span>
                  Presiona el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en la barra de Safari.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold shrink-0 text-[11px]">
                  2
                </span>
                <span>
                  Desliza hacia abajo y toca <strong>"Agregar al inicio"</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold shrink-0 text-[11px]">
                  3
                </span>
                <span>
                  Toca <strong>"Agregar"</strong> para abrir Graduaciones como app nativa a pantalla completa.
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIOSModal(false)}
              className="mt-6 w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* Desktop / Android generic modal if prompt not immediately triggered */}
      {showGenericModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Instalación Rápida</h3>
              <button
                onClick={() => setShowGenericModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-600 leading-relaxed">
              Puedes instalar <strong>Graduaciones</strong> directamente desde el icono de instalación en la barra de direcciones de tu navegador (Chrome, Edge o Brave) o mediante el menú <strong>(⋮) &gt; "Instalar Graduaciones"</strong>.
            </p>

            <button
              onClick={() => setShowGenericModal(false)}
              className="mt-5 w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </>
  );
};

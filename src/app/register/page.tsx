'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Sun, Moon } from 'lucide-react';
import { accountService } from '@/services/accountService';
import { useAuth } from '@/contexts/AuthContext';

const BUSINESS_UNITS = [
  { value: 'RELACIONAMENTO_CLIENTES', label: 'Relacionamento com Clientes' },
  { value: 'CONTROLADORIA', label: 'Controladoria' },
  { value: 'ENG_TECH', label: 'Eng & Tech' },
  { value: 'PESSOAS_CULTURA', label: 'Pessoas e Cultura' },
  { value: 'MARKETING', label: 'Marketing' },
  { value: 'COMERCIAL', label: 'Comercial' },
] as const;

const SECTORS_BY_BU: Record<string, Array<{ value: string; label: string }>> = {
  RELACIONAMENTO_CLIENTES: [
    { value: 'SUPPORT', label: 'Suporte' },
    { value: 'CUSTOMER_SUCCESS', label: 'Customer Success' },
  ],
  ENG_TECH: [
    { value: 'DEVELOPMENT', label: 'Desenvolvimento' },
    { value: 'DEVOPS', label: 'DevOps' },
    { value: 'QUALITY_ASSURANCE', label: 'Q.A' },
  ],
  PESSOAS_CULTURA: [
    { value: 'HUMAN_RESOURCES', label: 'RH' },
    { value: 'FACILITIES', label: 'Facilities' },
  ],
};

const UNEPS = [
  { value: 'IMPULSO_VAREJISTA', label: 'Impulso Varejista' },
  { value: 'GESTAO_ATENDIMENTO', label: 'Gestão de Atendimento' },
  { value: 'COMUNICACAO_DIGITAL', label: 'Comunicação Digital' },
  { value: 'GESTAO_NEGOCIOS_INTELIGENTE', label: 'Gestão de Negócios Inteligente' },
  { value: 'PERFORMANCE_DIGITAL', label: 'Performance Digital' },
] as const;

export default function RegisterPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessUnit, setBusinessUnit] = useState('');
  const [sector, setSector] = useState('');
  const [unep, setUnep] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    businessUnit?: string;
    sector?: string;
    unep?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const router = useRouter();
  const { setUser } = useAuth();

  const totalSteps = 2;

  const hasSectors = businessUnit && SECTORS_BY_BU[businessUnit];
  const availableSectors = businessUnit ? SECTORS_BY_BU[businessUnit] || [] : [];

  const handleBusinessUnitChange = (value: string) => {
    setBusinessUnit(value);
    setSector('');
    setUnep('');
  };

  const handleSectorChange = (value: string) => {
    setSector(value);
    setUnep('');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('askia-theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    } else if (savedTheme === null) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('askia-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const validateStep1 = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
    } = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido.';
    } else if (!email.endsWith('@grupoirrah.com')) {
      newErrors.email = 'Apenas emails @grupoirrah.com são permitidos.';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {
      businessUnit?: string;
      sector?: string;
      unep?: string;
    } = {};

    if (!businessUnit) {
      newErrors.businessUnit = 'Business Unit é obrigatória.';
    }

    if (hasSectors && !sector) {
      newErrors.sector = 'Setor é obrigatório para esta Business Unit.';
    }

    if (sector && !unep) {
      newErrors.unep = 'UNEP é obrigatória para este setor.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    setApiError('');
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setApiError('');
    setErrors({});
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    try {
      const userData = await accountService.createAccount({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
        businessUnit: businessUnit,
        sector: sector || undefined,
        unep: unep || undefined,
      });

      setUser(userData);

      router.push('/chat');
    } catch (error: any) {
      setApiError(error.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFDE14] dark:bg-black transition-colors duration-300 flex items-center justify-center p-4 py-8 relative">
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
        aria-label="Alternar tema"
      >
        {isDarkMode ? (
          <Sun className="w-6 h-6 text-yellow-500" />
        ) : (
          <Moon className="w-6 h-6 text-gray-900" />
        )}
      </button>


      <div className="relative w-full max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-300 dark:border-gray-700 overflow-hidden">

          <div className="p-8 md:p-10">
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#FFDE14] to-[#E6C800] flex items-center justify-center shadow-lg">
                <Sparkles className="w-8 h-8 text-gray-900" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Criar Conta
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {currentStep === 1
                  ? 'Primeiro, vamos conhecer você'
                  : 'Agora, conte-nos sobre seu trabalho'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              {[1, 2].map((step) => (
                <div key={step} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                        step < currentStep
                          ? 'bg-[#FFDE14] text-gray-900'
                          : step === currentStep
                          ? 'bg-gradient-to-br from-[#FFDE14] to-[#E6C800] text-gray-900 shadow-lg scale-110'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step < currentStep ? '✓' : step}
                    </div>
                    {step < totalSteps && (
                      <div
                        className={`w-16 h-1 mx-2 transition-all duration-300 ${
                          step < currentStep
                            ? 'bg-[#FFDE14]'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form className="space-y-6" onSubmit={currentStep === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleRegister}>
              {currentStep === 1 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Seu nome completo"
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                        errors.name ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'
                      } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all`}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>•</span> {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Corporativo
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@grupoirrah.com"
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                        errors.email ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'
                      } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>•</span> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Senha
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 8 caracteres"
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                        errors.password ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'
                      } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all`}
                    />
                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>•</span> {errors.password}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              )}

              {currentStep === 2 && (
              <div className="space-y-5 animate-in slide-in-from-right-4 duration-300">

                <div className="space-y-4">
                  <div>
                    <label htmlFor="businessUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Empreendimento
                    </label>
                    <select
                      id="businessUnit"
                      value={businessUnit}
                      onChange={(e) => handleBusinessUnitChange(e.target.value)}
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                        errors.businessUnit ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'
                      } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all`}
                    >
                      <option value="">Selecione seu empreendimento</option>
                      {BUSINESS_UNITS.map((bu) => (
                        <option key={bu.value} value={bu.value}>
                          {bu.label}
                        </option>
                      ))}
                    </select>
                    {errors.businessUnit && (
                      <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                        <span>•</span> {errors.businessUnit}
                      </p>
                    )}
                  </div>

                  {hasSectors && (
                    <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                      <div>
                        <label htmlFor="sector" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Setor
                        </label>
                        <select
                          id="sector"
                          value={sector}
                          onChange={(e) => handleSectorChange(e.target.value)}
                          className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                            errors.sector ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'
                          } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all`}
                        >
                          <option value="">Selecione seu setor</option>
                          {availableSectors.map((sec) => (
                            <option key={sec.value} value={sec.value}>
                              {sec.label}
                            </option>
                          ))}
                        </select>
                        {errors.sector && (
                          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                            <span>•</span> {errors.sector}
                          </p>
                        )}
                      </div>

                      {sector && (
                        <div className="animate-in slide-in-from-top-2 duration-300">
                          <label htmlFor="unep" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            UNEP
                          </label>
                          <select
                            id="unep"
                            value={unep}
                            onChange={(e) => setUnep(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-700 border-2 ${
                              errors.unep ? 'border-red-500' : 'border-gray-400 dark:border-gray-600'
                            } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FFDE14] dark:focus:ring-[#FFDE14] focus:border-transparent transition-all`}
                          >
                            <option value="">Selecione a UNEP</option>
                            {UNEPS.map((unepOption) => (
                              <option key={unepOption.value} value={unepOption.value}>
                                {unepOption.label}
                              </option>
                            ))}
                          </select>
                          {errors.unep && (
                            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                              <span>•</span> {errors.unep}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              )}

              {apiError && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-xl animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 flex-1">{apiError}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    disabled={isLoading}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    <span>Voltar</span>
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`${currentStep === 1 ? 'w-full' : 'flex-1'} bg-gradient-to-r from-[#FFDE14] to-[#E6C800] hover:from-[#FFEA5F] hover:to-[#FFDE14] text-gray-900 font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      <span>Criando conta...</span>
                    </>
                  ) : (
                    <>
                      <span>{currentStep === 1 ? 'Continuar' : 'Criar Conta'}</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {currentStep === 2 && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-500">
                  Ao criar uma conta, você concorda com nossos termos de uso
                </p>
              )}
            </form>

            {currentStep === 1 && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                      ou
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  Já tem uma conta?{' '}
                  <a
                    href="/"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors hover:underline"
                  >
                    Fazer login
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}

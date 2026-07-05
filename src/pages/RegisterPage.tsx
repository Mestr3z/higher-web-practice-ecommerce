import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useRegisterMutation } from '../api/authApi';
import runner from '../assets/runner.png';
import { Button, FormField, Input } from '../components/ui';
import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../hooks/reduxHooks';
import { hasMinLength, isRequired, isValidEmail } from '../lib/validation';

type RegisterErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const PASSWORD_MIN_LENGTH = 6;

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [formError, setFormError] = useState('');

  const clearError = (field: keyof RegisterErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const nextErrors: RegisterErrors = {};
    if (!isRequired(firstName)) nextErrors.firstName = 'Введите имя';
    if (!isRequired(lastName)) nextErrors.lastName = 'Введите фамилию';
    if (!isValidEmail(email)) nextErrors.email = 'Некорректный email';
    if (!hasMinLength(password, PASSWORD_MIN_LENGTH))
      nextErrors.password = `Минимум ${PASSWORD_MIN_LENGTH} символов`;
    if (confirmPassword !== password) nextErrors.confirmPassword = 'Пароли не совпадают';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const user = await register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      }).unwrap();
      dispatch(setCredentials(user));
      navigate('/');
    } catch {
      setFormError('Пользователь с таким email уже существует');
    }
  };

  return (
    <section className="relative flex min-h-[calc(100vh-160px)] items-center justify-center py-10">
      <img
        src={runner}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain"
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="border-border bg-surface rounded-xl border p-6 shadow-lg sm:p-8">
          <h1 className="text-h2">Регистрация</h1>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-4">
            <FormField label="Имя" htmlFor="firstName" required error={errors.firstName}>
              <Input
                id="firstName"
                placeholder="Ярополк"
                value={firstName}
                invalid={Boolean(errors.firstName)}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  clearError('firstName');
                }}
              />
            </FormField>

            <FormField
              label="Фамилия"
              htmlFor="lastName"
              required
              error={errors.lastName}
            >
              <Input
                id="lastName"
                placeholder="Иванов"
                value={lastName}
                invalid={Boolean(errors.lastName)}
                onChange={(e) => {
                  setLastName(e.target.value);
                  clearError('lastName');
                }}
              />
            </FormField>

            <FormField label="Email" htmlFor="email" required error={errors.email}>
              <Input
                id="email"
                type="email"
                placeholder="ivanov@yandex.ru"
                value={email}
                invalid={Boolean(errors.email)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
              />
            </FormField>

            <FormField
              label="Придумайте пароль"
              htmlFor="password"
              required
              error={errors.password}
            >
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                invalid={Boolean(errors.password)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError('password');
                }}
              />
            </FormField>

            <FormField
              label="Повторите пароль"
              htmlFor="confirmPassword"
              required
              error={errors.confirmPassword}
            >
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                value={confirmPassword}
                invalid={Boolean(errors.confirmPassword)}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  clearError('confirmPassword');
                }}
              />
            </FormField>

            {formError && <p className="text-danger text-sm">{formError}</p>}

            <Button type="submit" fullWidth disabled={isLoading} className="mt-2">
              Зарегистрироваться
            </Button>
          </form>

          <p className="text-text-secondary mt-5 text-sm">
            Уже зарегистрированы?
            <Link
              to="/login"
              className="text-accent hover:text-accent-hover mt-1 block font-semibold"
            >
              Войти в аккаунт
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useLoginMutation } from '../api/authApi';
import runner from '../assets/runner.png';
import { Button, FormField, Input } from '../components/ui';
import { setCredentials } from '../features/auth/authSlice';
import { useAppDispatch } from '../hooks/reduxHooks';
import { isRequired } from '../lib/validation';

type LoginErrors = {
  login?: string;
  password?: string;
};

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const nextErrors: LoginErrors = {};
    if (!isRequired(email)) nextErrors.login = 'Введите email или логин';
    if (!isRequired(password)) nextErrors.password = 'Введите пароль';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      const user = await login({ email, password }).unwrap();
      dispatch(setCredentials(user));
      navigate('/');
    } catch {
      setFormError('Неверный email или пароль');
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
          <h1 className="text-h2">Вход в аккаунт</h1>

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <FormField
              label="Ваш email или логин"
              htmlFor="login"
              required
              error={errors.login}
            >
              <Input
                id="login"
                type="text"
                placeholder="ivanov@yandex.ru"
                value={email}
                invalid={Boolean(errors.login)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((prev) => ({ ...prev, login: undefined }));
                }}
              />
            </FormField>

            <FormField label="Пароль" htmlFor="password" required error={errors.password}>
              <Input
                id="password"
                type="password"
                placeholder="••••••"
                value={password}
                invalid={Boolean(errors.password)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
                }}
              />
            </FormField>

            {formError && <p className="text-danger text-sm">{formError}</p>}

            <Button type="submit" fullWidth disabled={isLoading}>
              Войти
            </Button>
          </form>

          <p className="text-text-secondary mt-5 text-sm">
            У вас ещё нет аккаунта?
            <Link
              to="/register"
              className="text-accent hover:text-accent-hover mt-1 block font-semibold"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

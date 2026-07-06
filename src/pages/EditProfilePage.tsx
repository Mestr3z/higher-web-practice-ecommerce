import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUpdateProfileMutation } from '../api/authApi';
import CameraIcon from '../assets/Camera.svg?react';
import meditation from '../assets/meditation.png';
import UserIcon from '../assets/User.svg?react';
import { Button, FormField, Input } from '../components/ui';
import { selectUser, setCredentials } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { hasMinLength, isRequired, isValidEmail } from '../lib/validation';
import type { UpdateProfilePayload } from '../types';

type EditErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

const PASSWORD_MIN_LENGTH = 6;

export function EditProfilePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<EditErrors>({});

  if (!user) return null;

  const clearError = (field: keyof EditErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nextErrors: EditErrors = {};
    if (!isRequired(firstName)) nextErrors.firstName = 'Введите имя';
    if (!isRequired(lastName)) nextErrors.lastName = 'Введите фамилию';
    if (!isValidEmail(email)) nextErrors.email = 'Некорректный email';
    if (password && !hasMinLength(password, PASSWORD_MIN_LENGTH))
      nextErrors.password = `Минимум ${PASSWORD_MIN_LENGTH} символов`;

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const changes: UpdateProfilePayload = { firstName, lastName, email };
    if (password) changes.password = password;

    try {
      const updated = await updateProfile({ id: user.id, changes }).unwrap();
      dispatch(setCredentials(updated));
      navigate('/profile');
    } catch {
      setErrors({ email: 'Не удалось сохранить изменения' });
    }
  };

  return (
    <div>
      <h1 className="text-h2">Мой профиль</h1>

      <div className="relative">
        <div className="bg-surface relative z-10 mt-6 max-w-2xl rounded-xl p-6 shadow-lg">
          <div className="relative mb-6 w-fit">
            <span className="bg-bg text-text-secondary grid h-20 w-20 place-items-center rounded-full">
              <UserIcon className="h-10 w-10" />
            </span>
            <span className="bg-accent absolute right-0 bottom-0 grid h-7 w-7 place-items-center rounded-full text-white">
              <CameraIcon className="h-4 w-4" />
            </span>
          </div>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                label="Имя"
                htmlFor="firstName"
                required
                error={errors.firstName}
              >
                <Input
                  id="firstName"
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
                  value={lastName}
                  invalid={Boolean(errors.lastName)}
                  onChange={(e) => {
                    setLastName(e.target.value);
                    clearError('lastName');
                  }}
                />
              </FormField>
            </div>

            <FormField label="Email" htmlFor="email" required error={errors.email}>
              <Input
                id="email"
                type="email"
                value={email}
                invalid={Boolean(errors.email)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError('email');
                }}
              />
            </FormField>

            <FormField label="Новый пароль" htmlFor="password" error={errors.password}>
              <Input
                id="password"
                type="password"
                placeholder="Оставьте пустым, чтобы не менять"
                value={password}
                invalid={Boolean(errors.password)}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError('password');
                }}
              />
            </FormField>

            <div className="mt-2 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/profile')}
              >
                Отменить
              </Button>
              <Button type="submit" disabled={isLoading}>
                Сохранить
              </Button>
            </div>
          </form>
        </div>

        <img
          src={meditation}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-24 right-0 -z-0 hidden w-full max-w-xl lg:block"
        />
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

import { useUpdateProfileMutation } from '../api/authApi';
import meditation from '../assets/meditation.png';
import UserIcon from '../assets/User.svg?react';
import { Button, Checkbox, FormField, Select } from '../components/ui';
import { selectUser, setCredentials } from '../features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';

import type { UpdateProfilePayload } from '../types';

const LANGUAGE_OPTIONS = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [updateProfile] = useUpdateProfileMutation();

  if (!user) return null;

  const handleUpdate = async (changes: UpdateProfilePayload) => {
    try {
      const updated = await updateProfile({ id: user.id, changes }).unwrap();
      dispatch(setCredentials(updated));
    } catch {
      return;
    }
  };

  return (
    <div>
      <h1 className="text-h2">Мой профиль</h1>

      <div className="bg-surface mt-6 rounded-xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="bg-bg text-text-secondary grid h-16 w-16 shrink-0 place-items-center rounded-full">
              <UserIcon className="h-8 w-8" />
            </span>
            <div>
              <p className="text-text text-base font-semibold">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-text-secondary text-sm">{user.email}</p>
            </div>
          </div>

          <Link to="/profile/edit">
            <Button variant="outline">Редактировать</Button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <div className="mt-6 flex w-full flex-col gap-4 lg:max-w-xs">
          <FormField label="Язык" htmlFor="language">
            <Select
              aria-label="Язык"
              options={LANGUAGE_OPTIONS}
              value={user.language ?? 'ru'}
              onValueChange={(value) => handleUpdate({ language: value as 'ru' | 'en' })}
              fullWidth
            />
          </FormField>

          <Checkbox
            id="notify"
            checked={user.notifyByEmail ?? false}
            onCheckedChange={(checked) => handleUpdate({ notifyByEmail: checked })}
          >
            Уведомлять об изменении статуса заказов по email
          </Checkbox>

          <Link
            to="/orders"
            className="text-accent hover:text-accent-hover text-sm font-semibold"
          >
            История заказов
          </Link>
        </div>

        <img
          src={meditation}
          alt=""
          aria-hidden="true"
          className="mt-6 ml-auto hidden w-full max-w-xl lg:block"
        />
      </div>
    </div>
  );
}

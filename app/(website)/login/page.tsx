'use client';

import Input from '@/components/ui/Input';
import { validateEmail } from '@/lib/validations';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function LoginPage() {
  const router = useRouter();
  const { token, isAdmin } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);

    if (email && isEmailValid && password) {
      setIsRegistering(true);

      setTimeout(() => {
        toast.success('Logged in successfully');
        setIsRegistering(false);
        router.push('/');
      }, 2000);
    } else {
      if (!email) {
        setIsEmailError(true);
      }

      if (!isEmailValid) {
        setIsEmailError(true);
      }

      if (!password) {
        setIsPasswordError(true);
      }
    }
  };

  useEffect(() => {
    if (token) {
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, token]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] py-10">
      <section className="w-full max-w-sm h-fit py-8 bg-base-100 border border-base-300/70 rounded-box shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-base-content">Welcome Back</h1>
        <form className="flex flex-col items-center justify-center gap-3.5 p-5 w-full">
          <Input
            name="email"
            label="Email"
            autoComplete="email"
            hasError={isEmailError}
            placeholder="Enter your email"
            type="email"
            maxLength={200}
            value={email}
            setValue={(value) => {
              setEmail(value);
              setIsEmailError(false);
            }}
            setHasError={(error) => {
              setIsEmailError(error);
            }}
            required={true}
            showHelpText={isEmailError}
            helpText={
              isEmailError && email === '' ? 'Required' : 'Please enter a valid email address'
            }
          />
          <Input
            name="password"
            label={<span className="flex justify-between items-center w-full">Password</span>}
            autoComplete="current-password"
            hasError={isPasswordError}
            placeholder="Enter your password"
            type={'password'}
            maxLength={200}
            value={password}
            setValue={(value) => {
              setPassword(value);
              setIsPasswordError(false);
            }}
            setHasError={(error) => {
              setIsPasswordError(error);
            }}
            required={true}
            showHelpText={true}
            helpText={
              <span className="flex justify-between items-center w-full">
                <span>{isPasswordError ? 'Required' : ''}</span>
              </span>
            }
            isPassword={true}
          />
          <button
            type="submit"
            className="btn btn-primary btn-block"
            onClick={(e) => {
              handleSubmit(e);
            }}
          >
            {isRegistering ? <span className="loading loading-spinner"></span> : 'Login'}
          </button>

          <Link
            className="btn btn-link btn-ghost hover:text-secondary no-underline text-base font-normal"
            href="/register"
          >
            Don’t have an account? Register Now
          </Link>
        </form>
      </section>
    </main>
  );
}

export default LoginPage;

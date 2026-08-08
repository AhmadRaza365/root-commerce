'use client';

import Input from '@/components/ui/Input';
import { validateEmail } from '@/lib/validations';
import { RootState } from '@/redux/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

function RegisterPage() {
  const router = useRouter();
  const { token, isAdmin } = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [isEmailError, setIsEmailError] = useState<boolean>(false);
  const [isPasswordError, setIsPasswordError] = useState<boolean>(false);
  const [isFirstNameError, setIsFirstNameError] = useState<boolean>(false);
  const [isLastNameError, setIsLastNameError] = useState<boolean>(false);
  const [isPhoneNumberError, setIsPhoneNumberError] = useState<boolean>(false);
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState<boolean>(true);

  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isEmailValid = validateEmail(email);

    if (
      email &&
      isEmailValid &&
      password &&
      firstName &&
      lastName &&
      phoneNumber &&
      phoneNumber.length === 11
    ) {
      setIsRegistering(true);

      setTimeout(() => {
        toast.success('Registration successful');
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
      if (!firstName) {
        setIsFirstNameError(true);
      }
      if (!lastName) {
        setIsLastNameError(true);
      }
      if (!phoneNumber) {
        setIsPhoneNumberError(true);
      }
      if (phoneNumber && phoneNumber.length !== 11) {
        setIsPhoneNumberError(true);
        setIsPhoneNumberValid(false);
      } else {
        setIsPhoneNumberValid(true);
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
        <h1 className="text-3xl font-bold text-center text-base-content">Create Your Account</h1>
        <form className="flex flex-col items-center justify-center gap-3.5 p-5 w-full">
          <Input
            name="firstName"
            label="First Name"
            autoComplete="given-name"
            hasError={isFirstNameError}
            placeholder="Enter your first name"
            type="text"
            maxLength={200}
            value={firstName}
            setValue={(value) => {
              setFirstName(value);
              setIsFirstNameError(false);
            }}
            setHasError={(error) => {
              setIsFirstNameError(error);
            }}
            required={true}
            showHelpText={isFirstNameError}
            helpText={isFirstNameError && firstName === '' ? 'Required' : ''}
          />
          <Input
            name="lastName"
            label="Last Name"
            autoComplete="family-name"
            hasError={isLastNameError}
            placeholder="Enter your last name"
            type="text"
            maxLength={200}
            value={lastName}
            setValue={(value) => {
              setLastName(value);
              setIsLastNameError(false);
            }}
            setHasError={(error) => {
              setIsLastNameError(error);
            }}
            required={true}
            showHelpText={isLastNameError}
            helpText={isLastNameError && lastName === '' ? 'Required' : ''}
          />
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
            name="phoneNumber"
            label="Phone Number"
            autoComplete="tel"
            placeholder="Enter your phone number"
            type="tel"
            maxLength={11}
            value={phoneNumber}
            setValue={(value) => {
              if (/^[0-9()]*$/.test(value)) {
                setPhoneNumber(value);
                setIsPhoneNumberError(false);
                setIsPhoneNumberValid(true);
              } else {
                setIsPhoneNumberError(true);
              }
            }}
            setHasError={(error) => {
              setIsPhoneNumberError(error);
            }}
            required={true}
            showHelpText={true}
            hasError={isPhoneNumberError}
            helpText={
              isPhoneNumberError && phoneNumber === ''
                ? 'Required'
                : isPhoneNumberError && !isPhoneNumberValid
                  ? 'Please enter a valid phone number (03001234567)'
                  : 'Format: 03001234567'
            }
          />
          <Input
            name="password"
            label="Password"
            autoComplete="new-password"
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
            {isRegistering ? <span className="loading loading-spinner"></span> : 'Register'}
          </button>

          <Link
            className="btn btn-link btn-ghost hover:text-secondary no-underline text-base font-normal"
            href="/login"
          >
            Already have an account? Login Now
          </Link>
        </form>
      </section>
    </main>
  );
}

export default RegisterPage;

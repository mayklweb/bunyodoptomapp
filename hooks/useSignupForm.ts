import { useState } from "react";
import { useSignup } from "@/hooks/useSignup";
import { useRouter } from "expo-router";

type FocusedField = "fullName" | "phone" | "password" | null;

const getRawPhone = (value: string): string =>
  value.replace(/\D/g, "").replace(/^998/, "");

const isValidUzPhone = (phone: string): boolean => {
  const prefixes: string[] = ["70", "71", "77", "88", "90", "91", "95", "99"];
  const prefix: string = phone.slice(0, 2);
  return prefixes.includes(prefix) && phone.length === 9;
};

export function useSignupForm() {
  const router = useRouter();

  const [fullName, setFullNameState] = useState("");
  const [phone, setPhoneState] = useState("");
  const [password, setPasswordState] = useState("");
  const [focusedField, setFocusedField] = useState<FocusedField>(null);

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const signupMutation = useSignup();

  const setFullName = (value: string) => {
    setFullNameState(value);
    if (nameError) setNameError(null);
  };

  const setPhone = (value: string) => {
    setPhoneState(value);
    if (phoneError) setPhoneError(null);
  };

  const setPassword = (value: string) => {
    setPasswordState(value);
    if (passwordError) setPasswordError(null);
  };

  const handleSignup = () => {
    const raw = getRawPhone(phone);
    let hasError = false;

    if (!fullName.trim()) {
      setNameError("Ism familiyangizni kiriting");
      hasError = true;
    } else {
      setNameError(null);
    }

    if (!raw) {
      setPhoneError("Telefon raqamni kiriting");
      hasError = true;
    } else if (!isValidUzPhone(raw)) {
      setPhoneError("Telefon raqam noto'g'ri formatda");
      hasError = true;
    } else {
      setPhoneError(null);
    }

    if (!password) {
      setPasswordError("Parolni kiriting");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Parol kamida 6 belgidan iborat bo'lishi kerak");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) {
      setFormError(null);
      return;
    }

    setFormError(null);

    signupMutation.mutate(
      { name: fullName.trim(), phone: raw, password },
      {
        onSuccess: () => {
          router.replace("/profile");
        },
        onError: (error: any) => {
          setFormError("Ro'yxatdan o'tishda xatolik yuz berdi");
        },
      },
    );
  };

  return {
    fullName,
    phone,
    password,
    focusedField,
    nameError,
    phoneError,
    passwordError,
    formError,
    isPending: signupMutation.isPending,

    setFullName,
    setPhone,
    setPassword,
    setFocusedField,

    handleSignup,
  };
}

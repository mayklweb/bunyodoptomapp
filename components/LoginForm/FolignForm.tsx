import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react-native";
import Input from "./components/Input";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Input
        label="Email"
        placeholder="email@misol.com"
        value={email}
        onChangeText={setEmail}
        icon={<Mail />}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Parol"
        placeholder="Parolingizni kiriting"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        icon={showPassword ? <EyeOff /> : <Eye />}
        iconPosition="right"
        onIconPress={() => setShowPassword((p) => !p)}
        error={password.length > 0 && password.length < 6 ? "Kamida 6 ta belgi" : undefined}
      />
    </>
  );
}
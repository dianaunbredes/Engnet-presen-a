"use client";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
   const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    async function fazerLogin(evento: React.SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    const resposta = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        email: email,
        senha: senha
    })
});
    const dados = await resposta.json();

    if (!resposta.ok) {
    alert(dados.message || "Erro ao realizar login");
    return;
    }
    sessionStorage.setItem("token", dados.access_token);

    console.log("Login realizado:", dados);
    router.push("/");
}
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 p-8">

        <h1 className="mb-6 text-center text-2xl font-bold text-white">
          Sistema de Presença
        </h1>

        <form className="flex flex-col gap-4" onSubmit={fazerLogin}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              E-mail
            </label>

            <input
              type="email"
              id="email"
              name="email"
              onChange={(evento) => setEmail(evento.target.value)}
              required
              placeholder="Digite seu e-mail"
              className="rounded-lg bg-neutral-800 p-3 text-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="senha" className="text-white">
              Senha
            </label>

            <input
              type="password"
              id="senha"
              name="senha"
              onChange={(evento) => setSenha(evento.target.value)}
              required
              placeholder="Digite sua senha"
              className="rounded-lg bg-neutral-800 p-3 text-white"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-white p-3 font-bold text-black hover:bg-gray-300"
          >
            Entrar
          </button>
        </form >

      </div>
    </div>
  );
}
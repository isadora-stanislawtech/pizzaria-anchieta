"use client";

import React from "react";
import { useCart } from "@/app/components/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Categoria = "pizza" | "bebida" | "outros";

type ProdutoResumo = {
  id: string;
  categoria?: string; // pode vir qualquer string do storage
};

// type guard básico (sem `any`)
function isProdutoResumo(x: unknown): x is ProdutoResumo {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string";
}

function parseProdutosLocal(): ProdutoResumo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("produtos");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isProdutoResumo);
  } catch {
    return [];
  }
}

export default function CarrinhoPage() {
  const { items, removeItem, updateQty, clear } = useCart();
  const router = useRouter();

  if (items.length === 0)
    return (
      <div className="p-6 text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Seu carrinho está vazio</h1>
        <button
          className="bg-[var(--primary)] text-white px-4 py-2 rounded font-sans"
          onClick={() => router.push("/cardapio")}
        >
          Ver Cardápio
        </button>
      </div>
    );

  const totalCorrigido = items.reduce(
    (s, i) => s + Number(i.preco) * Number(i.quantidade),
    0
  );

  // lê uma vez (em vez de a cada item)
  const produtosLS = parseProdutosLocal();

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Seu Carrinho</h1>
      <div className="space-y-4">
        {items.map((item) => {
          // tenta obter categoria do LS
          const fromStore = produtosLS.find((p) => p.id === item.id);
          let categoria: Categoria | undefined =
            (fromStore?.categoria as Categoria | undefined) ?? undefined;

          // fallback heurístico
          if (!categoria) {
            const t = item.titulo?.toLowerCase() ?? "";
            if (t.includes("pizza")) categoria = "pizza";
            else if (
              t.includes("coca") ||
              t.includes("guaran") ||
              t.includes("suco") ||
              t.includes("água") ||
              t.includes("agua") ||
              t.includes("bebida")
            )
              categoria = "bebida";
            else categoria = "outros";
          }

          return (
            <div
              key={item.id + (item.tamanho || "")}
              className="flex items-center gap-4 bg-white p-4 rounded shadow font-sans"
            >
              {item.imagem && (
                <Image
                  src={item.imagem}
                  alt={item.titulo}
                  width={140}
                  height={90}
                  className="object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h2 className="font-bold font-sans">{item.titulo}</h2>

                {categoria === "pizza" && (
                  <>
                    {item.tamanho && (
                      <p className="text-sm text-gray-600 font-sans">
                        Tamanho: {item.tamanho}
                      </p>
                    )}
                    {item.descricao && (
                      <p className="text-xs text-gray-500 font-sans">
                        {item.descricao}
                      </p>
                    )}
                  </>
                )}

                {categoria !== "pizza" && item.descricao && (
                  <p className="text-xs text-gray-500 font-sans">
                    {item.descricao}
                  </p>
                )}

                <p className="font-sans">
                  R$ {(Number(item.preco) * Number(item.quantidade)).toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  value={item.quantidade}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                  className="w-20 border rounded px-2 py-1 font-sans"
                />
                <button
                  className="text-red-600 font-sans"
                  onClick={() => removeItem(item.id)}
                >
                  Remover
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <div>
          <p className="text-xl font-bold font-sans">
            Total: R$ {totalCorrigido.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600 font-sans">
            Entrega calculada no checkout
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded font-sans" onClick={() => clear()}>
            Limpar
          </button>
          <button
            className="bg-[var(--primary)] text-white px-4 py-2 rounded font-sans"
            onClick={() => router.push("/checkout")}
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}
